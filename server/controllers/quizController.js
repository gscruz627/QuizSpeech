import express from "express"
import Quiz from "../models/Quiz.js"
import User from "../models/User.js"
import { optionalToken, verifyToken } from "../middleware/verifyToken.js"

const quizController = express.Router();


quizController.get("/all", async(req,res) => {
    const quizes = await Quiz.find().limit(20);
    return res.status(200).json({quizes:quizes})
})
quizController.get("/user/:username", optionalToken, async (req, res) => {
    const username = req.params["username"]
    const user = await User.findOne({ username: username })
    let quizes = await Quiz.find({ owner: user._id })
    // If there is at least 1 quiz and you are not the owner return only public
    // If you are the user return all.
    if (req.user) {
        const userId = req.user.userId;
        if (quizes[0] && !(quizes[0].owner === userId)) {
            quizes = await Quiz.find({ owner: user._id, public: true })
        }
    }
    return res.status(200).json({ quizes: quizes })
})

quizController.get("/search/:term", async (req, res) => {
    const searchTerm = req.params["term"];
    // Create custom regex term where the term contains the term.
    const regexTerm = new RegExp(searchTerm, "i");
    // Only return public quizes
    const quizes = await Quiz.find({ title: regexTerm, public: true });
    return res.status(200).json({ quizes: quizes })
})

quizController.get("/quiz/:id", optionalToken, async (req, res) => {
    try {
        const id = req.params["id"];
        const quiz = await Quiz.findById(id)
        if (!quiz) {
            return res.status(404).json({ message: "Not Found" })
        }
        if (req.user) {
            const userId = req.user.userId
            // If this is a private quiz and you are not the user, return not found
            if ((quiz.public === false) && (quiz.owner !== userId)) {
                return res.status(404).json({ message: "Not Found" })
            }
        }
        const user = await User.findById(quiz.owner)
        return res.status(200).json({ quiz: quiz, user: user.username })
    } catch (err) { console.log(err) }
})

quizController.post("/create", verifyToken, async (req, res) => {
    const title = req.body["title"]
    const owner = req.body["owner"]
    const modelPublic = req.body["public"]
    const questions = req.body["questions"]
    const answers = req.body["answers"]
    const newQuiz = new Quiz({
        title: title,
        owner: owner,
        public: modelPublic,
        questions: questions,
        answers: answers
    })
    await newQuiz.save()
    return res.status(201).json({ quiz: newQuiz })
})

quizController.put("/rename", verifyToken, async (req, res) => {
    const id = req.body["id"]
    const newtitle = req.body["title"]
    let quiz = await Quiz.findById(id)
    if (!quiz) {
        return res.status(404).json({ message: "Not Foud" })
    }
    quiz.title = newtitle;
    await quiz.save();
    quiz = await Quiz.findById(id)
    return res.status(200).json({ quiz: quiz })
})

quizController.put("/:id/add", verifyToken, async (req, res) => {
    const id = req.body["id"];
    const newQuestion = req.body["newQuestion"]
    const newAnswer = req.body["newAnswer"]
    let quiz = await Quiz.findById(id);
    if (!quiz) {
        return res.status(404).json({ message: "Not found" })
    }
    // use .concat to join the new questions and answers
    quiz.questions.push(newQuestion);
    quiz.answers.push(newAnswer);
    await quiz.save();
    quiz = await Quiz.findById(id);
    return res.status(200).json({ quiz: quiz })
})

quizController.delete("/delete", verifyToken, async (req, res) => {
    const id = req.body["id"]
    const userId = req.body["userId"]
    const quiz = await Quiz.findById(id);
    if (userId !== quiz.owner) {
        return res.status(403).json({ message: "Not the owner" })
    }
    await Quiz.findByIdAndDelete(id)
    const quizes = await Quiz.find({ owner: userId })
    return res.status(200).json({ quizes: quizes })
})

quizController.delete("/deleteQuestion", verifyToken, async (req, res) => {
    const id = req.body["id"];
    const questionIndex = req.body["questionIndex"];
    let quiz = await Quiz.findById(id);
    if (!quiz) {
        return res.status(404).json({ message: "Not Found" })
    }
    // splice the question and answer at that index.
    
    quiz.questions.splice(questionIndex, 1)
    quiz.answers.splice(questionIndex,1)
    await quiz.save();
    res.status(200).json({ quiz: quiz })
})

export default quizController;

// ADD documentation, add try catch on all
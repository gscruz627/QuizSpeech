import express from "express"
import Quiz from "../models/Quiz.js"
import User from "../models/User.js"
import { optionalToken, verifyToken } from "../middleware/verifyToken.js"

const quizController = express.Router();


quizController.get("/user/:username", optionalToken, async (req, res) => {
    const username = req.params["username"]
    const userId = req.user.userId;
    const user = await User.findOne({username: username})
    let quizes = await Quiz.find({ owner: user._id})
    // If there is at least 1 quiz and you are not the owner return only public
    if (quizes[0] && !(quizes[0].owner === userId)) {
        quizes = quizes.filter((quiz) => quiz.public === true)
    }
    // If you are the user return all.
    return res.status(200).json({ quizes: quizes })
})

quizController.get("/search/:term", async (req, res) => {
    const searchTerm = req.params["term"];
    console.log(searchTerm)
    // Create custom regex term where the term contains the term.
    const regexTerm = new RegExp(searchTerm, "i");
    // Only return public quizes
    const quizes = await Quiz.find({ title: regexTerm, public: true });
    return res.status(200).json({ quizes: quizes })
})

quizController.get("/quiz/:id", optionalToken, async (req, res) => {
    try{
    const id = req.params["id"];
    const userId = req.user.userId
    const quiz = await Quiz.findById(id)
    if (!quiz) {
        return res.status(404).json({ message: "Not Found" })
    }
    // If this is a private quiz and you are not the user, return not found
    if ((quiz.public === false) && (quiz.owner !== userId)) {
        return res.status(404).json({ message: "Not Found" })
    }
    const user = await User.findById(quiz.userId)
    return res.status(200).json({ quiz: quiz, user: user })
} catch(err) { console.log(err) }
})

quizController.post("/create", verifyToken, (req, res) => {
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
    newQuiz.save()
    return res.status(201).json({quiz: newQuiz})
})

quizController.put("/rename", verifyToken, async (req, res) => {
    const id = req.body["id"]
    const newtitle = req.body["title"]
    let quiz = await Quiz.findById(id)
    if(!quiz){
        return res.status(404).json({message: "Not Foud"})
    }
    quiz.title = newtitle;
    title.save();
    quiz = await Quiz.findById(id)
    return res.status(200).json({quiz: quiz})
})

quizController.put("/:id/add", verifyToken, async (req, res) => {
    const id = request.body["id"];
    const newquestions = request.body["newquestions"]
    const newanswers = request.body["newanswers"]
    let quiz = await Quiz.findById(id);
    if(!quiz){
        return res.status(404).json({message: "Not found"})
    }
    // use .concat to join the new questions and answers
    quiz.questions.concat(newquestions);
    quiz.answers.concat(newanswers);
    quiz.save();
    quiz = await Quiz.findById(id);
    return res.status(200).json({quiz: quiz})
})


quizController.delete("/delete", verifyToken, async (req, res) => {
    const id = request.body["id"];
    const questionsIndexes = request.body["questionsIndexes"];
    let quiz = await Quiz.findById(id);
    if(!quiz){
        return res.status(404).json({message: "Not Found"})
    }
    // Delete the indexes and splice the questions and answers at those indexes.
    while (questionsIndexes.length > 0) {
        const index = questionsIndexes.pop();
        quiz.questions.splice(index, 1);
        quiz.answers.splice(index, 1);
    }
    quiz.save();
    res.status(200).json({quiz: quiz})
})

export default quizController;

// ADD documentation, add try catch on all
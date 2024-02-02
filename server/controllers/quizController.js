import express from "express"
import Quiz from "../models/Quiz"
import User from "../models/User"
import { verifyToken } from "../middleware/verifyToken"

const quizController = express.Router();

// If you are the user, return both public and private
// Otherwise return only public 
quizController.get("/user/:id", verifyToken, async (req, res) => {
    const id = req.params["id"]
    const userId = req.params["userId"] // User sending the request
    const quizes = await Quiz.find({ userId: id })
    // If there is at least 1 quiz and you are not the owner return only public
    if (quizes[0] && !(quizes[0].userId === userId)) {
        quizes = quizes.filter((quiz) => quiz.public === true)
    }
    // If you are the user return all.
    return res.status(200).json({ quizes: quizes })
})

quizController.get("/search/:term", async (req, res) => {
    const searchTerm = req.params["term"];
    const regexTerm = new RegExp(searchTerm, "i");
    const quizes = await Quiz.find({ title: regexTerm, public: true });
    return res.status(200).json({ quizes: quizes })
})

quizController.get("/:id", async (req, res) => {
    const id = req.params["id"];
    const userId = req.headers["userId"];
    const quiz = await Quiz.findById(id)
    if (!quiz) {
        return res.status(404).json({ message: "Not Found" })
    }
    if ((quiz.public === False) && (quiz.userId !== userId)) {
        return res.status(404).json({ message: "Not Found" })
    }
    const user = await User.findById(quiz.userId)
    return res.status(200).json({ quiz: quiz, user: user })
})

quizController.post("/create", verifyToken, (req, res) => {
    const title = req.body["title"]
    const owner = req.body["userId"]
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
    while (questionsIndexes.length > 0) {
        const index = questionsIndexes.pop();
        quiz.questions.splice(index, 1);
        quiz.answers.splice(index, 1);
    }
    quiz.save();
    res.status(200).json({quiz: quiz})
})

// ADD documentation, add try catch on all
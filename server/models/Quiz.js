import mongoose from "mongoose";

const QuizSchema = new mongoose.Schema({
    title: {
        required: true,
        type: String
    },
    owner: {
        required: true,
        type: String
    },
    public: {
        required: true,
        type: Boolean
    },
    questions: {
        required: true,
        type: Array
    },
    answers: {
        requied: true,
        type: Array
    }
}, {timestamps: true})

const Quiz = mongoose.model("Quiz", QuizSchema);
export default Quiz;
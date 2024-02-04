import React, { useState } from 'react'
import Navbar from '../components/Navbar'
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const CreateQuiz = () => {
    const SERVER_URL = import.meta.env["VITE_SERVER_URL"]
    const CLIENT_URL = import.meta.env["VITE_CLIENT_URL"]
    const [title, setTitle] = useState("");
    const [publicVal, setPublicVal] = useState(true);
    const [currentQuestion, setCurrentQuestion] = useState("");
    const [currentAnswer, setCurentAnswer] = useState("");
    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState([]);
    const token = useSelector( (state) => state.token);
    const user = useSelector( (state) => state.user)
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (questions.length !== answers.length) {
            alert("You are missing an answer to the last question!")
            return
        }
        const request = await fetch(`${SERVER_URL}/create`, {
            method: "POST",
            headers: {
                "Authentication" : `Bearer ${token}`,
                "Content-Type" : "application/json"
            },
            body: JSON.stringify({
                title: title,
                owner: user._id,
                public: publicVal,
                questions: questions,
                answers: answers,
            })
        })
        const requestJSON = await request.json();
        if(request.ok){
            navigate(`/profile/${user.username}/`)
            return
        }
        alert("Server error")
        return

    }
    return (
        <>
            <Navbar />
            <div>
                <h1>Create a new Quiz</h1>
                <form onSubmit={(e) => handleSubmit(e)}>
                    <label htmlFor="title">Title:</label>
                    <input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} />

                    <label htmlFor="public">Can everyone see this quiz? (public) </label>
                    <input type="checkbox" id="public" checked={publicVal} onChange={(e) => setPublicVal(!publicVal)} />

                    <label htmlFor="newquestion">Add a new question:</label>
                    <input type="text" id="newquestion" value={currentQuestion} onChange={(e) => setCurrentQuestion(e.target.value)} disabled={questions.length > answers.length} />

                    <button type="button" onClick={() => {
                        setQuestions([...questions, currentQuestion]); setCurrentQuestion("")
                    }
                    }>
                        Add
                    </button>

                    <ul>
                        {questions.map((question, i) => (
                            <li key={i} >{question}</li>
                        ))}
                    </ul>

                    <label htmlFor="newanswer">Add a new answer: </label>
                    <input type="text" id="newanswer" value={currentAnswer} onChange={(e) => setCurentAnswer(e.target.value)} disabled={questions.length <= answers.length} />

                    <button type="button" onClick={() => {
                        setAnswers([...answers, currentAnswer]); setCurentAnswer("");
                    }}>
                        Add
                    </button>
                    <ul>
                        {answers.map((answer, i) => (
                            <li key={i}>{answer}</li>
                        ))}
                    </ul>

                    <button type="submit">Create</button>
                </form>
            </div>
        </>
    )
}

export default CreateQuiz
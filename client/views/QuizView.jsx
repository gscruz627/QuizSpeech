import React, { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import { useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'

const QuizView = () => {
    const SERVER_URL = import.meta.env["VITE_SERVER_URL"]
    const [quiz, setQuiz] = useState(null)
    const { quizId } = useParams();
    const token = useSelector( (state) => state.token)
    const handleLoadQuizData = async () => {
        const request = await fetch(`${SERVER_URL}/quiz/${quizId}`, {
            headers: {
                "Authentication": token ? token : null
            }
        })
        const requestJSON = await request.json();
        if (request.ok) {
            setQuiz(requestJSON["quiz"])
            return
        }
        return
    }
    useEffect(() => {
        handleLoadQuizData();
    }, [])
    return (
        <>
            <Navbar />
            {quiz ? (

                <>
                    <h1> {quiz.title}</h1>
                    <h2> Questions </h2>
                    <ul>
                        {quiz.questions.map((question) => (
                            <li>{question}</li>
                        ))}
                    </ul>
                    <h2> Answers </h2>
                    <ul>
                        {quiz.answers.map((answer) => (
                            <li>{answer}</li>
                        ))}
                    </ul>
                </>
            ) : <p>Quiz not found</p>
            }
        </>
    )
}

export default QuizView


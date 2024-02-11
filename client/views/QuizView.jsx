import React, { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import { useNavigate, useParams } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'

const QuizView = () => {

    const SERVER_URL = import.meta.env["VITE_SERVER_URL"]
    const speech = new SpeechSynthesisUtterance();

    const [quiz, setQuiz] = useState(null)
    const [reqUser, setReqUser] = useState("")
    const [isOwner, setIsOwner] = useState(false);
    const [isStart, setIsStart] = useState(false)
    const [addAnswer, setAddAnswer] = useState("");
    const [currentIdx, setCurrentIdx] = useState(0);
    const [addQuestion, setAddQuestion] = useState("");
    const [isShowAnswer, setIsShowAnswer] = useState(false)
    const [isShowQuestions, setIsShowQuestions] = useState(false);
    const [isReadyToCreateQuestion, setIsReadyToCreateQuestion] = useState(false);
    
    const { quizId } = useParams();
    const navigate = useNavigate();
    const token = useSelector((state) => state.token)
    const user = useSelector((state) => state.user)

    const handleLoadQuizData = async () => {
        const request = await fetch(`${SERVER_URL}/quiz/${quizId}`, {
            headers: {
                "Authentication": token ? token : undefined
            }
        })
        const requestJSON = await request.json();
        if (request.ok) {
            setQuiz(requestJSON["quiz"])
            setReqUser(requestJSON["user"])
            return
        }
        return
    }
    useEffect(() => {
        if (quiz && quiz.owner === user._id) {
            setIsOwner(true)
        }
    }, [quiz])
    const handleHear = (text) => {
        speech.text = text
        window.speechSynthesis.speak(speech)
    }
    const handleAddQuestion = async () => {
        if (addQuestion.length < 1 || addAnswer.length < 1) {
            return;
        }
        const request = await fetch(`${SERVER_URL}/${quizId}/add`, {
            method: "PUT",
            headers: {
                "Authentication": token ? token : null,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                id: quizId,
                newQuestion: addQuestion,
                newAnswer: addAnswer
            })
        })
        const requestJSON = await request.json();
        if (request.ok) {
            setQuiz(requestJSON["quiz"])
        }
    }
    const handleDeleteQuestion = async (i) => {
        const request = await fetch(`${SERVER_URL}/deleteQuestion`, {
            method: "DELETE",
            headers: {
                "Authentication": token ? token : null,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                id: quizId,
                questionIndex: i
            })
        })
        const requestJSON = await request.json();
        if (request.ok) {
            setQuiz(requestJSON["quiz"])
        }
    }
    const handleDeleteQuiz = async () => {
        const sure = confirm("Are you sure you want to delete this quiz? (No Way Back)")
        if (!sure) {
            return;
        }
        const request = await fetch(`${SERVER_URL}/delete`, {
            method: "DELETE",
            headers: {
                "Authentication": token ? token : null,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                id: quizId,
                userId: user._id
            })
        })
        if (request.ok) {
            navigate(`/profile/${user.username}`)
        }
    }
    useEffect(() => {
        handleLoadQuizData();
    }, [])
    return (
        <>
            <Navbar />
            <section>

                {quiz ? (

                    <>
                        {isStart ? (
                            <div className="quiz-preview-container">
                                <h1 style={{ margin: "1rem", textAlign: "center", cursor: "pointer" }} onClick={() => {
                                    setCurrentIdx(0);
                                    setIsStart(false);
                                }}>{quiz.title}</h1>
                                <small style={{ cursor: "pointer" }} onClick={() => navigate(`/profile/${reqUser}`)}>by {reqUser && reqUser}</small>
                                <div className="quiz-game-container">
                                    {currentIdx > 0 &&
                                        (
                                            <i className="fa-solid fa-caret-left" onClick={() => {
                                                currentIdx > 0 && setCurrentIdx(currentIdx - 1)
                                            }}></i>
                                        )}
                                    <div style={{ cursor: "pointer" }} className="game-question" onClick={() => handleHear(quiz.questions[currentIdx])}>
                                        <p>{quiz.questions[currentIdx]}</p>
                                    </div>
                                    <div className="game-answer" onClick={() => { if (isShowAnswer) { setIsShowAnswer(false) } else { setIsShowAnswer(true); handleHear(quiz.answers[currentIdx]) } }}>
                                        {isShowAnswer ? (
                                            <p>{quiz.answers[currentIdx]}</p>
                                        ) : (
                                            <p>Click to Show answer</p>
                                        )}
                                    </div>
                                    {currentIdx < quiz.questions.length - 1 &&
                                        (
                                            <i className="fa-solid fa-caret-right" onClick={() => {
                                                currentIdx < quiz.questions.length - 1 && setCurrentIdx(currentIdx + 1)
                                            }} ></i>
                                        )}
                                </div>
                                <button onClick={() => setIsShowQuestions(!isShowQuestions)} className='mini-box-button' style={{ backgroundColor: "green" }}>{isShowQuestions ? "Hide" : "Show"} list of questions</button>
                                {isShowQuestions &&
                                    <section className="questions-container">
                                        {quiz.questions.map((question, i) => (
                                            <h3 onClick={() => setCurrentIdx(i)} style={{ cursor: "pointer", color: i === currentIdx && "green" }}><i className="fa-solid fa-caret-right"></i> {question}</h3>
                                        ))}
                                    </section>
                                }
                            </div>
                        ) : (
                            <div className="quiz-demo-container">
                                <h1 style={{ margin: "1rem auto", textAlign: "center" }}>{quiz.title}
                                    {isOwner && <i class="fa-solid fa-trash-can" style={{ color: "darkred", cursor: "pointer" }} onClick={() => handleDeleteQuiz()}></i>}</h1>
                                <small onClick={() => navigate(`/profile/${reqUser}`)} style={{ cursor: "pointer", margin: "1rem auto", display: "block" }}>by {reqUser && reqUser}</small>
                                <p>Preview Questions</p>
                                <article>
                                    {quiz.questions.map((question, i) => (
                                        (i < 5) && (
                                            <>
                                                <h3> <i className="fa-solid fa-caret-right"></i> {question} {isOwner && <i style={{ color: "darkred", cursor: "pointer" }} onClick={() => handleDeleteQuestion(i)} class="fa-solid fa-square-minus"></i>}</h3>
                                                <hr />
                                            </>
                                        )
                                    ))}
                                    {isOwner &&
                                        isReadyToCreateQuestion ? (
                                        <div style={{ color: "gray" }}>
                                            <label for="new-question">Question: </label>
                                            <input value={addQuestion} onChange={(e) => setAddQuestion(e.target.value)} style={{ margin: "1rem auto" }} type="text" id="new-question" />

                                            <label for="new-answer">Answer: </label>
                                            <input value={addAnswer} onChange={(e) => setAddAnswer(e.target.value)} style={{ margin: "1rem auto" }} type="text" id="new-answer" />

                                            <button onClick={() => {
                                                handleAddQuestion();
                                                setIsReadyToCreateQuestion(false);
                                                setAddQuestion("");
                                                setAddAnswer("");
                                            }}
                                                style={{ backgroundColor: "gray" }} className="mini-box-button">ADD</button>
                                        </div>
                                    ) : (
                                        isOwner ?
                                            <i onClick={() => setIsReadyToCreateQuestion(!isReadyToCreateQuestion)} style={{ color: "green", cursor: "pointer", fontSize: "24px" }} className="fa-solid fa-circle-plus"></i> : <p></p>
                                    )}
                                </article>
                                <button className="box-button" onClick={() => setIsStart(true)}>Start</button>
                            </div>
                        )}
                        <p style={{ color: "gray", textAlign: "center", marginTop: "1rem"}}>Click on question and answer to speak aloud</p>
                    </>
                ) : <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: "1rem" }}>
                    <i style={{ fontSize: "72px" }} class="fa-regular fa-face-frown-open"></i>
                    <p>Quiz Could not be found</p>
                </div>
                }
            </section>
        </>
    )
}

export default QuizView


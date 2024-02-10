import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams, Link } from 'react-router-dom'
import { setQuiz, setQuizes } from '../store'
import Navbar from '../components/Navbar'

const Profile = () => {
    const SERVER_URL = import.meta.env["VITE_SERVER_URL"]
    const [userDoesNotExist, setUserDoesNotExist] = useState(true)
    const { username } = useParams();
    const user = useSelector((state) => state.user)
    const token = useSelector((state) => state.token)
    const quizes = useSelector((state) => state.quizes)
    const isOwner = user && user.username === username;
    const dispatch = useDispatch()
    const handleLoadUserData = async () => {
        const request = await fetch(`${SERVER_URL}/user/${username}`, {
            headers: {
                "Authentication": token ? `Bearer ${token}` : undefined
            }
        })
        const requestJSON = await request.json();
        if (request.ok) {
            setUserDoesNotExist(false)
            dispatch(setQuizes({ quizes: requestJSON.quizes }))
            return
        }
        return
    }
    const handleEdit = async (title, id) => {
        if (!isOwner) return;
        const newTitle = prompt("Rename this quiz", title)
        const request = await fetch(`${SERVER_URL}/rename`, {
            method: "PUT",
            headers: {
                "Authentication": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                id: id,
                title: newTitle
            })
        })
        const requestJSON = await request.json();
        if (request.ok) {
            dispatch(setQuiz({ quiz: requestJSON["quiz"] }))
            return
        }
        alert("Server Error")
        return
    }
    const handleDelete = async (title, id) => {
        if (!isOwner) return;
        const confirmed = confirm(`Are you sure you will delete this quiz: ${title}?`)
        if (!confirmed) return;
        const request = await fetch(`${SERVER_URL}/delete`, {
            method: "DELETE",
            headers: {
                "Authentication": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                id: id,
                userId: user._id
            })
        })
        const requestJSON = await request.json();
        if (request.ok) {
            dispatch(setQuizes({ quizes: requestJSON["quizes"] }))
            return
        }
        alert("Server Error")
        return

    }
    useEffect(() => {
        handleLoadUserData();
    }, [])
    return (
        <>
            <Navbar />
            <section>
                {userDoesNotExist ? (
                    <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: "1rem" }}>
                        <i style={{ fontSize: "72px" }} class="fa-regular fa-face-frown-open"></i>
                        <p>User Could not be found</p>
                    </div>
                ) : (
                    <>
                        <h1 style={{textAlign:"center"}}>{isOwner ? `${user.username} (Your Profile)` : `${username}'s profile and quizes`}</h1>
                        <div className="profile-container">
                            <ul>
                                {quizes ? quizes.map((quiz) => (
                                    <li>
                                        <Link to={`/quiz/${quiz._id}`}>{quiz.title}</Link> {isOwner && <><i onClick={() => handleEdit(quiz.title, quiz._id)} className="fa-solid fa-pencil"></i> <i onClick={() => handleDelete(quiz.title, quiz._id)} className="fa-solid fa-trash"></i></>}
                                        <hr/>
                                        {quiz.questions.map( (question, i) => (
                                            (i < 3) && (
                                                <small> <i className="fa-solid fa-caret-right"></i> {question}</small>
                                            )
                                        ))}
                                    </li>
                                )) : <p>No quizes to show</p>}
                            </ul>
                        </div>
                    </>
                )}
            </section>
        </>
    )
}

export default Profile
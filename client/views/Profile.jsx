import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams, Link } from 'react-router-dom'
import { setQuizes } from '../store'
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
                "Authentication": isOwner ? token : null
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
    useEffect(() => {
        handleLoadUserData();
    }, [])
    return (
        <>
            <Navbar />
            {userDoesNotExist ? (
                <p> User Could not be found</p>
            ) : (
                <>
                    <h1>{isOwner ? `Hello ${user.username}` : `${username}s profile and quizes`}</h1>
                    <ul>
                        {quizes ? quizes.map((quiz) => (
                            <li>
                                <Link to={`/quiz/${quiz._id}`}>{quiz.title}</Link>
                            </li>
                        )) : <p>No quizes to show</p>}
                    </ul>
                </>
            )}
        </>
    )
}

export default Profile
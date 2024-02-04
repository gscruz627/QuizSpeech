import React from 'react'
import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { setLogin } from '../store'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'

const Login = () => {

    const SERVER_URL = import.meta.env["VITE_SERVER_URL"]
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
            e.preventDefault();
            if (!username) {
                alert("fill fields")
                return
            }
            const request = await fetch(`${SERVER_URL}/auth/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    username: username,
                    password: password
                })
            })
            const requestJSON = await request.json();
            if (request.ok) {
                dispatch(setLogin({ user: requestJSON["user"], token: requestJSON["token"] }))
                navigate("/")
                return
            }
    }
    return (
        <>
            <Navbar />
            <h1>Login</h1>
            <form onSubmit={(e) => handleSubmit(e)}>
                <label for="username">Username: </label>
                <input type="text" id="username" value={username} onChange={(e) => setUsername(e.target.value)} />

                <label for="password">Password: </label>
                <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} />

                <button type="submit">Login</button>
            </form>
        </>
    )
}

export default Login
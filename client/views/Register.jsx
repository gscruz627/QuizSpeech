import React from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'

const Register = () => {

    const SERVER_URL = import.meta.env["VITE_SERVER_URL"]
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        try {
            e.preventDefault();
            if (!username || !password) {
                alert("fill fields")
                return
            }
            if (password !== confirmPassword) {
                alert("passwords dont match")
                return
            }
            const request = await fetch(`${SERVER_URL}/auth/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    username: username,
                    password: password
                })
            })
            if (request.ok) {
                navigate("/")
                return
            }
        } catch (e) {
            alert("Server Error: code:" + e)
        }
    }
    return (
        <>
            <Navbar />
            <h1>Register</h1>
            <form onSubmit={(e) => handleSubmit(e)}>
                <label htmlFor="username">Username: </label>
                <input type="text" id="username" value={username} onChange={(e) => setUsername(e.target.value)} />

                <label htmlFor="password">Password: </label>
                <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} />

                <label htmlFor="confirmPassword">Confirm Password: </label>
                <input type="password" id="confirmPassword" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />

                <button type="submit">Register</button>
            </form>
        </>
    )
}

export default Register
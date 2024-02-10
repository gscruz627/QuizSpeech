import React from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'

const Register = () => {

    const SERVER_URL = import.meta.env["VITE_SERVER_URL"]
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [usernameError, setUsernameError] = useState(false)
    const [passwordError, setPasswordError] = useState(false)
    const [noMatchError, setNoMatchError] = useState(false);
    const [confirmPassword, setConfirmPassword] = useState("")
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        try {
            e.preventDefault();
            if (username.length < 4){
                setUsernameError(true)
                return
            }
            if(password.length < 8){
                setPasswordError(true)
                return
            }
            if (password !== confirmPassword) {
                setNoMatchError(true)
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
            setUsernameError(true)
        } catch (e) {
            alert("Server Error: code:" + e)
        }
    }
    return (
        <>
            <Navbar />
            <section className="">
            <form onSubmit={(e) => handleSubmit(e)} className='registration-box'>
            <h1>Register</h1>
                <label htmlFor="username">Username: </label>

                {usernameError && <div className="error-box">Username taken or less than 3 characters!</div> }
                <small>At least 3 characters</small>
                <input required type="text" id="username" value={username} onChange={(e) => setUsername(e.target.value)} />

                {passwordError && <div className="error-box">Password needs to be 8+ characters</div> }
                <label htmlFor="password">Password: </label>
                <small>At least 8 characters</small>
                <input required type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} />

                {noMatchError && <div className="error-box">Passwords don't match</div> }
                <label htmlFor="confirmPassword">Confirm Password: </label>
                <input required type="password" id="confirmPassword" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />

                <button className="box-button" type="submit">Register</button>
            </form>
            </section>
        </>
    )
}

export default Register
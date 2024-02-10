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
    const [notfoundError, setNotfounderror] = useState(false);
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
        setNotfounderror(true)
    }
    return (
        <>
            <Navbar />
            <section>
                <form onSubmit={(e) => handleSubmit(e)} className='registration-box'>
                    <h1>Login</h1>
                    {notfoundError && <div className="error-box">Username does not exist, or wrong password</div>}

                    <label htmlFor="username">Username: </label>
                    <input required type="text" id="username" value={username} onChange={(e) => setUsername(e.target.value)} />

                    <label htmlFor="password">Password: </label>
                    <input required type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} />

                    <button className="box-button" type="submit">Welcome Back</button>
                </form>
            </section>
        </>
    )
}

export default Login
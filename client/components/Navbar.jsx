import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom';
import { setLogout } from '../store';

const Navbar = () => {
    const isAuth = useSelector((state) => state.token);
    const user = useSelector((state) => state.user);
    const dispatch = useDispatch();
    const [searchTerm, setSearchTerm] = useState("")
    const navigate = useNavigate();

    return (
        <nav>
            <div style={{cursor: "pointer"}} onClick={ () => navigate("/")}>
                <img src="/logo.png" width="40%"></img>
                <h1 style={{ margin: "1rem 0" }}>Quiz Speech</h1>
            </div>
            <div>
                <form onSubmit={(e) => {
                    e.preventDefault();
                    if (searchTerm.length < 2) {
                        alert("Search term has to be at least two letters")
                        return
                    }
                    navigate(`/search-results?q=${searchTerm}`)
                    window.location.reload()
                }}>
                    <input className="search-bar" placeholder="Search" type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                </form>
                <ul>
                    {isAuth ? (
                        <>
                            <Link to={`/profile/${user.username}`}><li><i className="fa-solid fa-user"></i> {user.username}</li></Link>
                            <Link to="/create-quiz"><li><i className="fa-solid fa-plus"></i> New Quiz</li></Link>
                            <li onClick={() => {
                                dispatch(setLogout());
                                navigate("/login")
                            }}> <p><i className="fa-solid fa-right-from-bracket"></i><a >Log Out</a></p></li>
                        </>
                    ) : (
                        <>
                            <Link to="/register"><li>Register</li></Link>
                            <Link to="/login"><li>Login</li></Link>
                        </>
                    )}
                </ul>
            </div>
        </nav>
    )
}

export default Navbar
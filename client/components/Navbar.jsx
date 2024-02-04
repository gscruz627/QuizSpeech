import React, {useState} from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom';
import { setLogout } from '../store';

const Navbar = () => {
    const isAuth = useSelector((state) => state.token);
    const user = useSelector((state) => state.user);
    const dispatch = useDispatch();
    const [searchTerm, setSearchTerm] = useState("")
    const navigate = useNavigate();


    // IMPORTANT TO DO: ADD EDIT NAME, ADD DELETE, ADD READ ALOUD TTS
    // THEN DONE WITH BASICS, PROCEED TO PLAN UI, CONSIDER IMAGE DOWNLOADED
    // BEGIN STYLE NAV, STYLE LOGIN / REGISTER, STYLE PROFILE, LASTLY STYLE
    // QUIZ UI, WITH SWITCHING NOTECARDS, ETC.a
    return (
        <nav>
            <div>
                <h1>Quiz Speech</h1>
            </div>
            <div>
                <ul>
                    {isAuth ? (
                        <>
                            <li><Link to={`/profile/${user.username}`}>{user.username}</Link></li>
                            <li><Link to="/create-quiz">New Quiz</Link></li>
                            <li onClick={() => {
                                dispatch(setLogout())
                            }}> Log Out</li>
                        </>
                    ) : (
                        <>
                            <li><Link to="/register">Register</Link></li>
                            <li><Link to="/login">Login</Link></li>
                        </>
                    )}
                </ul> | 
                <form onSubmit={(e) => {
                    e.preventDefault();
                    if(searchTerm.length < 2){
                        alert("Search term has to be at least two letters")
                        return
                    }
                    navigate(`/search-results?q=${searchTerm}`)
                }}>
                    <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                </form>
            </div>
        </nav>
    )
}

export default Navbar
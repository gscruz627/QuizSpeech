import React, { useEffect } from 'react'
import Navbar from '../components/Navbar'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { setQuizes } from '../store'

const HomePage = () => {
  const SERVER_URL = import.meta.env["VITE_SERVER_URL"]
  const quizes = useSelector( (state) => state.quizes)
  const dispatch = useDispatch();
  const handleLoadQuizes = async () => {
    const request = await fetch(`${SERVER_URL}/all`)
    const requestJSON = await request.json();
    if (request.ok){
      dispatch(setQuizes({quizes: requestJSON["quizes"]}))
    }
  }
  useEffect( () => {
    handleLoadQuizes();
  }, [])
  return (
    <>
      <Navbar />
      <section>
        <h1 style={{ textAlign: "center" }}>
          QuizSpeech
        </h1>
        <div style={{color: "gray", padding: "2rem 1rem"}}>
        <p>Create and explore user created quizes with text to speech
          capabilities. <Link to="/login" style={{ color: "rgb(75,120,192)" }}>Log In</Link> or <Link to="/login" style={{ color: "rgb(75,120,192)" }}>Register</Link>
        </p>
        <p>Here are the most recent user created quizes</p>
        </div>
        <div className='profile-container'>
          <ul>
            {(quizes && quizes.length > 0) ? (
              quizes.map((quiz) => (
                <li>
                  <Link to={`/quiz/${quiz._id}`}>{quiz.title}</Link>
                  <hr />
                  {quiz.questions.map((question, i) => (
                    (i < 3) && (
                      <small> <i className="fa-solid fa-caret-right"></i> {question}</small>
                    )
                  ))}
                </li>
              ))
            ) : (
              <p>No quizes found</p>
            )}
          </ul>
        </div>
      </section>
    </>
  )
}

export default HomePage
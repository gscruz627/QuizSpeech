import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useSearchParams, Link } from 'react-router-dom'
import { setQuizes } from '../store'
import Navbar from '../components/Navbar'

const SearchResults = () => {
    const [searchParams, setSearchParams] = useSearchParams()
    const SERVER_URL = import.meta.env["VITE_SERVER_URL"]
    const term = searchParams.get("q")
    const quizes = useSelector((state) => state.quizes)
    const dispatch = useDispatch()
    const handleSearch = async () => {
        const request = await fetch(`${SERVER_URL}/search/${term}`)
        const requestJSON = await request.json()
        if (request.ok) {
            dispatch(setQuizes({ quizes: requestJSON["quizes"] }))
            return
        }
        dispatch(setQuizes({ quizes: [] }))
        return
    }
    useEffect(() => {
        handleSearch()
    }, [])

    return (
        <>
            <Navbar />
            <section>
                <h1 style={{ textAlign: "center" }}>Search results for "{term}"</h1>

                <div className='profile-container'>
                    <ul>
                        {(quizes && quizes.length > 0) ? (
                            quizes.map((quiz) => (
                                <li>
                                    <Link to={`/quiz/${quiz._id}`}>{quiz.title}</Link>
                                    <hr/>
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

export default SearchResults
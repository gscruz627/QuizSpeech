import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useSearchParams, Link } from 'react-router-dom'
import { setQuizes } from '../store'
import Navbar from '../components/Navbar'

const SearchResults = () => {
    const [searchParams, setSearchParams] = useSearchParams()
    const SERVER_URL = import.meta.env["VITE_SERVER_URL"]
    const term = searchParams.get("q")
    const quizes = useSelector( (state) => state.quizes)
    const dispatch = useDispatch()
    const handleSearch = async () => {
        const request = await fetch(`${SERVER_URL}/search/${term}`)
        const requestJSON = await request.json()
        if (request.ok){
          dispatch(setQuizes({quizes:requestJSON["quizes"]}))
          return
        }
        dispatch(setQuizes({quizes: []}))
        return
      }
    useEffect( () => {
        handleSearch()
    }, [])

    return (
        <>
        <Navbar/>
        <h1>Search results for {term}</h1>

        {(quizes && quizes.length>0)  ? (
            quizes.map( (quiz) => (
                <Link to={`/quiz/${quiz._id}`}>{quiz.title}</Link>
            ))
        ) : (
            <p>No quizes found</p>
        )}
        </>
    )
}

export default SearchResults
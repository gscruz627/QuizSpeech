import React from 'react'
import Navbar from './Navbar'
import { useNavigate } from 'react-router-dom';

const Search = () => {
  const SERVER_URL = import.meta.env["VITE_SERVER_URL"]
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate()
  const handleSubmit = async (e) => {
    e.preventDefault();
    const request = await fetch(`${SERVER_URL}/search/${searchTerm}`)
    const requestJSON = await request.json()
    if (request.ok){
      navigate(`/search-results?q=${searchTerm}`)
    }

  }
  return (
    <form onSubmit={(e) => handleSubmit(e)}>
      <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}/>
    </form>
  )
}

export default Search
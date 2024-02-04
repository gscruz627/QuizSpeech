import {BrowserRouter, Routes, Route, Navigate} from "react-router-dom"
import HomePage from '../views/HomePage'
import Login from '../views/Login'
import Register from '../views/Register'
import QuizView from '../views/QuizView'
import CreateQuiz from '../views/CreateQuiz'
import Profile from '../views/Profile'
import SearchResults from "../views/SearchResults"
import { useSelector } from "react-redux"

function App() {

  const isAuth = useSelector((state) => state.token)
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={ <HomePage/> } />
          <Route path="/login" element={ isAuth ? <Navigate to="/"/> : <Login/> } />
          <Route path="/register" element={ isAuth ? <Navigate to="/"/> :<Register/> } />
          <Route path="/quiz/:quizId" element={ <QuizView/>} />
          <Route path="/create-quiz" element={ isAuth ? <CreateQuiz/> : <Navigate to="/login"/>} />
          <Route path="/profile/:username" element={<Profile/>} /> {/* also see quizes */}
          <Route path="/search-results" element={<SearchResults/>}/>
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App

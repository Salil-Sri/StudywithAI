import './App.css'
import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Login from './pages/Login'
import Dasboard from './pages/Dashboard'
import Home from './pages/Home'
import SignUp from './pages/SignUp'
import ProtectedRoute from './components/ProtectedRoute'
function App() {

  return (
    <Routes>
      <Route path='/' element={<Home/>}/>
      <Route path='/login' element={<Login/>}/>
      <Route path='/signup' element={<SignUp/>}/>
      <Route path='/dashboard' element={<ProtectedRoute><Dasboard/></ProtectedRoute>}/>
    </Routes>
  )
}
export default App

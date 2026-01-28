import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SignUp from './pages/SignUp';
import Home from './pages/Home';
import Login from './pages/Login';
import PlanForm from './features/plans/PlanForm';


function App() {

  return (
    <>
    <ToastContainer position="top-right" autoClose={3000} />
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />  
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/planform" element={<PlanForm />} />
      </Routes>
    </Router>
    </>
  )
}

export default App

import React from 'react'
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Login from './Pages/Login';
import Register from './Pages/Register';
import Home from './Pages/Home';
import NotFound from './Pages/NotFound';
import Success from './Pages/Success';
import Menuitems from './Pages/Menuitems';
import './App.css'
import './login.css';
import './menuitems.css';
const App = () => {
  return (
    <>
      <Router>
        <Routes>
           <Route path='/' element={<Login/>}/>
           <Route path='/register' element={<Register/>}/>
          <Route path='/home' element={<Home/>}/>
          <Route path='/success' element={<Success/>}/>
          <Route path='/menuitems' element={<Menuitems/>}/>
          <Route path='*' element={<NotFound/>}/>
        </Routes>
        <Toaster/>
      </Router>
    </>
  )
}

export default App

import './App.css';
import { Routes, Route, Navigate } from 'react-router-dom'
import AuthorRecieps from './pages/AuthorRecieps';
import React from 'react';
import Enter from './pages/Enter';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Recieps from './pages/Recieps';
import ReciepsItem from './pages/ReciepsItem';
import OurRecieps from './pages/OurRecieps';
import SaveRecieps from './pages/SaveRecieps';
import Error from './pages/Error';
import CreateRecieps from './pages/CreateRecieps';

function App() {
  if (localStorage.getItem('userId')) {
    return (
      <Routes>
        <Route path="/" element={<Navigate to="/recieps" />} />
        <Route path='/profile' element={<Profile />} />{}
        <Route path='/recieps' element={<Recieps />} />{}
        <Route path='/recieps/:id' element={<ReciepsItem />} />{}
        <Route path='/recieps/author/:id' element={<AuthorRecieps />} />{}
        <Route path='/our_recieps' element={<OurRecieps />} />{}
        <Route path='/our_recieps/create' element={<CreateRecieps />} />{}
        <Route path='/save_recieps' element={<SaveRecieps />} />
        <Route path='*' element={<Error />} />
      </Routes>
    )
  } else {
    return (
      <Routes>
        <Route path='/' element={<Enter />} />{}
        <Route path='/register' element={<Register />} />{}
        <Route path='*' element={<Error />} />
      </Routes>
    )
  }
}

export default App;
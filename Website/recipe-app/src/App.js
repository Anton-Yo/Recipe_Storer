import React, {useState, useEffect} from "react";
import { Routes, Route, NavLink } from "react-router-dom";
import api from "./api";
import './App.css';
import DisplayInfo from './Pages/DisplayInfo';
import NavBar from './Components/Navbar'
import CreateRecipe from './Pages/CreateRecipe';
import Home from './Pages/Home';


const App = () => {

  return (
      <div> 
      
        <NavBar />
        <Routes>
          <Route path="" element={<Home/>}/>
          <Route path="/display" element={<DisplayInfo/>} />
          <Route path="/create" element={<CreateRecipe/>} />
        </Routes>

      </div>
  )
}

export default App;
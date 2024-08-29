import React from "react"
import { NavLink } from "react-router-dom";
import '../App.css'


const NavBar = () => {

  return (
      <nav className='navbar navbar-dark bg-primary'>
        <div className='container-fluid'>
            <NavLink to="/" className= "btn btn primary"> Home </NavLink>
            <NavLink to="/choose" className= "btn btn primary"> Choose a recipe </NavLink>
            <NavLink to="/create" className= "btn btn primary"> Create </NavLink>
            <NavLink to="/display" className= "btn btn primary"> Display page </NavLink>
        </div>
      </nav>
  )
}

export default NavBar;
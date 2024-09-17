import React from "react"
import { NavLink } from "react-router-dom";
import '../App.css'


const NavBar = () => {

  return (
    <nav className='navbar navbar-dark bg-dark '>
      <div className='d-flex flex-lg-row flex-column justify-content-center justify-content-lg-evenly container-fluid'>
          <NavLink to="/" className="nav-link text-light"> <h4>Home</h4> </NavLink>
          <NavLink to="/choose" className= "nav-link text-light"> <h4>Choose a recipe</h4> </NavLink>
          <NavLink to="/create" className= "nav-link text-light font-weight-bold"> <h4>Create</h4> </NavLink>
          <NavLink to="/display" className= "nav-link text-light"> <h4>Display page</h4> </NavLink>
      </div>
    </nav>
  )
}

export default NavBar;
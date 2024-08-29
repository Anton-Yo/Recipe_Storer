import React from "react"
import api from "../api"
import '../App.css'


const Home = () => {

  const print = () => {
      console.log(process.env.REACT_APP_VERCEL_URL)
      console.log('https://recipe-storer-alpha.vercel.app/')
      console.log('https://recipe-storer-git-main-anton-yos-projects.vercel.app/')
  };

  const printLoc = () => {
    console.log(window.location.origin)
};

  return (
    <div className=" mt-5 display-wrapper container">
      <h3 className="mt-5"> Welcome </h3>
      
      <h6 className="mt-4"> I wanted to create an application where you can store and find your own recipes
        <br></br> <br></br>
           So I used React and a Python backend and database to build this little website. With only a little experience in both, this was a great opportunity to learn new technologies and languages.
        <br></br> <br></br>
            To check out available recipes, go to 'Choose a Recipe',
            <br></br>
            To create your own recipe, go to 'Create', 
            <br></br>
            Going straight to the Display Page will let you see the very first entry. For now, I've kept it around for testing.
            <br></br>
            <br></br> 
            
            For major features, this is where I'm leaving the project for now. There's a couple last things to polish which I will do when I have time.
            <br></br> <br></br> 
            
      </h6>

      <h6 className="mt-2"> I will record other ideas here for the future: </h6>
      <ul className="home-list"> 
        <li>
            Minor: Downloadable JSON file for each recipe. 
        </li>
        <li>
            Minor: Add back button to navigate between sections in 'Create page' 
        </li>
        <li>
            Minor: Auto create obj if form is full on create page 
        </li>
        <li>
            Minor: Optimise website (specifically display page) for mobile. Because realistically thats what will be used for viewing the website when cooking.
        </li>
        <li>
            Major: Add ability to edit a recipe, on the display page.
        </li>
        <li>
            Major: Add ability to add pictures for the recipe. Currently, I'm not sure where to store a bunch of images online for this website to access :(
        </li>
        <li>
            Major: Search bar for 'Choose a Recipe page'
        </li>
        <li>
            Major: Add a User database and login system, so each person's recipe collection can be separated instead of being contained in one big database
        </li>
      </ul>
    </div>
  );
};

export default Home;
import React, {useState, useEffect} from "react"
import api from "../api"
import '../App.css'
import {useNavigate} from 'react-router-dom'
import { isMobile } from 'react-device-detect';


const CreateRecipe = () => {
  const [recipes, setRecipes] = useState([]);
  const [isLarge, SetIsLarge] = useState(window.innerWidth > 992)

  let navigate = useNavigate()

  const fetchRecipes = async() => {
    const response = await api.get("/recipes");
    setRecipes(response.data)
    console.log(response.data);
  };

  useEffect(() => {
    fetchRecipes();


    //Add listener to update page when dimensions change. to swap between 2/4 boxes per row
    window.addEventListener('resize', checkSize);
    return () => window.removeEventListener('resize', checkSize);
  }, []);

  const handleDelete = async(recipe_id) => {
    var response;
    try {
      response = await api.delete(`/recipes/${recipe_id}`);
      console.log(response.data);
    }
    catch (error)
    {
      console.error("Error deleting recipe:", error);
    }     
    fetchRecipes()
  }

  const getCookTime = (recipe) => {
    const time = recipe.cook_time
    const mins = time % 60
    const hrs = (time - mins) / 60;
    var resultStr = hrs >= 1 ? `${hrs}h ${mins}mins` : `${mins}mins`
    return resultStr
  }

  const goToPage = (recipe_id) => {
    navigate("/display", {state: recipe_id});
    console.log(`Going to the recipe with an id of ${recipe_id}`)
  }

  //Based off 992 px standard for large from bootstrap
  const checkSize = () => {
    SetIsLarge(window.innerWidth > 992)
  }

  const mobileCheck = () => {
    //If window is small or mobile, use 45% size for boxes for 2 per row.
    if(!isLarge || isMobile)
    {
      return "w-45 p-2 mr-1 mt-2 mb-2 shadow bg-white"
    }
    else //Otherwise use 20% for 4 boxes per row
    {
  
      return "w-20 p-2 mr-1 mt-2 mb-2 shadow bg-white"
    }
  }

  return (
    <div className="container">
      <h1 className="text-center m-4">Select A Recipe</h1>

      <div id="recipe-select-container" className="d-flex flex-wrap bg-papaya border border-dark border-5">
        {recipes.map((recipe) => (
          <button className={mobileCheck()} key={recipe.id} onClick={() => goToPage(recipe.id)}>
            <div className="recipe-button-info">
              <h4> {recipe.name} </h4>
              <p> {recipe.desc} </p>

              <div>
                <div className="container">
                  <div className="row">
                    <div className="col-6 col-md-6 text-decoration-underline"> <h6>Time</h6> </div>
                    <div className="col-6 col-md-6 text-decoration-underline"> <h6>Cuisine</h6> </div>
                  </div>
                  <div className="row"> 
                    <div className="col-6 col-md-6"> {getCookTime(recipe)} </div>
                    <div className="col-6 col-md-6"> {recipe.cuisine.name} </div>
                  </div>
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>

      <h4 className="text-center mt-5"> Deleting table </h4>
      <table className="table table-striped table-bordered table-hover mt-3">
        <thead>
          <tr>
            <th>Name</th>
            <th>Description</th>
            <th>Cuisine</th>
            <th className="text-center">Delete?</th>
          </tr>
        </thead>

        <tbody>
          {recipes.map((recipe) => (
            <tr key={recipe.id}>
              <td>{recipe.name}</td>
              <td>{recipe.desc}</td>
              <td>{recipe.cuisine.name}</td>
              <td>
                <div className="w-100 d-flex justify-content-center">
                  <button onClick={() => handleDelete(recipe.id)} className="btn btn-dark">
                    {" "}
                    Delete{" "}
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default CreateRecipe;
import React, {useState, useEffect} from "react"
import api from "../api"
import '../App.css'
import {useNavigate, Link} from 'react-router-dom'


const CreateRecipe = () => {
  const [recipes, setRecipes] = useState([]);
  let navigate = useNavigate()

  const fetchRecipes = async() => {
    const response = await api.get("/recipes");
    setRecipes(response.data)
    console.log(response.data);
  };

  useEffect(() => {
    fetchRecipes();
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

  const GoToPage = (recipe_id) => {
    
    navigate("/display", {state: recipe_id});
    console.log(recipe_id)
  }

  return (
    <div className="container">
      <h1 className="text-center m-4">Select A Recipe</h1>

      <div id="recipe-select-container" className="bg-dark d-flex flex-wrap">
        {recipes.map((recipe) => (
          <button className="w-25 p-2" key={recipe.id} onClick={() => GoToPage(recipe.id)}>
            
            <div className="recipe-button-info mt-1">
              <h4> {recipe.name} </h4>
              <p> {recipe.desc} </p>

              <div>
                <div className="container">
                  <div className="row">
                    <div className="col text-decoration-underline"> <h6>Time</h6> </div>
                    <div className="col text-decoration-underline"> <h6>Cuisine</h6> </div>
                  </div>
                  <div className="row">
                    <div className="col"> {getCookTime(recipe)} </div>
                    <div className="col"> {recipe.cuisine.name} </div>
                  </div>
                </div>
              </div>
            </div>
           
          </button>
        ))}
      </div>
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
                <button onClick={() => handleDelete(recipe.id)}>
                  {" "}
                  Delete{" "}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default CreateRecipe;
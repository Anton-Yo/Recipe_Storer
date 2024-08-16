import React, {useState, useEffect} from "react"
import api from "../api"
import '../App.css'


const DisplayInfo = () => {
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    fetchRecipes();
  }, []);

  const fetchRecipes = async() => {
    const response = await api.get("/recipes");
    setRecipes(response.data)
    console.log(response.data)
  };

  return (
    <div>
      <div className="container">
        <p> This is the display Page </p>
      </div>

      <div className="mx-5 my-3 boxes-container">
        {recipes.map((recipe) => (
          <div key={recipe.id} className="recipe-box">
            <p> {recipe.name} </p>
            <p> {recipe.desc} </p>
            <p> {recipe.cuisine} </p>
          </div>
        ))}
      </div>


      <table className='table table-striped table-bordered table-hover mt-3'>
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
            <td>{recipe.cuisine_name}</td>
          </tr>
        ))}
      </tbody>
    </table>
    </div>
  );
}

export default DisplayInfo;
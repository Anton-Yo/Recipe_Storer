import React, {useState, useEffect} from "react"
import api from "../api"
import '../App.css'
import image from './Images/cows.png'

const DisplayInfo = () => {
  const [recipe, setRecipe] = useState([]);
  const [ingredients, setIngredients] = useState([]);
  const [steps, setSteps] = useState([]);

  const SetRecipeID = 1;

  useEffect(() => {
    fetchRecipes(SetRecipeID);
    fetchIngredients(SetRecipeID);
    fetchSteps(SetRecipeID);
  }, []);

  const fetchRecipes = async(recipe_id) => {
    const response = await api.get(`/recipes/${recipe_id}`)
    setRecipe(response.data)
    console.log(response.data)
  };

  const fetchIngredients = async(recipe_id) => {
    const response = await api.get(`/fetch_ingredients/${recipe_id}`)
    setIngredients(response.data)
    console.log(response.data)
  };

  const fetchSteps = async(recipe_id) => {
    const response = await api.get(`/${recipe_id}/steps`)
    setSteps(response.data)
    console.log(response.data)
  };

  var stepCount = 1;

  const AssociateIngs = async(step_id) => {
    console.log(steps.step_id)
  }

  return (
    <div>
      <div className="container ">
        <p> This is the display Page </p>
      </div>
      

      <div id="title" className="text-center">
        <h1>{recipe.name || 'Loading...'} </h1>
      </div>

      <div className="container position-relative w-100  mt-5 bg-info">
        <div id="ing-list" className="w-50">
          <ul> <h2 className="">Ingredients</h2>
          {ingredients.map((ing) => (
            <li key={ing.id} className='mx-1 mt-2'>
              {`${ing.quantity} ${ing.name} // ${ing.additional_notes}`}
            </li>
          ))}
          </ul>
        </div>

        <div id="image-container" className="bg-warning position-absolute top-0 mt-2 end-0 mx-2"> 
          <img src={image} alt="Cow lol" className="w-100 h-100"/>
        </div>
      </div>

      <div id="step-list" className="mt-5">
        <ul> <h2>Steps</h2> </ul>
        {steps.map((step) => (
          <li key={step.id} className='mt-4 mx-5 bg-primary'>
            <div className="container d-flex">
              <div className="step-container">
                <h4> {`- Step ${stepCount++}`} </h4>
                <div className="block mx-4">
                  {`${step.desc}`}
                </div>  
              </div>
              <div className="step-ingredients-container">
                <ul key={step.id} className='bg.secondary'>
                  {step.id == ingredients.step_id ? <p> Gamer</p> : <p> not so gamer</p>}
                </ul>
              </div>
            </div>
            
          </li>
        ))}
      </div>
          
       
      </div>
  );
}

export default DisplayInfo;
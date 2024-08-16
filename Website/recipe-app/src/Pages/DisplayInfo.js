import React, {useState, useEffect} from "react"
import api from "../api"
import '../App.css'
import image from './Images/cows.png'

const DisplayInfo = () => {
  const [recipeInfo, setRecipeInfo] = useState([]);
  const [ingredients, setIngredients] = useState([]);
  const [steps, setSteps] = useState([]);
  const [loading, setLoading] = useState(true);

  const SetRecipeID = 1;

  const onSelect = (event) => {
        console.log(event.target.getAttribute('key'));
  }


  useEffect(() => {
    fetchRecipes(SetRecipeID);
    console.log("About to disect")
    disectData(recipeInfo);
  }, []);

  const fetchRecipes = async(recipe_id) => {
    const response = await api.get(`/recipes/${recipe_id}`)
    setRecipeInfo(response.data);
    setLoading(false);
    console.log(response.data)
  };

  var stepCount = 1;

  const disectData = async (recipeInfo) => {
      setIngredients(recipeInfo.ingredients)
  };

  const isDataLoaded = () => {
      return !loading & recipeInfo != null
  }

  const returnIngs = (step_id) => {
   
    //Grab all the ingredients associated with the step id
    var returnArr = []


    for(var i = 0; i < recipeInfo.ingredients.length; i++)
    {
      if(recipeInfo.ingredients[i].step_id == step_id)
      {
        returnArr.push(recipeInfo.ingredients[i])
      }
    }

    for(var i = 0; i < returnArr.length; i++)
      {
       console.log(returnArr[i])
      }

    if(returnArr.length > 0)
    {
      return returnArr.map((ing) => (
        <li key={ing.id} onClick={onSelect}>
          {`${ing.quantity} ${ing.name} // ${ing.additional_notes}`}
        </li>
      ))
    }
    else
    {
      return <p>No ingredients for this step</p>
    }
  }

  return (
    <div>
      <div className="container ">
        <p> This is the display Page </p>
      </div>
    
      <div id="title" className="text-center">
        <h1>{recipeInfo.name || 'Loading...'} </h1>
      </div>

      <div className="container position-relative w-100  mt-5 bg-info">
        <div id="ing-list" className="w-50">
          <ul> <h2 className="">Ingredients</h2>
          {isDataLoaded() ? (
            recipeInfo.ingredients.map((ing) => (
              <li key={ing.id} onClick={onSelect} className='mx-1 mt-2'>
                {`${ing.quantity} ${ing.name} // ${ing.additional_notes}`}
              </li>
            ))
          ) : (
            <p> Loading recipes...</p>
          )}
          
          </ul>
        </div>

        <div id="image-container" className="bg-warning position-absolute top-0 mt-2 end-0 mx-2"> 
          <img src={image} alt="Cow lol" className="w-100 h-100"/>
        </div>
      </div>

      <div id="step-list" className="mt-5">
        <ul> <h2>Steps</h2> </ul>
        
          {isDataLoaded() ? (
            recipeInfo.steps.map((step) => (
             
              <li key={step.id} className='mt-4 mx-5 bg-primary'>
                <div className="container d-flex">
                  <div className="step-container">
                    <h4> {`- Step ${stepCount++}`} </h4>
                    <div className="block mx-4">
                      {`${step.desc}`}
                    </div>  
                  </div>
                  <div className="step-ingredients-container">
                    <ul className='bg.secondary'>
                      {returnIngs(step.id)}
                    </ul>
                  </div>
                </div>
              </li>
            ))
          ) : (
            <p> Loading recipes...</p>
          )}
      </div> 
    </div>
  );
}

export default DisplayInfo;
import React, {useState, useEffect} from "react"
import api from "../api"
import '../App.css'
import image from './Images/cows.png'
import image2 from './Images/First Pic.PNG'
import {useLocation} from 'react-router-dom';

const DisplayInfo = () => {
  const [recipeInfo, setRecipeInfo] = useState([]);
  const [loading, setLoading] = useState(true);
  const [otherLoading, setOther] = useState(true);
  const [categories, SetCategories] = useState([]);

  //Set the recipe_id passed thru from the select recipe page
  let location = useLocation();
  const SetRecipeID = location.state != null ? location.state : 1

  useEffect(() => {
    fetchRecipes(SetRecipeID);
    fetchCategories(SetRecipeID);
  }, []);

  const fetchCategories = async(recipe_id) => {
    const response = await api.get(`/recipe/${recipe_id}/categories`)
    console.log(response.data);
    if(response.data == null)
    {
        console.log("categories is empty")
    }
    SetCategories(response.data)
  }

  const fetchRecipes = async(recipe_id) => {
    const response = await api.get(`/recipes/${recipe_id}`)
    console.log(response.data)
    if(response.data == null)
    {
      console.log("Empty array")
    }
    setRecipeInfo(response.data);
    setLoading(false);
    console.log(response.data)
  };


  const getCookTime = () => {
    const time = recipeInfo.cook_time
    const mins = time % 60
    const hrs = (time - mins) / 60;
    var resultStr = hrs >= 1 ? `${hrs}hr ${mins} mins` : `${mins} mins`
    return resultStr
  }

  const isDataLoaded = () => {
      return !loading & recipeInfo != null
  }
  var stepCount = 1;

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
        <li key={ing.id}>
          {`${ing.quantity} ${ing.name} // ${ing.additional_notes}`}
        </li>
      ))
    }
    else
    {
      return <p>No ingredients for this step</p>
    }
  }

  const GetIngsUnderCategories = (category_id) => {
    
    let resultArr = []
   
    for(var i = 0; i < recipeInfo.ingredients.length; i++)
    {
      if(recipeInfo.ingredients[i].category_id == category_id)
      {
        console.log("Added  " + recipeInfo.ingredients[i].name + " to category " + category_id)
        resultArr.push(recipeInfo.ingredients[i])
      }
    }

    if(resultArr.length > 0)
      {
        return resultArr.map((ing) => (
          <li key={ing.id} className="mx-2">
            {`${ing.quantity} ${ing.name} // ${ing.additional_notes}`}
          </li>
        ))
      
    } 
    else 
    {
      return <p> No ingredients for this category </p>
    }

  }

  return (
    <div className="container display-wrapper">
      <div id="title" className="text-center mt-4">
        <h1>{recipeInfo.name || "Loading..."} </h1>

          {isDataLoaded() ? (

            <div className="w-100 justify-content-center align-items-center text-center">
              <h6 className="w-25 pb-1 border-secondary border-top m-auto"> {recipeInfo.cuisine.name} </h6>
              <h6 className="w-25 py-1 border-bottom border-secondary m-auto"> {getCookTime()}  </h6>
            </div>
            // <div className="d-flex w-100 justify-content-center">
            //   <h4 className="w-25 text-end mx-1"> {getCookTime()}  </h4>
            //   <h4>|</h4>
            //   <h4 className="w-25 text-start mx-1"> {recipeInfo.cuisine.name} </h4>
            // </div>
          ) : (
            <p> Loading cuisine...</p>
          )}
        
      </div>

      

      <div className="container d-flex w-100 mt-3 bg-info px-0">
        <div className="w-50 bg-warning">
          <h2 className="text-center">Ingredients</h2>
          <div className="mx-2">
            {isDataLoaded() ? (
              categories.map((cat) => (
                <ul key={cat.id} className="circle-list">
                  <h6>{`${cat.name}`} </h6>
                  {GetIngsUnderCategories(cat.id)}
                </ul>
              ))
            ) : (
              <li> Loading recipes...</li>
            )}
          </div>
        </div>

        <div id="image-container">
          <img src={image2} alt="Cow lol" className="mw-100 mh-100" />
        </div>
      </div>
       
   

      <div id="step-list" className="mt-2">
        <h2 className="text-center mt-1">Steps</h2>
        {isDataLoaded() ? (
          recipeInfo.steps.map((step) => (
            <li key={step.id} className="mx-3 mt-2 bg-primary">
              <div className="container d-flex">
                <div className="step-container">
                  <h4> {`- Step ${stepCount++}`} </h4>
                  <div className="block mx-4">{`${step.desc}`}</div>
                </div>
                <div className="step-ingredients-container">
                  <ul className="bg.secondary">{returnIngs(step.id)}</ul>
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
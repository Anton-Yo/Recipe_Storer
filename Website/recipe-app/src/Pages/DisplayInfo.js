import React, {useState, useEffect} from "react"
import api from "../api"
import '../App.css'
import image2 from './Images/First Pic.PNG'
import {useLocation} from 'react-router-dom';
import validator from 'validator';

const DisplayInfo = () => {
  const [recipeInfo, setRecipeInfo] = useState([]);
  const [loading, setLoading] = useState(true);
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
    console.log("Fetching recipes...")
    console.log(response.data)
    if(response.data == null)
    {
      console.log("Empty array")
    }
    setRecipeInfo(response.data);
    setLoading(false);
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
   
    //Return ingredient <li> objects, associated with the step
    if(recipeInfo.steps.length > 0)
    {
      let step;
      for(let i = 0; i < recipeInfo.steps.length; i++)
      {
        if(recipeInfo.steps[i].id === step_id)
        {
          step = recipeInfo.steps[i]
        }
      }

      return step.ingredients.map((ing) => (
        <li key={ing.id} className="item">
          {getDescriptor(ing)}
        </li>
      ))
    }
    else
    {
      return <li>No ingredients for this step</li>
    }
  }

  const GetIngsUnderCategories = (category_id) => {
    
    let resultArr = []
   
    for(var i = 0; i < recipeInfo.ingredients.length; i++)
    {
      if(recipeInfo.ingredients[i].category_id === category_id)
      {
        //console.log("Added  " + recipeInfo.ingredients[i].name + " to category " + category_id)
        resultArr.push(recipeInfo.ingredients[i])
      }
    }

    if(resultArr.length > 0)
      {
        return resultArr.map((ing) => (
          <li key={ing.id} className="item">
            {getDescriptor(ing)}
          </li>
        ))
      
    } 
    else 
    {
      return <p> No ingredients for this category </p>
    }
  }

  const getDescriptor = (ing) => {
    if(ing.additional_notes === "" || ing.additional_notes == null) {
      return `${ing.quantity} ${ing.name}`
    }
    else
    {
      return `${ing.quantity} ${ing.name} - ${ing.additional_notes}`
    }
  }

  const exportRecipeInfo = (ing) => {
    const fileData = JSON.stringify(recipeInfo)
    const blob = new Blob([fileData]);
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a");
    link.download = "user-info.json"
    link.href = url;
    link.click()
  }

  const handleBottomButtons = () => {
    const sourceLink = recipeInfo.source;

    if(validator.isURL(sourceLink))
    {
      return (
      <div className="w-50 d-flex mt-2 bg-primary justify-content-evenly">
        <button className='btn btn-secondary w-20' onClick={exportRecipeInfo}>Download JSON</button>
        <button className="btn btn-secondary w-20" onClick={goToSource}> Go To Source </button>
      </div>
    );
    }
    else
    {
      return <div className="w-50 d-flex justify-content-around"> 
          <button className='btn btn-secondary mt-4' onClick={exportRecipeInfo}>Download me as JSON</button>
        </div>
    }
  }

  const goToSource = () => {
    window.location.href = recipeInfo.source;
  }

  return (
    <div className="container display-wrapper">
      <div id="title" className="text-center mt-4">
        <h1>{recipeInfo.name || ""} </h1>
          {isDataLoaded() ? (
            <div className="w-100 justify-content-center align-items-center text-center">
              <h6 className="w-25 pb-1 pt-1 border-secondary border-dark border-top m-auto"> {recipeInfo.cuisine.name} </h6>
              <h6 className="w-25 py-1 border-bottom border-secondary border-dark m-auto"> {getCookTime()}  </h6>
            </div>
          ) : (
            <p> Loading cuisine...</p>
          )}
      </div>

      <div className="container d-flex w-100 mt-3 px-0 justify-content-around">
        <div className="w-50 bg-lightblue border border-2 border-dark shadow-sm">
          <h2 className="text-center mt-1">Ingredients</h2>
          <div className="mx-2">
            {isDataLoaded() ? (
              categories.map((cat) => (
                <div>
                  <h6 className="">{`${cat.name}`} </h6>
                  <ul key={cat.id} className="circle-list">
                    {GetIngsUnderCategories(cat.id)}
                  </ul>
                </div>
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
        <h2 className="text-center mt-3">Steps</h2>
        {isDataLoaded() ? (
          recipeInfo.steps.map((step) => (
            <div key={step.id} className="mx-3 mt-2 border-secondary border-2">
              <div className="container d-flex w-100 justify-content-between">
                <h4 className="py-1 w-25 border-bottom border-dark border-1"> {`Step ${stepCount++}`} </h4>
                <div className="step-ingredients-container d-flex justify-contents-start">
                  <h6 className="border-bottom border-dark border-1 mt-3"> Associated Ingredients: </h6>
                </div>
                {/* <h5 className="mt-2 step-ingredients-container"> Associated Ingredients </h5> */}
              </div>
              

              <div className="container d-flex w-100 justify-content-between">
                <div className="step-container">{`${step.desc}`}</div>
                <div className="step-ingredients-container">
                  <ul className="circle-list"> 
                    {returnIngs(step.id)}
                  </ul>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p> Loading recipes...</p>
        )}
      </div>
        <div className="container d-flex justify-content-center">
        {isDataLoaded() ? (
          handleBottomButtons()
        ) : (
          <div> Loading... </div>
        )}
        </div>

    </div>
  );
}

export default DisplayInfo;
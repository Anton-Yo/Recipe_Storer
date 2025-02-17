import React, {useState, useEffect} from "react"
import api from "../api"
import '../App.css'
import image2 from './Images/First Pic.PNG'
import {useLocation} from 'react-router-dom';
import validator from 'validator';
import { isMobile } from 'react-device-detect';

const DisplayInfo = () => {
  const [recipeInfo, setRecipeInfo] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, SetCategories] = useState([]);
  const [isLarge, SetIsLarge] = useState(window.innerWidth > 992)
  const [downloadableData, setDownloadableData] = useState([]);

  //Set the recipe_id passed thru from the select recipe page
  let location = useLocation();
  const SetRecipeID = location.state != null ? location.state : 1

  useEffect(() => {
    fetchRecipes(SetRecipeID);
    fetchCategories(SetRecipeID);

    //Add listener to update page when dimensions change. to swap between 2/4 boxes per row
    window.addEventListener('resize', checkSize);
    return () => window.removeEventListener('resize', checkSize);
  }, []);

  const fetchCategories = async(recipe_id) => {
    const response = await api.get(`/recipe/${recipe_id}/categories`)
    //console.log(response.data);
    if(response.data == null)
    {
      console.log("categories is empty")
    }
    SetCategories(response.data)
  }

  const fetchRecipes = async(recipe_id) => {
    const response = await api.get(`/recipes/${recipe_id}`)
    console.log("Fetching recipes...")
    //console.log(response.data)
    if(response.data == null)
    {
      console.log("Empty array")
      return;
    }
    setRecipeInfo(response.data);
    setLoading(false);
  };

  const createAlternateForm = (data) => {
    
    let newData = JSON.parse(JSON.stringify(data));
    
    //Now change things from the messy original data that is sent thru
    newData.cuisine = newData.cuisine.name //Set the cuisine name directly to the cuisine name, rather than a nested arr
    //delete newData.ingredients //Get rid of ingredients 

    newData.ingredients.forEach(ing => {
      ing.category = categories.find(element => element.id == ing.category_id).name

      delete ing.id
      delete ing.recipe_id
      delete ing.category_id
    })

    //Change the steps
    newData.steps.forEach(step => {
      step.ingredients.forEach(ing => {
        //Grab the name of the category, that corresponds to ing.cat_id == categories.cat_id
        ing.category = categories.find(element => element.id == ing.category_id).name

        delete ing.id
        delete ing.recipe_id
        delete ing.category_id
      })

      delete step.id
      delete step.recipe_id;
    })

    //Make it into a form of recipes:[{data}]
    let tempData = {
      recipes: [newData]
    }
    newData = tempData

    setDownloadableData(newData);
    console.log("Created JSON data for download");
  }


  const getCookTime = () => {
    const time = recipeInfo.cook_time
    const mins = time % 60
    const hrs = (time - mins) / 60;
    var resultStr = hrs >= 1 ? `${hrs}hr ${mins} mins` : `${mins} mins`
    return resultStr
  }

  const isDataLoaded = () => {
      if(!loading & recipeInfo.length != 0 & categories != 0 && downloadableData.length == 0)
      {
        createAlternateForm(recipeInfo);
      }
      return !loading & recipeInfo.length != 0 & categories != 0
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

  const exportRecipeInfo = () => { //ChatGPT told me about blobs
    const fileData = JSON.stringify(downloadableData)
    const blob = new Blob([fileData]);
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a");
    link.download = `${downloadableData.recipes[0].name}.json` //JSON is an arr of recipes, so grab the first and only entry
    link.href = url;
    link.click()
  }

  const handleBottomButtons = () => {
    const sourceLink = recipeInfo.source;

    if(validator.isURL(sourceLink))
    {
      if(isMobile || !isLarge)
      {
        return (
          <div className="w-100 d-flex mt-3 mb-2 justify-content-evenly">
            <button className='btn btn-dark w-40' onClick={exportRecipeInfo}>Download JSON</button>
            <button className="btn btn-dark w-40" onClick={goToSource}> Go To Source </button>
          </div>
        );
      }
      else
      {
        return (
          <div className="w-75 d-flex mt-3 mb-2 justify-content-evenly">
            <button className='btn btn-dark w-20' onClick={exportRecipeInfo}>Download JSON</button>
            <button className="btn btn-dark w-20" onClick={goToSource}> Go To Source </button>
          </div>
        );
      }
    }
    else
    {
      return <div className="w-50 d-flex mt-3 mb-2 justify-content-around"> 
          <button className='btn btn-secondary mt-4' onClick={exportRecipeInfo}>Download me as JSON</button>
        </div>
    }
  }

 
  //Based off 992 px standard for large from bootstrap
  const checkSize = () => {
    SetIsLarge(window.innerWidth > 992)
  }

  const goToSource = () => {
    window.location.href = recipeInfo.source;
  }

  const setupGrid = (step) => {
    if(step == null) //If there isn't a step for whatever reason, return 'error'
    {
      return(<div> Step is missing </div>)
    }

    if(step.ingredients.length == 0) //If there are no ingredients for the step, don't show any, just return the row with step.desc
    {
      return(
        <div className="row">
          <div className="col"> {step.desc} </div>
          <div className="col"> N/A </div>
        </div>
      )
    }

    let numIngs = step.ingredients.length;

    //Create at least one row for the step desc
    //Then create as many rows as needed for the ingredients
    return (
      <div className="d-flex w-100">
        {/* Left side */}
        <div className="w-50">
          <div className="row">
            <div className="col-12"> {step.desc} </div>
          </div>
        </div>

        {/* Right side */}
        <div className="w-50 container">
          {step.ingredients.map((ing) => (
            <div className="row">
              <div className="col-12 mb-1"> - {ing.name} </div>
            </div>
          ))}
        </div>
      </div> 
    )
  }

  

  return (
    <div className="container-md display-wrapper">
      <div id="title" className="w-100 text-center mt-4">
        <h1>{recipeInfo.name || ""} </h1>
          {isDataLoaded() ? (
            <div className="w-100 justify-content-center align-items-center text-center">
              <h6 className="display-title-border pb-1 pt-1 border-secondary border-dark border-top m-auto"> {recipeInfo.cuisine.name} </h6>
              <h6 className="display-title-border py-1 border-bottom border-secondary border-dark m-auto"> {getCookTime()}  </h6>
            </div>
          ) : (
            <p> Loading cuisine...</p>
          )}
      </div>

      <div className="container d-flex flex-column flex-lg-row w-100 mt-3 px-0 justify-content-around">
        <div className="w-lg-50 w-100 bg-lightblue border border-2 border-dark shadow-sm">
          <h2 className="text-center mt-3" >Ingredients</h2>
          <div className="d-flex flex-column align-items-center justify-content-center mt-3">
            {isDataLoaded() ? (
              categories.map((cat) => (
                <div className="ing-list" key={cat.id}>
                  <h6 className="text-center">{`${cat.name}`} </h6>
                  <ul className="text-left w-100 circle-list">
                    {GetIngsUnderCategories(cat.id)}
                  </ul>
                </div>
              ))
            ) : (
              <li> Loading recipes...</li>
            )}
          </div>
        </div>

        {/* REMOVE THIS FOR NOW COS I DONT HAVE PICTURES :(
        <div id="image-container">
          <img src={image2} alt="Cow lol" className="mw-100 mh-100" />
        </div> */}
      </div>
       
      <div id="step-list" className="mt-2">
        <h2 className="text-center mt-3">Steps</h2>
        {isDataLoaded() ? (

          recipeInfo.steps.map((step) => (
            <div>
            <div className="container-sm mt-3">
            
              <div className="row">
                <div className="col-5 text-decoration-underline"> <h4> {`Step ${stepCount++}`}: </h4> </div>
                <div className="col-1"> </div>
                <div className="col-5 text-decoration-underline"> <h4> Components: </h4> </div>
              </div>
              <div> {setupGrid(step)} </div>
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
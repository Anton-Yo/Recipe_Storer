import React, {useState, useEffect} from "react"
import api from "../api"
import '../App.css'



const RecipeBlock = ({recipe}) => {

const getCookTime = () => {
  const time = recipe.cook_time
  const mins = time % 60
  const hrs = (time - mins) / 60;
  var resultStr = hrs >= 1 ? `${hrs}h ${mins}mins` : `${mins}mins`
  return resultStr
}


  return (
    <div className="w-50 m-auto">
      <div className="mt-1 bg-warning text-center">
        <h6 className="pt-1"> {recipe.name} </h6>
        <div className="d-flex justify-content-center">
        <p className="mx-4"> {recipe.desc} </p>
        <p className="mx-4"> {getCookTime()} </p>
        <p className="mx-4"> {recipe.cuisine_name}</p>
        </div>
       
       
        {/* {recipeInfo.desc} */}
      </div>
    </div>
  );
}

export default RecipeBlock;
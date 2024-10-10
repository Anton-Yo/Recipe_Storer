import React from "react"
import '../App.css'
import { isMobile } from "react-device-detect"



const RecipeBlock = ({recipe}) => {

const getCookTime = () => {
  const time = recipe.cook_time
  const mins = time % 60
  const hrs = (time - mins) / 60;
  var resultStr = hrs >= 1 ? `${hrs}h ${mins}mins` : `${mins}mins`
  return resultStr
}

  return (
    <div className="recipe-block">
      <div className="mt-2 bg-recipe text-center border border-dark border-2">
        <h5 className="pt-1"> {recipe.name} </h5>
        <div className="d-flex justify-content-center">
        <p className="mx-2"> {recipe.desc} </p>
        <p className="mx-2"> {getCookTime()} </p>
        <p className="mx-2"> {recipe.cuisine}</p>
        </div>
      </div>
    </div>
  );
}

export default RecipeBlock;
import React, {useState, useEffect} from "react"
import api from "../api"
import '../App.css'



const IngredientBlock = ({ing}) => {

  return (
    <div className="w-50 m-auto">
      <div className="mt-1 bg-danger text-center">
        <h6 className="pt-1"> {ing.name} </h6>
        <div className="d-flex justify-content-center">
          <p className="mx-1"> {ing.quantity} </p>
          <p className="mx-1"> {ing.additional_notes} </p>
          <p className="mx-1"> {ing.category_name}</p>
        </div>
      </div>
    </div>
  );
}

export default IngredientBlock;
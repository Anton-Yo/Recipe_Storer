import React, {useState, useEffect} from "react"
import api from "../api"
import '../App.css'
import { useDrop } from 'react-dnd';



const StepBlock = ({step, attachedIngredients, onDrop}) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'ingredient-box',
    drop: (item) => onDrop(item, step.id),
    collect: (monitor) => ({
        isOver: monitor.isOver(),
    }),
  }));

  const getAttachedIngredients = () => {
    console.log("Key " + attachedIngredients)
    if(attachedIngredients != null && attachedIngredients.length > 0)
    {
      return <p className="mx-1"> {attachedIngredients[0].name} </p>
    }
    else
    {
      return <p className="mx-1"> No attached ingredients</p>
    }
  }

  return (
    
    <div ref={drop} className="w-45 m-auto mt-1">
      <div className="mt-1 bg-danger text-center">
        <h6 className="pt-1"> Step {step.id} </h6>
        <div className="d-flex justify-content-center">
          <p className="mx-1"> {step.desc} </p>
        </div>
        <div className="d-flex flex-column justify-content-center">
            {getAttachedIngredients()}
        </div>
      </div>
    </div>
  );
}

export default StepBlock;
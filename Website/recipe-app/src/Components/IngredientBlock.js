import React, {useState, useEffect} from "react"
import api from "../api"
import '../App.css'
import { useDrag } from 'react-dnd';



const IngredientBlock = ({ing}) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'ingredient-box',
    item: {
          id: ing.id, 
          name: ing.name,
          quantity: ing.quantity,
          additional_notes: ing.additional_notes,
          category: ing.category
        },
    collect: (monitor) => ({
        isDragging: monitor.isDragging(),
    }),
  }));

  

  return (
    <div ref={drag} className="w-45 m-auto mt-1">
      <div className="mt-1 bg-primary text-center">
        <h6 className="pt-1"> {ing.name} </h6>
        <div className="d-flex justify-content-center">
          <p className="mx-1"> {ing.quantity} </p>
          <p className="mx-1"> {ing.additional_notes} </p>
          <p className="mx-1"> {ing.category}</p>
        </div>
      </div>
    </div>
  );
}

export default IngredientBlock;
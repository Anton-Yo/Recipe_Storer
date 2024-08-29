import React from "react"
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

  const getDescriptor = () => {
    if(ing.additional_notes == "" || ing.additional_notes == null) {
      return `${ing.quantity} ${ing.name} `
    }
    else
    {
      return `${ing.quantity} ${ing.name} - ${ing.additional_notes}`
    }
  }

  return (
    <div ref={drag} className="w-45 m-auto mt-1">
      <div className="mt-1 bg-turquoise border border-dark border-2 text-center">
        <h6 className="pt-1"> {getDescriptor()} </h6>
        <div className="d-flex justify-content-center">
          <p> {ing.category} </p>
        </div>
      </div>
    </div>
  );
}

export default IngredientBlock;
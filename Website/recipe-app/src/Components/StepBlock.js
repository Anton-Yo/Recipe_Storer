import React, {useState, useEffect} from "react"
import api from "../api"
import '../App.css'
import { useDrop } from 'react-dnd';



const StepBlock = ({step, onDrop}) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'ingredient-box',
    drop: (item) => onDrop(item),
    collect: (monitor) => ({
        isOver: monitor.isOver(),
    }),
  }));

  return (
    
    <div className="w-45 m-auto mt-1">
      ref={drop}
      <div className="mt-1 bg-danger text-center">
        <h6 className="pt-1"> Step {step.count} </h6>
        <div className="d-flex justify-content-center">
          <p className="mx-1"> {step.desc} </p>
        </div>
      </div>
    </div>
  );
}

export default StepBlock;
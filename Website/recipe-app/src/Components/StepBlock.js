import React, {useState, useEffect} from "react"
import api from "../api"
import '../App.css'
import { useDrop } from 'react-dnd';
import closeImage from '../Pages/Images/close.png'



const StepBlock = ({step, sendData}) => {
  const [droppedItems, setDroppedItems] = useState([]);

  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'ingredient-box',
    drop: (item) => { 
      setDroppedItems((prevItems) => {
        if(prevItems.some(existingIng => existingIng.id === item.id)) {
          //If the id already exists in the droppeditems list. Dont add
          return prevItems
        }
        else
        {
          //Otherwise do add
          return [...prevItems, item]
        }
         
    })
    },
    collect: (monitor) => ({
        isOver: monitor.isOver(),
    }),
  }));

  const confirm = () => {
    console.log(droppedItems)
  }

  const deleteItem = (id) => {
    setDroppedItems((prevItems) => prevItems.filter(item => item.id != id))
    console.log("gotta delete id=" + id)
  }

  useEffect(() => {
    sendData(step, droppedItems);
  }, [droppedItems])

  return (
    <div ref={drop} className="w-45 m-auto mt-1">
      <div className="mt-1 bg-pink text-center border border-2 border-dark">
        <h6 className="pt-1"> Step {step.id} </h6>
        <div className="d-flex justify-content-center">
          <p className="mx-1 wrap"> {step.desc} </p>
        </div>
        <div className="d-flex flex-column justify-content-center"> 
            {droppedItems.map((ing) => (
              <div key={ing.id} className="d-flex w-75 justify-content-between bg-turquoise m-auto mb-1 border border-1 border-dark"> 
                <p className="my-auto p-2 wrap"> {`${ing.quantity} ${ing.name}`}</p>
                <button onClick={() => deleteItem(ing.id)} className="close-button" > <img src={closeImage} alt="close button" className="w-125 h-125" /> </button>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

export default StepBlock;
import React, {useState, useEffect} from "react"
import api from "../api"
import '../App.css'
import { useDrop } from 'react-dnd';



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
      <div className="mt-1 bg-danger text-center">
        <h6 className="pt-1"> Step {step.id} </h6>
        <div className="d-flex justify-content-center">
          <p className="mx-1"> {step.desc} </p>
        </div>
        <div className="d-flex flex-column justify-content-center"> 
            {droppedItems.map((ing) => (
              <div key={ing.id} className="d-flex justify-content-around bg-warning m-1"> 
                <p> {`${ing.quantity} ${ing.name} +  ${ing.category}`}</p>
                <button onClick={() => deleteItem(ing.id)}> Delete </button>
              </div>
            ))}
             <button onClick={confirm}> print out data to console </button>
        
        </div>
      </div>
    </div>
  );
}

export default StepBlock;
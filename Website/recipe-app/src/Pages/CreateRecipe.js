import React, { useState, useEffect, useRef } from "react";
import api from "../api";
import "../App.css";
import RecipeBlock from "../Components/RecipeBlock";
import IngredientBlock from "../Components/IngredientBlock";
import StepBlock from "../Components/StepBlock";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

import DragItem from "../Components/DragItem";
import DropZone from "../Components/DropZone";

const CreateRecipe = () => {
  const [recipe, setRecipe] = useState([]);
  const [recipeForm, setRecipeForm] = useState({
    name: "",
    desc: "",
    cook_time: "",
    cuisine_name: "",
  });
  const [ingredients, setIngredients] = useState([]);
  const [ingForm, setIngForm] = useState({
    name: "",
    quantity: "",
    additional_notes: "",
    category_name: "",
  });
  const [steps, setSteps] = useState([]);
  const [stepForm, setStepForm] = useState({
    id: 1,
    desc: "",
  });
  const [recipeSubmitted, setRecipeSubmitted] = useState(true);
  const [ingredientSubmitted, setIngredientSubmitted] = useState(false);
  const [ingredientsAllSubmitted, setIngredientsAllSubmitted] = useState(false);
  const [stepSubmitted, setStepSubmitted] = useState(false);
  const [stepsAllSubmitted, setStepsAllSubmitted] = useState(false);
  const [pageState, setPageState] = useState([]);

  const [stepId, setStepId] = useState(1);
  const [ingIdCount, setIngIdCount] = useState(1);

  const [droppedItems, setDroppedItems] = useState([]);

  const handleDrop = (item, stepId) => {
    console.log(item.id + " gamer");
    console.log(stepId + " step ")
    // const copyOfSteps= [...steps];
    steps[stepId] = {
      ...copyOfSteps[stepId],
      containedIngredients: [...copyOfSteps[stepId].containedIngredients, item]
    }

    // for(let i = 0; i < steps.length; i++)
    // {
    //     if(copyOfSteps[i].id == item.id)
    //     {
    //       copyOfSteps[i] = {
    //         ...copyOfSteps[i],
    //         containedIngredients: [...steps[i].containedIngredients, item]
    //       }
    //       break;
    //     };
    // }
    //setSteps(copyOfSteps);


    console.log("Break")
    for(let i = 0; i < steps.length; i++)
    {
      console.log("first part of loop is running")
      for(let j = 0; j < steps[i].containedIngredients.length; j++)
      {
        console.log(`This is ${steps[i].name} and the contained ingredient is ${steps[i].containedIngredients[j].name}`)
      }
    }
    console.log(item.name + " gaymer")
    //setDroppedItems((prevItems) => [...prevItems, item]);
  };

  const handleRemoveItem = (index) => {
    const updatedItems = [...droppedItems];
    updatedItems.splice(index, 1);
    setDroppedItems(updatedItems);
  };

  useEffect(() => {}, []);

  const handleInputChange = (event, id) => {
    const value =
      event.target.type === "checkbox"
        ? event.target.checked
        : event.target.value;
    switch (id) {
      case 0:
        setRecipeForm({
          ...recipeForm,
          [event.target.name]: value,
        });
        break;

      case 1:
        setIngForm({
          ...ingForm,
          [event.target.name]: value,
        });
        break;

      case 2:
        setStepForm({
          ...stepForm,
          [event.target.name]: value,
        });
        break;
    }
  };

  const ingredientsComplete = () => {
    setIngredientsAllSubmitted(true);
    console.log("Ingredients all submitted");
  };

  const stepsComplete = () => {
    setStepsAllSubmitted(true);
    console.log("Steps all submitted");
  };

  const handleRecipeSubmit = (event) => {
    event.preventDefault();
    setRecipeSubmitted(true);
    setRecipe(recipeForm);
  };

  const handleIngredientSubmit = async (event) => {
    event.preventDefault();
    console.log(ingForm);
    addIngredient(ingForm)
    setIngredientSubmitted(true);
    setIngForm({
      name: "",
      quantity: "",
      additional_notes: "",
      category_name: "",
    });
  };

  const handleStepSubmit = (event) => {
    event.preventDefault();
    stepForm.id = stepId;
    addStep(stepForm);
    setStepId(stepId + 1);
    setStepSubmitted(true);
    
    setStepForm({
      desc: "",
    });
  };

  const addStep = (stepForm) => {
    console.log(stepForm)
    const newStep = {
      id: stepForm.id,
      desc: stepForm.desc,
      containedIngredients: []
    }
    setSteps([...steps, newStep]);
    // for(let i = 0; i < steps.length; i++) {
    //   console.log(steps[i]);
    // }
  }

  const addIngredient = (ingForm) => {
    console.log(ingForm)
    const newIng = {
      id: ingIdCount,
      name: ingForm.name,
      quantity: ingForm.quantity,
      additional_notes: ingForm.additional_notes,
      category_name: ingForm.category_name,
    }
    setIngIdCount(ingIdCount + 1)
    console.log(newIng)
    setIngredients([...ingredients, newIng])
  }

  const GetRecipeBlock = () => {
    //console.log(recipeSubmitted + " I dont understand how this is false")
    if (recipeSubmitted && recipe != null) {
      //console.log("agsemea")
      return <RecipeBlock recipe={recipe}> </RecipeBlock>;
    } else {
      //console.log(`${recipeSubmitted} + ${recipe}`)
      return `<div> empty <div/>`;
    }
  };

  const GetIngredientBlocks = () => {
    //console.log(recipeSubmitted + " I dont understand how this is false")
    if (ingredients != null && ingredientSubmitted) {
      //console.log(ingredients);

      if (ingredients.length != null) {
            return ingredients.map((ing) => (
              <IngredientBlock key={ing.id} ing={ing}>
                {" "}
              </IngredientBlock>
            ))
        
      } else {
        return (
          <IngredientBlock key={ingredients.name} ing={ingredients} >
            {" "}
          </IngredientBlock>
        );
      }
    } else {
      //console.log(`${recipeSubmitted} + ${recipe}`)
      return `No ingredients added yet`;
    }
  };

  const GetStepBlocks = () => {
    if (steps != null && stepSubmitted) {
      if (steps.length != null) {
        return steps.map((step) => (
          <StepBlock key={step.id} step={step} attachedIngredients={step.containedIngredients} onDrop={handleDrop}>
            {" "}
          </StepBlock>
        ));
      } else {
        return (
          <StepBlock key={1} step={steps}>
            {" "}
          </StepBlock>
        );
      }
    }
  };

  const EditMode = () => {};

  const handlePageState = () => {
    if (recipeSubmitted && ingredientsAllSubmitted && stepsAllSubmitted) {
    }
    //If recipe submitted, show ingredient from
    if (recipeSubmitted && !ingredientsAllSubmitted) {
      return (
        <div>
          <form onSubmit={handleIngredientSubmit} id="ing-form">
            <div className="mb-3 mt-3">
              <h4 className="text-center"> Add Ingredients </h4>
              <div>
                <label htmlFor="ing-name" className="form-label">
                  Ingredient Name
                </label>

                <input
                  type="text"
                  className="form-control"
                  id="name"
                  name="name"
                  onChange={(event) => handleInputChange(event, 1)}
                  value={ingForm.name}
                ></input>
              </div>

              <div className="mb-3">
                <label htmlFor="amount" className="form-label">
                  Quantity
                </label>

                <input
                  type="text"
                  className="form-control"
                  id="quantity"
                  name="quantity"
                  onChange={(event) => handleInputChange(event, 1)}
                  value={ingForm.quantity}
                ></input>
              </div>

              <div className="mb-3">
                <label htmlFor="amount" className="form-label">
                  Additional Info
                </label>

                <input
                  type="text"
                  className="form-control"
                  id="additional_notes"
                  name="additional_notes"
                  onChange={(event) => handleInputChange(event, 1)}
                  value={ingForm.additional_notes}
                ></input>
              </div>

              <div className="mb-3">
                <label htmlFor="amount" className="form-label">
                  Category
                </label>

                <input
                  type="text"
                  placeholder="E.g Protein, Vegetable, Grain"
                  className="form-control"
                  id="category_name"
                  name="category_name"
                  onChange={(event) => handleInputChange(event, 1)}
                  value={ingForm.category_name}
                ></input>
              </div>

              <button type="submit" className="btn btn-primary">
                Add
              </button>
            </div>
          </form>

          <button onClick={ingredientsComplete}> Submit all </button>
        </div>
      );
    }
    //if ingredient submitted show step form
    else if (recipeSubmitted && ingredientsAllSubmitted) {
      return (
        <div>
          <form onSubmit={handleStepSubmit} id="step-form">
            <div className="mb-3 mt-3">
              <h4 className="text-center"> Add Steps </h4>

              <h5> {`Step ${stepId}`}</h5>

              <div className="mb-3">
                <label htmlFor="amount" className="form-label">
                  Description
                </label>

                <textarea
                  rows="10"
                  className="form-control"
                  id="desc"
                  name="desc"
                  placeholder="Write step here"
                  onChange={(event) => handleInputChange(event, 2)}
                  value={stepForm.desc}
                />
              </div>

              <button type="submit" className="btn btn-primary">
                Add
              </button>
            </div>
          </form>

          <button onClick={stepsComplete}> Submit all </button>
        </div>
      );
    }
    //Show recipe form
    else {
      return (
        <form className="create-form" onSubmit={handleRecipeSubmit}>
          <div className="mb-3 mt-3">
            <h4 className="text-center"> Add Recipe</h4>
            <label htmlFor="amount" className="form-label">
              Name
            </label>

            <input
              type="text"
              className="form-control"
              id="name"
              name="name"
              onChange={(event) => handleInputChange(event, 0)}
              value={recipeForm.name}
            ></input>
          </div>

          <div className="mb-3">
            <label htmlFor="amount" className="form-label">
              Description
            </label>

            <input
              type="text"
              className="form-control"
              id="desc"
              name="desc"
              onChange={(event) => handleInputChange(event, 0)}
              value={recipeForm.desc}
            ></input>
          </div>

          <div className="mb-3">
            <label htmlFor="amount" className="form-label">
              Cook Time
            </label>

            <input
              type="number"
              className="form-control"
              id="cook_time"
              name="cook_time"
              onChange={(event) => handleInputChange(event, 0)}
              value={recipeForm.cook_time}
            ></input>
          </div>

          <div className="mb-3">
            <label htmlFor="amount" className="form-label">
              Cuisine
            </label>

            <input
              type="text"
              className="form-control"
              id="cuisine_name"
              name="cuisine_name"
              onChange={(event) => handleInputChange(event, 0)}
              value={recipeForm.cuisine_name}
            ></input>
          </div>

          <button type="submit" className="btn btn-primary">
            Submit
          </button>
        </form>
      );
    }
  };

  const passIngredientInfo = (data) => {
    console.log(data.name)
  }

  return (
    <DndProvider backend={HTML5Backend}>
    <div>
      <div className="container d-flex">
        <div className="form-container bg-success">{handlePageState()}</div>

        <div className="visual-box bg-secondary">
          {GetRecipeBlock()}
          <div className="d-flex flex-wrap">{GetIngredientBlocks()}</div>

          <div className="d-flex flex-wrap">{GetStepBlocks()}</div>
        </div>
      </div>

    <DropZone onDrop={handleDrop}/>
      
    {droppedItems.map((item, index) => (
                              <div
                                  key={index}
                                  style={{
                                      border: '1px solid #ccc',
                                      padding: '10px',
                                      borderRadius: '5px',
                                      marginTop: '10px',
                                      backgroundColor: 'lightblue',
                                      display: 'flex',
                                      justifyContent: 'space-between',
                                      alignItems: 'center',
                                  }}>
                                  <p>{item.name}</p>
                                  <button onClick={
                                      () => handleRemoveItem(index)}>
                                      Remove
                                  </button>
                              </div>
                          ))}
                          
      <table className="table table-striped table-bordered table-hover mt-3">
        <thead>
          <tr>
            <th>Name</th>
            <th>Description</th>
            <th>Cuisine</th>
            <th className="text-center">Delete?</th>
          </tr>
        </thead>

        {/* <tbody>
        {recipe.map((recipe) => (
          <tr key={recipe.id}>
            <td>{recipe.name}</td>
            <td>{recipe.desc}</td>
            <td>{recipe.cuisine_id}</td>
            <td>
              <button onClick={() => handleDelete(recipe.id)}> Delete </button>
            </td>
          </tr>
        ))}
      </tbody> */}
      </table>
    </div>
    </DndProvider>
  );
};

export default CreateRecipe;

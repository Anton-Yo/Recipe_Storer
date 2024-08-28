import React, { useState, useEffect, useRef } from "react";
import api from "../api";
import "../App.css";
import RecipeBlock from "../Components/RecipeBlock";
import IngredientBlock from "../Components/IngredientBlock";
import StepBlock from "../Components/StepBlock";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

const CreateRecipe = () => {
  const [recipe, setRecipe] = useState([]);
  const [recipeForm, setRecipeForm] = useState({
    name: "",
    desc: "",
    cook_time: "",
    cuisine: "",
  });
  const [ingredients, setIngredients] = useState([]);
  const [ingForm, setIngForm] = useState({
    name: "",
    quantity: "",
    additional_notes: "",
    category: "",
  });
  const [steps, setSteps] = useState([]);
  const [stepForm, setStepForm] = useState({
    id: 1,
    desc: "",
  });
  const [recipeSubmitted, setRecipeSubmitted] = useState(false);
  const [ingredientSubmitted, setIngredientSubmitted] = useState(false);
  const [ingredientsAllSubmitted, setIngredientsAllSubmitted] = useState(false);
  const [stepSubmitted, setStepSubmitted] = useState(false);
  const [stepsAllSubmitted, setStepsAllSubmitted] = useState(false);

  const [stepCount, setStepCount] = useState(1);
  const [ingIdCount, setIngIdCount] = useState(1);

  const handleDroppedItems = (stepData, attachedIngredients) => {
    console.log(stepData);
    const stepsCopy = steps.map((step) => {
      console.log(stepData.id + "''" + step.id);
      if (stepData.id === step.id) {
        console.log("returning new step");
        return {
          ...step,
          containedIngredients: attachedIngredients,
        };
      } else {
        console.log("returning default step");
        return step;
      }
    });

    setSteps(stepsCopy);
  };

  const listThing = () => {
    console.log("Break");
    console.log(steps);
    //console.log(stepsCopy)
    console.log("----------");
    steps.forEach((step) => {
      console.log(step);
      //console.log(step.containedIngredients)
    });
  };

  const submitNewRecipe = async () => {
    if (ingredientsAllSubmitted && recipeSubmitted && stepsAllSubmitted) {
      const data = {
        recipe: recipe,
        ingredients: ingredients,
        steps: steps,
      };
      console.log(data);
      ResetPage();

      try {
        const response = await api.post("/submit", data);
        console.log("form shit");
        console.log(response.data);
      } catch (error) {
        console.error("Error submitting form:", error.response.data);
      }
    }
  };

  const ResetPage = () => {
    //Reset recipe variables
    setRecipe([]);
    setRecipeSubmitted(false);
    setRecipeForm({
      name: "",
      desc: "",
      cook_time: "",
      cuisine: "",
    });

    //Reset ingredient variables
    setIngredients([]);
    setIngredientSubmitted(false);
    setIngredientsAllSubmitted(false);
    setIngIdCount(1);
    setIngForm({
      name: "",
      quantity: "",
      additional_notes: "",
      category: "",
    });

    //Reset step variables
    setSteps([]);
    setStepSubmitted(false);
    setStepsAllSubmitted(false);
    setStepCount(1);
    setStepForm({
      desc: "",
    });
  };

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
    addIngredient(ingForm);
    setIngredientSubmitted(true);
    setIngForm({
      name: "",
      quantity: "",
      additional_notes: "",
      category: "",
    });
  };

  const handleStepSubmit = (event) => {
    event.preventDefault();
    stepForm.id = stepCount;
    addStep(stepForm);
    setStepCount(stepCount + 1);
    setStepSubmitted(true);

    setStepForm({
      desc: "",
    });
  };

  const addStep = (stepForm) => {
    console.log(stepForm);
    const newStep = {
      id: stepForm.id,
      desc: stepForm.desc,
      containedIngredients: [],
    };
    console.log("setting new array");
    setSteps([...steps, newStep]);
    // for(let i = 0; i < steps.length; i++) {
    //   console.log(steps[i]);
    // }
  };

  const addIngredient = (ingForm) => {
    console.log(ingForm);
    const newIng = {
      id: ingIdCount,
      name: ingForm.name,
      quantity: ingForm.quantity,
      additional_notes: ingForm.additional_notes,
      category: ingForm.category,
    };
    setIngIdCount(ingIdCount + 1);
    console.log(newIng);
    setIngredients([...ingredients, newIng]);
  };

  const GetRecipeBlock = () => {
    //console.log(recipeSubmitted + " I dont understand how this is false")
    if (recipeSubmitted && recipe != null) {
      //console.log("agsemea")
      return <RecipeBlock recipe={recipe}> </RecipeBlock>;
    } else {
      //console.log(`${recipeSubmitted} + ${recipe}`)
      return (
        <div className="container d-flex justify-content-center mt-3">
          *Recipe will appear here*
        </div>
      );
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
        ));
      } else {
        return (
          <IngredientBlock key={ingredients.name} ing={ingredients}>
            {" "}
          </IngredientBlock>
        );
      }
    } else {
      //console.log(`${recipeSubmitted} + ${recipe}`)
      return (
        <div className="mt-5 container d-flex justify-content-center">
          {" "}
          *Ingredients will appear here*
        </div>
      );
    }
  };

  const GetStepBlocks = () => {
    if (steps != null && stepSubmitted) {
      if (steps.length != null) {
        return steps.map((step) => (
          <StepBlock key={step.id} step={step} sendData={handleDroppedItems}>
            {" "}
          </StepBlock>
        ));
      } else {
        return (
          <StepBlock key={steps.id} step={steps}>
            {" "}
          </StepBlock>
        );
      }
    } else {
      return (
        <div className="mt-5 container d-flex justify-content-center">
          *Steps will appear here*
        </div>
      );
    }
  };

  const handlePageState = () => {
    if (recipeSubmitted && ingredientsAllSubmitted && stepsAllSubmitted) {
      return (
        <div>
          <h4 className="mt-3"> Test zone </h4>

          <p> Drag the ingredients on the steps to pair them up! </p>

          <p> When done, submit the recipe </p>

          <div className="container justify-content-around d-flex pb-3 mt-4">
            <button
              type="submit"
              onClick={submitNewRecipe}
              className="btn btn-dark w-30"
            >
              Send to Server
            </button>
          </div>
        </div>
      );
    }
    //If recipe submitted, show ingredient from
    else if (recipeSubmitted && !ingredientsAllSubmitted) {
      return (
        <div>
          <form onSubmit={handleIngredientSubmit} id="ing-form">
            <div className="mb-3 mt-3">
              <h4 className="text-center"> Add Ingredients </h4>
              <p className="text-center">
                {" "}
                Add all your ingredients here. When ready, go to next section to
                enter steps
              </p>
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

              <div className="mb-3 mt-3">
                <label htmlFor="amount" className="form-label">
                  Quantity
                </label>

                <input
                  type="text"
                  className="form-control"
                  id="quantity"
                  name="quantity"
                  onChange={(event) => handleInputChange(event, 1)}
                  placeholder="e.g 500g, 1kg"
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
                  id="category"
                  name="category"
                  onChange={(event) => handleInputChange(event, 1)}
                  value={ingForm.category}
                ></input>
              </div>

              <div className="container justify-content-around d-flex">
                <button type="submit" className="btn btn-dark w-30">
                  Add
                </button>

                <button
                  onClick={ingredientsComplete}
                  className="btn btn-dark w-30"
                >
                  Next Section
                </button>
              </div>
            </div>
          </form>
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

              <h5> {`Step ${stepCount}`}</h5>
              <p>
                {" "}
                The steps automatically increment by by 1 on submission. E.g
                Step 1 -&gt; Step 2{" "}
              </p>

              <div className="mb-3">
                <label htmlFor="amount" className="form-label">
                  Description
                </label>

                <textarea
                  rows="10"
                  className="form-control"
                  id="desc"
                  name="desc"
                  placeholder="Write the instructions here"
                  onChange={(event) => handleInputChange(event, 2)}
                  value={stepForm.desc}
                />
              </div>

              <div className="container justify-content-around d-flex">
                <button type="submit" className="btn btn-dark w-30">
                  Add
                </button>

                <button onClick={stepsComplete} className="btn btn-dark w-30">
                  Next Section
                </button>
              </div>
            </div>
          </form>
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
              Cook Time (Minutes)
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
              id="cuisine"
              name="cuisine"
              onChange={(event) => handleInputChange(event, 0)}
              value={recipeForm.cuisine}
            ></input>
          </div>

          <div className="container justify-content-around d-flex pb-3">
            <button type="submit" className="btn btn-dark w-30">
              Next Section
            </button>
          </div>
        </form>
      );
    }
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div>
        <div className="container d-flex mt-4">
          <div className="form-container bg-success">{handlePageState()}</div>

          <div className="visual-box bg-secondary">
            {GetRecipeBlock()}
            <div className="d-flex flex-wrap">{GetIngredientBlocks()}</div>

            <div className="d-flex flex-wrap">{GetStepBlocks()}</div>
          </div>
        </div>

        <button type="submit" className="btn btn-primary" onClick={listThing}>
          Print data to the console
        </button>
      </div>
    </DndProvider>
  );
};

export default CreateRecipe;

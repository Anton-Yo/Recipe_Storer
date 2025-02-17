import React, { useState, useEffect } from "react";
import api from "../api";
import "../App.css";
import RecipeBlock from "../Components/RecipeBlock";
import IngredientBlock from "../Components/IngredientBlock";
import StepBlock from "../Components/StepBlock";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { TouchBackend } from "react-dnd-touch-backend";
import { isMobile } from 'react-device-detect';


const CreateRecipe = () => {
  const [recipe, setRecipe] = useState([]);
  const [recipeForm, setRecipeForm] = useState({
    name: "",
    desc: "",
    cook_time: "",
    cuisine: "",
    source: "",
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
  const [uploadedFile, setUploadedFile] = useState()
  const [recipeSubmitted, setRecipeSubmitted] = useState(false);
  const [ingredientSubmitted, setIngredientSubmitted] = useState(false);
  const [ingredientsAllSubmitted, setIngredientsAllSubmitted] = useState(false);
  const [stepSubmitted, setStepSubmitted] = useState(false);
  const [stepsAllSubmitted, setStepsAllSubmitted] = useState(false);
  const [displayUnfilledMessage, setDisplayUnfilledMessage] = useState(false);
  const [isLarge, SetIsLarge] = useState(window.innerWidth > 992)

  const [stepCount, setStepCount] = useState(1);
  const [ingIdCount, setIngIdCount] = useState(1);

  //From and modified for detect isMobile library https://stackoverflow.com/questions/70561995/drag-drop-library-of-react-js-is-not-working-in-mobile-platform
  const Backend = isMobile ? TouchBackend : HTML5Backend;

  const handleDroppedItems = (stepData, attachedIngredients) => {
    //console.log(stepData);
    const stepsCopy = steps.map((step) => {
      //console.log(stepData.id + "''" + step.id);
      if (stepData.id === step.id) {
        //console.log("returning new step");
        return {
          ...step,
          containedIngredients: attachedIngredients,
        };
      } else {
        //console.log("returning default step");
        return step;
      }
    });

    setSteps(stepsCopy);
  };

  const submitNewRecipe = async () => {
    if (ingredientsAllSubmitted && recipeSubmitted && stepsAllSubmitted) {
      const data = {
        recipe: recipe,
        ingredients: ingredients,
        steps: steps,
      };
      console.log("Submitting form data, below:")
      console.log(data);
      ResetPage();

      try {
        const response = await api.post("/submit", data);
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

  const handleGoBack = () => {
    if(stepsAllSubmitted) //If its on the submission page, go back to step page
    {
      setStepsAllSubmitted(false);
      setStepForm({
        desc: "",
      });
      return;
    }

    if(ingredientsAllSubmitted) { //If its on the steps page, go back to ingredients
      setIngredientsAllSubmitted(false);
      setIngForm({
        name: "",
        quantity: "",
        additional_notes: "",
        category: "",
      });
      return;
    }

    if(recipeSubmitted) {
      setRecipeSubmitted(false);
      setRecipe([]); //Recipe must be deleted because there can only be one and no editing yet.
      setRecipeForm({
        name: "",
        desc: "",
        cook_time: "",
        cuisine: "",
      });
      return;
    }
  }

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
    setRecipe(recipeForm);
    setRecipeSubmitted(true);

    //TODO, Some fields are optional so I must check only the compulsory ones. Ill do later
    // const allFieldsFilled = Object.values(recipeForm).every((field => field != ''));
    // if(allFieldsFilled) //If fields are all filled out, proceed to next step, otherwise send an error msg
    // {
    //   setRecipeSubmitted(true);
    // }
    // else
    // {
    //   setDisplayUnfilledMessage(true);
    // }
    
  };

  const handleIngredientSubmit = async (event) => {
    event.preventDefault();
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
    const newStep = {
      id: stepForm.id,
      desc: stepForm.desc,
      containedIngredients: [],
    };
    setSteps([...steps, newStep]);
  };

  const addIngredient = (ingForm) => {
    const newIng = {
      id: ingIdCount,
      name: ingForm.name,
      quantity: ingForm.quantity,
      additional_notes: ingForm.additional_notes,
      category: ingForm.category,
    };
    setIngIdCount(ingIdCount + 1);
    setIngredients([...ingredients, newIng]);
  };

  const GetRecipeBlock = () => {
    if (recipeSubmitted && recipe != null) {
      return <RecipeBlock recipe={recipe}> </RecipeBlock>;
    } else {
      return (
        <div className="container d-flex justify-content-center mt-3">
          *Recipe will appear here*
        </div>
      );
    }
  };

  const GetIngredientBlocks = () => {
    if (ingredients != null && ingredientSubmitted) {
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
        <div className="mt-5 mb-4 container d-flex justify-content-center">
          *Steps will appear here*
        </div>
      );
    }
  };


  const handlePageState = () => {
    if (recipeSubmitted && ingredientsAllSubmitted && stepsAllSubmitted) {
      return (
        <div className="h-100">
          <h4 className="mt-3"> Final Check! </h4>

          <p> Drag the ingredients on the steps to pair them up! </p>

          <p> When done, submit the recipe </p>

          <div className="container h-50 flex-column justify-content-center d-flex mt-4">
            <div className="flex-row justify-content-around d-flex pb-3 mt-4">
              
              <button type="submit" onClick={handleGoBack} className="btn btn-dark w-30">
                    Back
              </button>

              <button
                type="submit"
                onClick={submitNewRecipe}
                className="btn btn-dark w-30"
              >
                Send to Server
              </button>
            </div>
        
          </div>
        </div>
      );
    }
    //Show Ingredient form
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
                  maxLength="30"
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
                  maxLength="30"
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
                  placeholder="(optional)"
                  maxLength="40"
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
                  maxLength="30"
                  onChange={(event) => handleInputChange(event, 1)}
                  value={ingForm.category}
                ></input>
              </div>

              <div className="container justify-content-around d-flex mt-4">
                <button type="submit" onClick={handleGoBack} className="btn btn-dark w-25">
                    Back
                </button>

                <button
                  onClick={ingredientsComplete}
                  className="btn btn-dark w-25"
                >
                  Next Section
                </button>

                <button type="submit" className="btn btn-dark w-25">
                  Add
                </button>
              </div>
            </div>
          </form>
        </div>
      );
    }
    //Show Step form
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
                  maxLength="1000"
                  onChange={(event) => handleInputChange(event, 2)}
                  value={stepForm.desc}
                />
              </div>

              <div className="container justify-content-around d-flex mt-4">
                <button type="submit" onClick={handleGoBack} className="btn btn-dark w-25">
                  Back
                </button>
            
                <button onClick={stepsComplete} className="btn btn-dark w-25">
                  Next Section
                </button>

                <button type="submit" className="btn btn-dark w-25">
                  Add
                </button>

                
              </div>
            </div>
          </form>
        </div>
      );
    }
    //Show Recipe form
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
              maxLength="40"
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
              maxLength="100"
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
              maxLength="30"
              onChange={(event) => handleInputChange(event, 0)}
              value={recipeForm.cuisine}
            ></input>
          </div>

          <div className="mb-3">
            <label htmlFor="amount" className="form-label">
              Source
            </label>

            <input
              type="text"
              className="form-control"
              id="source"
              name="source"
              maxLength="100"
              placeholder="(optional)"
              onChange={(event) => handleInputChange(event, 0)}
              value={recipeForm.source}
            ></input>
          </div>

          <div className="container justify-content-around d-flex pb-3 mt-4">
            <button type="submit" className="btn btn-dark w-30">
              Next Section
            </button>
          </div>
        </form>
      );
    }
  };

  //Based off 992 px standard for large from bootstrap
  const checkSize = () => {
    SetIsLarge(window.innerWidth > 992)
  }

  useEffect(() => {
    //Add listener to update page when dimensions change. to swap between 2/4 boxes per row
    window.addEventListener('resize', checkSize);
    return () => window.removeEventListener('resize', checkSize);
  }, []);

  const getPageOrder = () => {
    if(isMobile || !isLarge)
    {
      return (
      <div>
        <div className="container-fluid d-flex flex-column flex-lg-row mt-4"> {/* This one is the overall container */}
          <div className="visual-box bg-papaya border border-secondary rounded">
            {GetRecipeBlock()}
            <div className="d-flex mt-2 flex-wrap">{GetIngredientBlocks()}</div>
            <div className="d-flex mt-2 flex-wrap">{GetStepBlocks()}</div>
          </div>

          <div className="form-container p-2 bg-lightblue border border-secondary rounded">{handlePageState()}</div>
        </div>

        <div className="container-lg w-75 mb-4 p-2">
          <details className="mt-3">
            <summary> Click to upload a JSON file </summary>
              <div className="d-flex flex-column container justify-content-center">

                <div className="container-lg w-100 bg-file d-flex flex-column w-25 pb-3"> 
                  <form onSubmit={submitJSONFile} className="text-center mt-2">
                    <h6> Upload JSON File: </h6>
                    <label htmlFor="jsonToUpload">  <p> Make sure it is the right format!</p></label>
                    <div className="text-center"> 
                      <input type='file' onChange={handleFile} className="p-2" id="file-upload" name='fileToUpload'></input> 
                    </div>
                    <input type="submit" value="Submit" className="btn btn-dark"></input> 
                  </form>
                </div>

                <div className="container-lg text-center bg-string mt-3 d-flex flex-column">
                  <h6 className="mt-2"> Paste JSON String </h6> 
                  <textarea id="json-textarea" rows="6" cols="50" placeholder="Paste your JSON string here" className="mt-1 "/>
                  <div className="container">
                    <button className="my-2 btn btn-dark w-50 overflow-hidden" onClick={submitJSONString}> Submit String </button>
                  </div>
                </div>

              </div>
            </details>
            </div>
      </div>
      )
    }
    else //The order should be reversed for mobile cos the keyboard pops up, so I want to see the visual up the top
    {
      return (
        <div>
          <div className="container-fluid d-flex flex-column flex-lg-row mt-4"> {/* This one is the overall container */}
            <div className="form-container p-2 bg-lightblue border border-secondary rounded">{handlePageState()}</div>

            <div className="visual-box bg-papaya border border-secondary rounded">
              {GetRecipeBlock()}
              <div className="d-flex mt-2 flex-wrap">{GetIngredientBlocks()}</div>
              <div className="d-flex mt-2 flex-wrap">{GetStepBlocks()}</div>
            </div>
          </div>

          <div className="container-lg w-50 my-2 p-2">
          <details className="p-2">
          <summary> Click to upload a JSON file </summary>
              <div className="d-flex flex-row container justify-content-center">

                <div className="container-lg w-50 bg-file d-flex flex-column w-25"> 
                  <form onSubmit={submitJSONFile} className="text-center mt-2">
                    <h6> Upload JSON File: </h6>
                    <label htmlFor="jsonToUpload"> <p> Make sure it is the right format!</p></label>
                    <div className="text-center"> 
                      <input type='file' onChange={handleFile} className="p-2 special-margin" id="file-upload" name='fileToUpload'></input> 
                    </div>
                    <input type="submit" value="Submit" className="btn btn-dark mt-2"></input> 
                  </form>
                </div>

                <div className="container-lg w-50 text-center bg-string justify-contents-center d-flex flex-column">
                  <h6 className="mt-2"> Paste JSON String </h6> 
                  <textarea id="json-textarea" rows="6" cols="50" placeholder="Paste your JSON string here" className="mt-1 "/>
                  <div className="container">
                    <button className="my-2 btn btn-dark overflow-hidden" onClick={submitJSONString}> Submit String </button>
                  </div>
                </div>

              </div>
            </details>
            </div>
          </div>
        )
    }
  }

  const handleFile = (event) => {
    setUploadedFile(event.target.files[0])
  }

  const submitJSONFile = async (event) => {
    event.preventDefault()
    let response 
    const submittedFile = uploadedFile;
    const inputField = document.getElementById("file-upload")
  

    const formData = new FormData();
    formData.append('file', submittedFile)

    console.log(submittedFile)

    if(submittedFile == null) //Dont do anything if the file is null
    {
      alert("File is missing")
      return;
    }

    if(submittedFile.type !== "application/json") //Dont do anything if its not JSON
    {
      alert("Please submit a valid JSON file")
      return;
    }

    try {
        //Send to server
        try {
          response = await api.post("/load_from_JSON_file", formData);
          inputField.value = '';
          setUploadedFile()
        } catch (error) {
          console.error("Error submitting form:", error.response.data);
        }

        //if submission to server failed, throw an error so the alert provides feedback
        if(response.data == "Error in JSON formatting")
          throw new Error("Upload failed");
        
        alert("Upload was a success")
    }
    catch (error)
    {
      alert("Upload failed :(\nMake sure the uploaded file is of in the correct JSON format")
    }
  }

  const submitJSONString = async () => {
      const input = document.getElementById("json-textarea");

      try {
        const jString = "[" + input.value + "]" //Need to add this for FASTAPI body
        const parsedInput = JSON.parse(jString); 
        
        
        let response
        
        //Send to server
        try {
          response = await api.post("/load_from_JSON_string", parsedInput);
          input.value = ''
        } catch (error) {
          console.error("Error submitting form:", error.response.data);
        }

        //if submission to server failed, throw an error so the alert provides feedback
        if(response.data == "Error in JSON formatting")
          throw new Error("Upload failed");

        alert("Upload was a success")
      }
      catch (e) {
        alert("Upload failed :(\nMake sure the JSON string follows the format shown in the downloadable files")
      }

    
  }



  return (
    <DndProvider backend={Backend}>
      <div>
        {getPageOrder()}
      </div>
    </DndProvider>
  );
};

export default CreateRecipe;

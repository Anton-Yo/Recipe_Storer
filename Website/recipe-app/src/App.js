import React, {useState, useEffect} from "react"
import api from "./api"
import './App.css'


const App = () => {
  const [recipes, setRecipes] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    desc: "",
    cuisine_name: "",
    ingredients: [],
    steps: [],
  });
  // const[ingredients, setIngredients] = useState([]);
  // const[ingForm, setIngFormData] = useState({
  //   name: "",
  //   quantity: "",
  //   additional_notes: "",
  //   category_name: "",
  //   recipe_id: 1,
  //   step_id: 1,
  // });

  const fetchRecipes = async() => {
    const response = await api.get("/recipes");
    setRecipes(response.data)
  };

  // const fetchIngredients = async() => {
  //   const response = await api.get("/fetch_ingredients");
  //   console.log(response.data);
  //   setIngredients(response.data)
  // }

  useEffect(() => {
    fetchRecipes();
    //fetchIngredients();
  }, []);

  const handleInputChange = (event) => {
    const value = event.target.type === "checkbox" ? event.target.checked : event.target.value;
    setFormData({
      ...formData,
      [event.target.name]: value,
    });
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    console.log(formData);
    try{
      const response = await api.post("/submit", formData);
      console.log(response.data)
    } catch (error) {
      console.error("Error submitting form:", error.response.data);
    }
  
    fetchRecipes();
    setFormData({
      name: "",
      desc: "",
      cuisine_name: "",
      steps: [],
      ingredients: [],
    });
  };

  // const handleIngredientSubmit = async (event) => {
  //     event.preventDefault();
  //     try{
  //       const response = await api.post("/submit_ingredient", ingForm);
  //       console.log(response.data)
  //     } catch (error) {
  //       console.error("Error submitting form:", error.response.data);
  //     }

  //     fetchRecipes();
  //     setIngFormData({
  //       name: "",
  //       quantity: "",
  //       additional_notes: "",
  //       category_name: "",
  //       recipe_id: 1,
  //       step_id: 1,
  //     })
  // }

  
  const handleDelete = async(recipe_id) => {
    var response;
    try {
      response = await api.delete(`/recipes/${recipe_id}`);
      console.log(response.data);
    }
    catch (error)
    {
      console.error("Error deleting recipe:", error);
    }     
    fetchRecipes()
  }

  // const handleIngDelete = async(ing_id) => {
  //   var response;
  //   try {
  //     response = await api.delete(`/ingredients/${ing_id}`);
  //     console.log(response.data);
  //   }
  //   catch (error)
  //   {
  //     console.error("Error deleting recipe:", error);
  //   }   
  //   fetchRecipes();
  // }

  return (
      <div> 
        <nav className ='navbar navbar-dark bg-primary'>
          <div className ='container-fluid'>
            {/* <a className = 'navbar-brand' href='#'>
                Test link for recipes 3
            </a> */}
          </div>
        </nav>

        <div className='container'>
          <form onSubmit={handleFormSubmit}>

            <div className='mb-3 mt-3'>
              <h4>Recipes</h4>
              <label htmlFor='amount' className='form-label'>
                Name
              </label>

              <input type='text' className='form-control' id='name' name='name' onChange={handleInputChange} value={formData.name}></input>
            </div>

            <div className='mb-3'>
              <label htmlFor='amount' className='form-label'>
                Description
              </label>

              <input type='text' className='form-control' id='desc' name='desc' onChange={handleInputChange} value={formData.desc}></input>
            </div>

            <div className='mb-3'>
              <label htmlFor='amount' className='form-label'>
                Cuisine
              </label>

              <input type='text' className='form-control' id='cuisine_name' name='cuisine_name' onChange={handleInputChange} value={formData.cuisine_name}></input>
            </div>

            <button type='submit' className ='btn btn-primary'>
              Submit
            </button>

          </form>
        </div>

        {/* <h4 className='m-auto text-center'> Ingredient list </h4>
        <div className='container d-flex mb-3 mt-5'>
          <div id='left-side' className='w-50 p-3 bg-danger'> 
              <form onSubmit={handleIngredientSubmit} id='ing-form'>

                <div>
                  <label htmlFor='amount' className='form-label'>
                    Ingredient Name
                  </label>

                  <input type='text' className="form-control" id="ing_name" name="ing_name" onChange={handleInputChange} value={formData.desc}></input>

                </div>

                <div className='mb-3'>
                  <label htmlFor='amount' className='form-label'>
                    Description
                  </label>

                  <input type='text' className='form-control' id='desc' name='desc' onChange={handleInputChange} value={formData.desc}></input>
                </div>

                <div className='mb-3'>
                  <label htmlFor='amount' className='form-label'>
                    Cuisine
                  </label>

                  <input type='text' className='form-control' id='cuisine_name' name='cuisine_name' onChange={handleInputChange} value={formData.cuisine_name}></input>
                </div>

                <button type='submit' className ='btn btn-primary'>
                  Submit
                </button>

              </form>
          </div>

          <div id='right-side' className='w-50 p-3 bg-dark'>
            <table className='table table-striped table-bordered table-hover mt-3'>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Quantity</th>
                  <th>additional_notes</th>
                  <th>category</th>
                  <th>step</th>
                  <th className="text-center">Delete?</th>
                </tr>
              </thead>

              <tbody>
                {ingredients.map((ing) => (
                  <tr key={ing.id}>
                    <td>{ing.name}</td>
                    <td>{ing.quantity}</td>
                    <td>{ing.additional_notes}</td>
                    <td>{ing.category_name}</td>
                    <td>Step {ing.step}</td>
                    <td>
                      <button onClick={() => handleIngDelete(ing.id)}> Delete </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div> */}

        <div className='mx-5 my-3 boxes-container'>
            {recipes.map((recipe) => (
                  <div key={recipe.id} className='recipe-box'> 
                      <p> {recipe.name} </p>
                      <p> {recipe.desc} </p>
                  </div>
            ))}
        </div>

          <table className='table table-striped table-bordered table-hover mt-3'>
            <thead>
              <tr>
                <th>Name</th>
                <th>Description</th>
                <th>Cuisine</th>
                <th className="text-center">Delete?</th>
              </tr>
            </thead>

            <tbody>
              {recipes.map((recipe) => (
                <tr key={recipe.id}>
                  <td>{recipe.name}</td>
                  <td>{recipe.desc}</td>
                  <td>{recipe.cuisine_id}</td>
                  <td>
                    <button onClick={() => handleDelete(recipe.id)}> Delete </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

      </div>
  )
}

export default App;
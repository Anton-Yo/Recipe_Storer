import React, {useState, useEffect} from "react"
import api from "./api"
import axios from 'axios'


const App = () => {
  const [recipes, setRecipes] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    desc: ""
  });


  const fetchRecipes = async() => {
    const response = await api.get("/recipes");
    setRecipes(response.data)
  };

  useEffect(() => {
    fetchRecipes();
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
    await api.post("/create_recipe", formData);
    fetchRecipes();
    setFormData({
      name: "",
      desc: ""
    });
  };

  
    const handleDelete = async(recipe_id) => {
      var response;
      try {
        response = await api.delete(`/recipes/${recipe_id}`);
        console.log(response.data);
      }
      catch (error)
      {
        console.error("Error deleteing recipe:", error);
      }
      
      fetchRecipes()
    }

  return (
      <div> 
        <nav className ='navbar navbar-dark bg-primary'>
          <div className ='container-fluid'>
            <a className = 'navbar-brand' href='#'>
                Test link for recipes 3
            </a>
          </div>
        </nav>

        <div className='container'>
          <form onSubmit={handleFormSubmit}>

            <div className='mb-3 mt-3'>
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

            <button type='submit' className ='btn btn-primary'>
              Submit
            </button>

          </form>

          <table className='table table-striped table-bordered table-hover mt-3'>
            <thead>
              <tr>
                <th>Name</th>
                <th>Description</th>
                <th className="text-center">Delete?</th>
              </tr>
            </thead>

            <tbody>
              {recipes.map((recipe) => (
                <tr key={recipe.id}>
                  <td>{recipe.name}</td>
                  <td>{recipe.desc}</td>
                  <td>
                    <button onClick={() => handleDelete(recipe.id)}> Delete </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

        </div>
      </div>
  )
}

export default App;
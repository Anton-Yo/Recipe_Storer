from fastapi import FastAPI, Depends, HTTPException, Form, Request
from typing import Annotated, List
from sqlalchemy.orm import Session
import models, schemas, crud, json
from database import SessionLocal, engine
from fastapi.middleware.cors import CORSMiddleware

# Create the database tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI()

origins = [
    "http://localhost:3000",
    "http://127.0.0.1:8000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins = ['*'],
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*'],
    expose_headers=['*'],
)

# Dependency to get the database session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/")
def helpme():
    return "Time to learn databases and development"

# ---------------------------
#    Testing StepAndIngs
# --------------------------
@app.get("/get")
def getThat(id: int, db: Session = Depends(get_db)):
    db_steps = crud.get_stuff(db=db, recipe_id = id)
    return db_steps

# -------------------
#    CREATE STUFF
# -------------------
@app.post("/submit", response_model=str)
async def submit(data: schemas.SubmitRecipe, db: Session = Depends(get_db)):
    print(data)
    print(" gangsta") 
    
    #Separate the data into 
    # 1. Recipe info -> Create recipe

    # 2. Step info -> Create steps
    # 3. Ingredient info -> create ingredients, referencing newly created steps/recipe

     # 1. Recipe info -> Create recipe
    recipe_id = create_recipe(recipe_data = data.recipe, db=db).id
    
    # # 2. Step info -> Create steps
    ing_list = []
    for step in data.steps:
        
        #Loop thru and make all the ingredients
        for ing in step.containedIngredients:
            ingData = schemas.SubmitIng(
                name = ing.name,
                quantity = ing.quantity,
                additional_notes = ing.additional_notes,
                category_id = get_category_id_by_name(category_name = ing.category, db=db),
                recipe_id = recipe_id,
            )
            ing_list.append(create_ingredient(ingData, db=db))

        #create the steps
        stepData = schemas.StepCreate(
            desc = step.desc,
            recipe_id = recipe_id
        )
        new_step = create_step(step=stepData, db=db)

        #assign the ingredients under the step
        for containedIng in step.containedIngredients:

            for ing in ing_list:
                if containedIng.name == ing.name and containedIng.quantity == ing.quantity:
                    new_step.ingredients.append(ing)

    db.commit()
    db.refresh(new_step)   

    #create_recipe(recipe_data = data, db = db)
    return "New Recipe submitted successfully"


@app.post("/submit_ingredient", response_model=str)
async def submit_ing(data: schemas.SubmitIng, db: Session = Depends(get_db)):
    print(data, data.name, data.quantity, data.additional_notes, data.category_id, data.recipe_id, data.step_id)
    create_ingredient(ing_data = data, db=db)
    return "Ingredient created successfully"

# -------------
#    RECIPES
# -------------

@app.post("/create_recipe", response_model= schemas.Recipe)
def create_recipe(recipe_data: schemas.Recipe, db: Session = Depends(get_db)):
    print(recipe_data)
    db_recipe = models.Recipe(name = recipe_data.name, desc = recipe_data.desc, cook_time = recipe_data.cook_time, cuisine_id = crud.get_cuisine_id_by_name(db, cuisine_name = recipe_data.cuisine))
    db.add(db_recipe)
    db.commit()
    db.refresh(db_recipe)
    #db_recipe = crud.create_recipe(db=db, recipe=recipe)
    return db_recipe

@app.get("/recipes/search_ids/{recipe_id}", response_model=schemas.Recipe)
def read_recipe(recipe_id:int, db: Session = Depends(get_db)):
    db_recipe = crud.get_recipe(db, recipe_id=recipe_id)
    if db_recipe is None:
        raise HTTPException(status_code=404, detail="Recipe not found")
    return db_recipe

@app.get("/recipes/search_names/{recipe_name}", response_model=schemas.Recipe)
def get_recipe_by_name(recipe_name: str, db: Session = Depends(get_db)):
    db_recipe = crud.get_recipe_by_name(db, name = recipe_name)
    if db_recipe is None:
        raise HTTPException(status_code=404, detail="Recipe not found")
    return db_recipe

@app.get("/recipes-test", response_model=List[schemas.Recipe])
def get_all_recipes(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    db_recipes = crud.get_recipes(db, skip=skip, limit=limit)
    if db_recipes is None:
        print("The recipes are gone")
        raise HTTPException(status_code=404, detail="Recipe list not found")
    return db_recipes

@app.delete("/recipes/{recipe_id}", response_model=str)
def delete_recipe(recipe_id: int, db: Session = Depends(get_db)):
    crud.delete_recipe(db, recipe_id = recipe_id)
    return "Recipe deleted successfully"

@app.get("/recipes")
def get_recipes_info(db: Session = Depends(get_db)):
    db_recipes = crud.get_recipes_for_website(db, skip=0, limit=1000)
    print("Got that sweet sweet recipe info")
    return db_recipes

@app.get("/recipes/{recipe_id}", response_model=schemas.Recipe)
def get_single_recipe_info(recipe_id: int, db: Session = Depends(get_db)):
    db_recipe = crud.get_single_recipe(db, recipe_id = recipe_id)
    print("Got that sweet sweet recipe info")
    if db_recipe is None:
        raise HTTPException(status_code=404, detail="Recipe not found")
    return db_recipe

# -------------
#  INGREDIENTS
# -------------

@app.post("/recipes/{recipe_id}/create_ingredient", response_model = schemas.Ingredient)
def create_ingredient(ing_data = schemas.SubmitIng, db: Session = Depends(get_db)):
    db_ing = crud.create_ing(db, ing_data = ing_data)
    if db_ing is None:
        raise HTTPException(status_code=404, detail="Ingredient creation failed")
    return db_ing

@app.get("/ingredients", response_model=List[schemas.Ingredient])
def get_ingredients(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    db_ings = crud.get_ingredients(db, skip=skip, limit=limit)
    if db_ings is None:
        print("No ings found")
        raise HTTPException(status_code=404, detail="No ingredients found")
    return db_ings

#Duplicate of previous func basically
@app.get("/fetch_ingredients", response_model=List[schemas.Ingredient])
def fetch_ingredients(db: Session = Depends(get_db)):
    db_ings = []
    db_ings = crud.get_ingredients(db = db)
    return db_ings

#Grab the ingredients by recipe
@app.get("/fetch_ingredients/{recipe_id}", response_model=List[schemas.Ingredient])
def fetch_ingredients_by_recipe_id(recipe_id: int, db: Session = Depends(get_db)):
    db_ings = []
    db_ings = crud.get_ingredients_by_recipe_id(recipe_id = recipe_id, db = db)
    return db_ings


@app.get("/ingredients/search_ids/{ing_id}", response_model=schemas.Ingredient)
def get_ing(ing_id:int, db: Session = Depends(get_db)):
    db_ing = crud.get_ing(db, ing_id=ing_id)
    if db_ing is None:
        raise HTTPException(status_code=404, detail="Ingredient not found")
    return db_ing

@app.get("/ingredients/search_names/{ing_name}", response_model=schemas.Ingredient)
def get_ing_by_name(ing_name: str, db: Session = Depends(get_db)):
    db_ing = crud.get_ing_by_name(db, ing_name = ing_name)
    if db_ing is None:
        raise HTTPException(status_code=404, detail="Ingredient not found")
    return db_ing


@app.delete("/ingredients/{ing_id}", response_model=str)
def delete_ing(ing_id: int, db: Session = Depends(get_db)):
    crud.delete_ing(db, ing_id = ing_id)
    return "Ingredient deleted successfully"

# -------------
#    CUISINE
# -------------

@app.post("/create_cuisine", response_model= schemas.Cuisine)
def create_cuisine(cuisine: schemas.CuisineCreate, db: Session = Depends(get_db)):
    db_cuisine = crud.create_cuisine(db, cuisine_name = cuisine.name)
    #db_recipe = crud.create_recipe(db=db, recipe=recipe)
    return db_cuisine


@app.get("/cuisines", response_model=List[schemas.Cuisine])
def get_cuisines(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    db_cuisines = crud.get_cuisines(db, skip=skip, limit=limit)
    if db_cuisines is None:
       raise HTTPException(status_code=404, detail="Cuisines not found")
    return db_cuisines

@app.get("/recipes/{cuisine_name}", response_model=List[schemas.Recipe])
def get_recipes_by_cuisine(cuisine_name: str, db: Session = Depends(get_db)):
    db_recipes = crud.get_recipes_by_cuisine(db, cuisine_name = cuisine_name)
    if db_recipes is None:
       raise HTTPException(status_code=404, detail="Cuisines not found")
    return db_recipes

@app.delete("/delete_cuisine/{cuisine_name}", response_model=str)
def delete_cuisine(cuisine_name: str, db: Session = Depends(get_db)):
    crud.delete_cuisine(db, cuisine_name = cuisine_name)
    return "cuisine deleted successfully"

@app.get("/cuisines/{cuisine_name}", response_model = int)
def get_cuisine_id_by_name(cuisine_name: str, db: Session = Depends(get_db)):
    return crud.get_cuisine_id_by_name(db, cuisine_name= cuisine_name)

# -------------
#    STEPS
# -------------

@app.post("/create_step", response_model=schemas.Step)
def create_step(step: schemas.StepCreate, db: Session = Depends(get_db)):
    db_step = crud.create_step(db, step_desc = step.desc, attached_recipe = step.recipe_id)
    return db_step

@app.get("/{recipe_id}/steps", response_model=List[schemas.Step])
def get_steps_by_recipe(recipe_id: int, db: Session = Depends(get_db)):
    
    db_steps = crud.get_steps_by_recipe(db, target_id = recipe_id)

    if not db_steps:
        raise HTTPException(status_code=404, detail="there are no steps associated with those recipes")
    return db_steps

@app.delete("/step/{step_id}", response_model=str)
def delete_step(step_id: int, db: Session = Depends(get_db)):
    crud.delete_step(db, step_id = step_id)
    return "step deleted successfully"

@app.get("/steps", response_model=List[schemas.Step])
def get_steps(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    db_steps = crud.get_steps(db)
    if db_steps is None:
       raise HTTPException(status_code=404, detail="steps not found")
    return db_steps


# -----------------
#    Categories
# -----------------

@app.post("/create_category", response_model= schemas.Category)
def create_category(category: schemas.CategoryCreate, db: Session = Depends(get_db)):
    print(category)
    db_category = crud.create_category(db, category_name = category.name)
    #db_recipe = crud.create_recipe(db=db, recipe=recipe)
    return db_category


@app.get("/categories", response_model=List[schemas.Category])
def get_categories(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    db_categories = crud.get_categories(db, skip=skip, limit=limit)
    if db_categories is None:
       raise HTTPException(status_code=404, detail="Categories not found")
    return db_categories

@app.get("/ingredients/{category_name}", response_model=List[schemas.Ingredient])
def get_ingredients_by_category(category_name: str, db: Session = Depends(get_db)):
    db_ings = crud.get_ingredients_by_category(db, category_name = category_name)
    if db_ings is None:
       raise HTTPException(status_code=404, detail="Ingredients not found")
    return db_ings

@app.delete("/delete_category/{category_name}", response_model=str)
def delete_category(category_name: str, db: Session = Depends(get_db)):
    crud.delete_category(db, category_name = category_name)
    return "category deleted successfully"

@app.get("/categories/{category_name}", response_model = int)
def get_category_id_by_name(category_name: str, db: Session = Depends(get_db)):
    return crud.get_category_id_by_name(db, category_name= category_name)

@app.get("/recipe/{recipe_id}/categories", response_model=List[schemas.Category])
def get_categories_from_recipe_id(recipe_id: int, db: Session = Depends(get_db)):
    print("what")
    #ings = get_ingredients(db = db)
    ings = fetch_ingredients_by_recipe_id(recipe_id = recipe_id, db=db)

    print("Got the ingredients")
    #Get the ids of the ingredients that need to be checked
    id_list = []
    for ing in ings:
        id_list.append(ing.id)

    return crud.get_categories_from_ingredient_list(db, id_list)


# ---------------------------------
#    CREATE TEST DATA WITH JSON
# ---------------------------------

@app.post("/test_data", response_model=str)
def create_test_data(db: Session = Depends(get_db)):

    #Opens the file
    f = open('testData.json')

    #returns as dictionary
    data = json.load(f)
    #print(data)

    ings = [] #pass this thru to steps
    #iterating through the json.

    #Make the cuisines
    for i in data["cuisines"]:
        #print(i)
        create_cuisine_from_dict(i, db = db)

    #Make the recipes
    for i in data["recipes"]:
        create_recipe_from_dict(i, db = db)

    # # #make the ingredients
    for i in data["ingredients"]:
        #print(data["ingredients"])
        ings.append(create_ingredient_from_dict(i, db = db))

    # #make the categories
    for i in data["categories"]:
        create_category_from_dict(i, db=db)

    # #make the steps
    for i in data["steps"]:
        create_step_from_dict(i, db=db)

    f.close()
    #print(data)
    #create_recipe_from_dict(recipe_data = recipes, db=db)
    return "done"

def create_recipe_from_dict(recipe_data: dict, db: Session = Depends(get_db)):
    print(recipe_data)
    db_recipe = models.Recipe(name = recipe_data.get("name"), desc = recipe_data.get("desc"), cook_time = recipe_data.get("cook_time"), cuisine_id = crud.get_cuisine_id_by_name(db, cuisine_name = recipe_data.get("cuisine_name")))
    db.add(db_recipe)
    db.commit()
    db.refresh(db_recipe)
    #db_recipe = crud.create_recipe(db=db, recipe=recipe)
    return db_recipe

def create_cuisine_from_dict(cuisine: dict, db: Session = Depends(get_db)):
    db_cuisine = crud.create_cuisine(db, cuisine_name = cuisine["name"])
    #db_recipe = crud.create_recipe(db=db, recipe=recipe)
    return db_cuisine

def create_ingredient_from_dict(ing_data: dict, db: Session = Depends(get_db)):
    db_ing = crud.create_ing_from_dict(db, ing_data = ing_data)
    if db_ing is None:
        raise HTTPException(status_code=404, detail="Ingredient creation failed")
    return db_ing

def create_step_from_dict(step: dict, db: Session = Depends(get_db)):
    db_step = crud.create_step(db, step_desc = step["desc"], attached_recipe = step["recipe_id"])

    #Get the ingredients of the recipe involved
    ings_in_recipe = crud.get_ingredients_by_recipe_id(step["recipe_id"], db=db)

    print("....................")
    for i in ings_in_recipe:
        print(i.name)
    print("....................")

    print("Before the loop")
    print(step)

    #for each ingredient in the step, assign the ingredient DB id to the step via relationship
    for containedIng in step["contained_ingredients"]:
        print("------------")
        print(containedIng)
        for ing in ings_in_recipe:
        
            print("Looping")
            print(ing.name)
            print(ing.quantity)
            if containedIng["name"] == ing.name and containedIng["quantity"] == ing.quantity: 
                print(f"{ing.name} from recipe id {ing.recipe_id} is being appended to step {db_step.id}")
                db_step.ingredients.append(ing)
                print("god help me")
    
    print("End")

    for i in db_step.ingredients:
        print(f'I contain {i.name}')

    db.commit()
    db.refresh(db_step)
    #db_step.refresh(db_step)
    return db_step

def create_category_from_dict(category: dict, db: Session = Depends(get_db)):
    print(category)
    db_category = crud.create_category(db, category_name = category["name"])
    if db_category is None:
        raise HTTPException(status_code=404, detail="Category is not found")
    return db_category

@app.delete("/clear_db", response_model=str)
def delete_all(db: Session = Depends(get_db)):
    db.query(models.Cuisine).delete()
    db.query(models.Recipe).delete()
    db.query(models.Ingredient).delete()
    db.query(models.Category).delete()
    db.query(models.Step).delete()
    db.query(models.StepsAndIngredients).delete()
    db.commit()
    return "Database cleared successfully"

# ---------------------------------
#    Download Data as JSON
# ---------------------------------





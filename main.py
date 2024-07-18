from fastapi import FastAPI, Depends, HTTPException
from typing import Annotated, List
from sqlalchemy.orm import Session
import models, schemas, crud
from database import SessionLocal, engine
from fastapi.middleware.cors import CORSMiddleware

# Create the database tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI()

origins = [
    "http://localhost:3000",
    "http://127.0.0.1:50205"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=['*'],
    allow_credentials=['*'],
    allow_methods=['*'],
    allow_headers=['*']
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
    return "gang gang"


@app.post("/create_recipe", response_model= schemas.Recipe)
def create_recipe(recipe: schemas.RecipeCreate, db: Session = Depends(get_db)):
    db_recipe = models.Recipe(name = recipe.name, desc = recipe.desc, cuisine_id = recipe.cuisine_id)
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

@app.get("/recipes", response_model=List[schemas.Recipe])
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

# -------------
#  INGREDIENTS
# -------------

@app.post("/recipes/{recipe_id}/create_ingredient", response_model = List[schemas.Ingredient])
def create_ingredients(recipe_id: int, ings: List[schemas.IngredientCreate], db: Session = Depends(get_db)):
    db_recipe = crud.get_recipe(db, recipe_id=recipe_id)
    if db_recipe is None:
        raise HTTPException(status_code=404, detail="Recipe not found")
    
    db_ingredients = []
    for ingredient in ings:
        db_ing = models.Ingredient(**ingredient.model_dump(), recipe_id = recipe_id)
        db.add(db_ing)
        db_ingredients.append(db_ing)
        #db.commit()
        #db.refresh(db_ing)

    db.commit()
    for ing in db_ingredients:
        db.refresh(ing)

    return db_ingredients

@app.get("/ingredients/", response_model=List[schemas.Ingredient])
def get_ingredients(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    db_ings = crud.get_ingredients(db, skip=skip, limit=limit)
    if db_ings is None:
        print("No ings found")
        raise HTTPException(status_code=404, detail="No ingredients found")
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
    db_cuisine = models.Cuisine(name = cuisine.name)
    db.add(db_cuisine)
    db.commit()
    db.refresh(db_cuisine)
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

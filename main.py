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


@app.post("/create_recipe", response_model=schemas.Recipe)
def create_recipe(recipe: schemas.RecipeCreate, db: Session = Depends(get_db)):
    db_recipe = crud.create_recipe(db=db, recipe=recipe)
    return db_recipe

@app.post("/create_ingredient", response_model=schemas.Ingredient)
def create_recipe(recipe: schemas.IngredientCreate, db: Session = Depends(get_db)):
    db_ingredient = crud.create_recipe(db=db, recipe=recipe)
    return db_ingredient


@app.get("/ingredients", response_model=schemas.Ingredient)
def read_ingredients(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    ings = crud.get_ingredients(db, skip = skip, limit = limit)
    return ings

@app.get("/recipes/{recipe_id}", response_model=schemas.Recipe)
def read_recipe(recipe_id:int, db: Session = Depends(get_db)):
    db_recipe = crud.get_recipe(db, recipe_id=recipe_id)
    if db_recipe is None:
        raise HTTPException(status_code=404, detail="Recipe not found")
    return db_recipe

@app.get("/recipes/{recipe_name}", response_model=schemas.Recipe)
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
    

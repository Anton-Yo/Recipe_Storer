from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
import models, schemas, crud
from database import SessionLocal, engine

# Create the database tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI()

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

@app.post("/recipes/", response_model=schemas.Recipe)
def create_recipe(recipe: schemas.RecipeCreate, db: Session = Depends(get_db)):
    db_recipe = crud.create_recipe(db=db, recipe=recipe)
    return db_recipe

@app.get("/ingredients/", response_model=schemas.Ingredient)
def read_ingredients(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    ings = crud.get_ingredients(db, skip = skip, limit = limit)
    return ings

@app.get("/recipes/{recipe_id}/", response_model=schemas.Recipe)
def read_recipe(recipe_id:int, db: Session = Depends(get_db)):
    db_recipe = crud.get_recipe(db, recipe_id=recipe_id)
    if db_recipe is None:
        raise HTTPException(status_code=404, detail="User not found")
    return db_recipe
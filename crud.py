from fastapi import HTTPException
from sqlalchemy.orm import Session

import models, schemas

# -------------
#    RECIPES
# -------------
def get_recipe(db: Session, recipe_id: int):
    return db.query(models.Recipe).filter(models.Recipe.id == recipe_id).first()

def get_recipe_by_name(db: Session, name: str):
    return db.query(models.Recipe).filter(models.Recipe.name == name).first()

def get_recipes(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Recipe).offset(skip).limit(limit).all()

def create_recipe(db: Session, recipe: schemas.RecipeCreate):
    db_recipe = models.Recipe(name = recipe.name, desc = recipe.desc)
    db.add(db_recipe)
    db.commit()
    db.refresh(db_recipe)
    return db_recipe

def delete_recipe(db: Session, recipe_id: int):
    print("Deleting recipe...")
    db_recipe = db.query(models.Recipe).filter(models.Recipe.id == recipe_id).first()
    if db_recipe is None:
        raise HTTPException(status_code=404, detail="Cannot find recipe to delete")
    db.delete(db_recipe)
    db.commit()
    return "Recipe ${recipe_id} has been deleted successfully"

# -------------
#  INGREDIENTS
# -------------

# def create_ing(db: Session, ingSchema: schemas.Ingredient):
#     db_ingredient = models.Ingredient(name = ingSchema.name, recipe_id = 5 )
#     db.add(db_ingredient)
#     db.commit()
#     db.refresh(db_ingredient)
#     return db_ingredient

def get_ing(db: Session, ing_id: int):
    return db.query(models.Ingredient).filter(models.Ingredient.id == ing_id).first()

def get_ing_by_name(db: Session, ing_name: str):
    return db.query(models.Ingredient).filter(models.Ingredient.name == ing_name).first()

def get_ingredients(db: Session, skip:int = 0, limit: int = 100):
    return db.query(models.Ingredient).offset(skip).limit(limit).all()

def delete_ing(db: Session, ing_id: int):
    print("Deleting ingredient...")
    db_ing = db.query(models.Ingredient).filter(models.Ingredient.id == ing_id).first()
    if db_ing is None:
        raise HTTPException(status_code=404, detail="Cannot find ingredient to delete")
    db.delete(db_ing)
    db.commit()
    return "Ingredient ${ing_id} has been deleted successfully"

# -------------
#    Cuisine
# -------------

def get_recipes_by_cuisine(db: Session, cuisine_name: str):
    chosen_cuisine = db.query(models.Cuisine).filter(models.Cuisine.name == cuisine_name).first()
    if not chosen_cuisine:
         raise HTTPException(status_code=404, detail="Cannot any recipes in that cuisine")
    else:
        recipes = db.query(models.Recipe).filter(models.Recipe.cuisine_id == chosen_cuisine.id)
        return recipes

def get_cuisines(db: Session, skip : int = 0, limit: int = 100):
    return db.query(models.Cuisine).offset(skip).limit(limit).all()
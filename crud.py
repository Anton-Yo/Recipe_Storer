from sqlalchemy.orm import Session

import models, schemas

def get_recipe(db: Session, recipe_id: int):
    return db.query(models.Recipe).filter(models.Recipe.id == recipe_id).first()

def get_recipe_by_name(db: Session, name: str):
    return db.query(models.Recipe).filter(models.Recipe.name == name).first()

def get_recipes(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Recipe).offset(skip).limit(limit).all()

def get_ingredients(db: Session, skip:int = 0, limit: int = 100):
    return db.query(models.Ingredient).offset(skip).limit(limit).all()

def create_recipe(db: Session, recipe: schemas.RecipeCreate):
    db_recipe = models.Recipe(name = recipe.name, desc = recipe.desc)
    db.add(db_recipe)
    db.commit()
    db.refresh(db_recipe)
    return db_recipe

def create_recipe_ingredient(db: Session, item: schemas.IngredientCreate, recipe_table_id: int):
    db_ingredient = models.Ingredient(**ingredient.dict(), recipe_id = recipe_table_id)
    db.add(db_ingredient)
    db.commit()
    db.refresh(db_ingredient)
    return db_ingredient

def delete_recipe(db: Session, recipe_id: int):
    print("Gamer")
    db_recipe = db.query(models.Recipe).filter(models.Recipe.id == recipe_id).first()
    if db_recipe is None:
        raise HTTPException(status_code=404, detail="Cannot find recipe to delete")
    db.delete(db_recipe)
    db.commit()
    return "Recipe has been deleted successfully"
    
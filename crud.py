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

def create_ing(db: Session, ing_data: schemas.SubmitIng):
    db_ingredient = models.Ingredient(
        name = ing_data.name, 
        quantity = ing_data.quantity, 
        additional_notes  = ing_data.additional_notes,
        recipe_id = ing_data.recipe_id,
        category_id = ing_data.category_id,
        step_id = ing_data.step_id
    )
    db.add(db_ingredient)
    db.commit()
    db.refresh(db_ingredient)
    return db_ingredient

def create_step(db: Session, step_desc: str, attached_recipe: int):
    db_step = models.Step(step_desc = step_desc, recipe_id = attached_recipe)
    db.add(db_step)
    db.commit()
    db.refresh(db_step)
    return db_step

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

def create_cuisine(db: Session, cuisine_name: str):
    db_cuisine = models.Cuisine(name = cuisine_name)
    db.add(db_cuisine)
    db.commit()
    db.refresh(db_cuisine)
    return db_cuisine

def delete_cuisine(db: Session, cuisine_name:str):
    print("deleting cuisine")
    db_cuisine = db.query(models.Cuisine).filter(models.Cuisine.name == cuisine_name).first()
    if db_cuisine is None:
        raise HTTPException(status_code=404, detail="Cannot find cuisine to delete")
    db.delete(db_cuisine)
    db.commit()
    return "Cuisine ${cuisine_name} has been deleted successfully"

def get_recipes_by_cuisine(db: Session, cuisine_name: str):
    chosen_cuisine = db.query(models.Cuisine).filter(models.Cuisine.name == cuisine_name).first()
    if not chosen_cuisine:
         raise HTTPException(status_code=404, detail="Cannot any recipes in that cuisine")
    else:
        recipes = db.query(models.Recipe).filter(models.Recipe.cuisine_id == chosen_cuisine.id)
        return recipes

def get_cuisines(db: Session, skip : int = 0, limit: int = 100):
    return db.query(models.Cuisine).offset(skip).limit(limit).all()

def get_cuisine_id_by_name(db: Session, cuisine_name: str):
    db_cuisine = db.query(models.Cuisine).filter(models.Cuisine.name == cuisine_name).first()

    if db_cuisine is None:
        print("Created a new cuisine because it didn't exist yet")
        db_cuisine = create_cuisine(db = db, cuisine_name= cuisine_name)

    return db_cuisine.id


# -------------
#    Step
# -------------

def create_step(db: Session, step_desc: str, attached_recipe: int):
    db_step = models.Step(step_desc = step_desc, recipe_id = attached_recipe)
    db.add(db_step)
    db.commit()
    db.refresh(db_step)
    return db_step

def get_steps_by_recipe(db: Session, target_id: int = 1):
    db_steps = []

    db_steps = db.query(models.Step).filter(models.Step.recipe_id == target_id).all()

    return db_steps
    
def delete_step(db: Session, step_id: int):
    print("deleting step")
    db_step = db.query(models.Step).filter(models.Step.id == step_id).first()
    if db_step is None:
        raise HTTPException(status_code=404, detail="Cannot find step to delete")
    db.delete(db_step)
    db.commit()
    return "Step has been deleted successfully"

def get_steps(db: Session, skip : int = 0, limit: int = 100):
    return db.query(models.Step).offset(skip).limit(limit).all()


# -------------
#    Category
# -------------
def create_category(db: Session, category_name: str):
    db_cat = models.Category(name = category_name)
    db.add(db_cat)
    db.commit()
    db.refresh(db_cat)
    return db_cat

def delete_category(db: Session, category_name:str):
    print("deleting category")
    db_category = db.query(models.Category).filter(models.Category.name == category_name).first()
    if db_category is None:
        raise HTTPException(status_code=404, detail="Cannot find category to delete")
    db.delete(db_category)
    db.commit()
    return "Cuisine ${category_name} has been deleted successfully"

def get_ingredients_by_category(db: Session, category_name: str):
    chosen_category = db.query(models.Category).filter(models.Category.name == category_name).first()
    if not chosen_category:
         raise HTTPException(status_code=404, detail="Cannot any the named category")
    else:
        ings = db.query(models.Ingredient).filter(models.Ingredient.category_id == chosen_category.id)
        return ings

def get_categories(db: Session, skip : int = 0, limit: int = 100):
    return db.query(models.Category).offset(skip).limit(limit).all()

def get_category_id_by_name(db: Session, category_name: str):
    db_category = db.query(models.Category).filter(models.Category.name == category_name).first()

    if db_category is None:
        print("Created a new category because it didn't exist yet")
        db_category = create_category(db = db, category_name= category_name)

    return db_category.id
from typing import List
from pydantic import BaseModel

class StepBase(BaseModel):
    step_desc: str

class StepCreate(StepBase):
    recipe_id: int

class Step(StepBase):
    id: int
    recipe_id: int

    class Config:
        from_attributes = True

class IngredientBase(BaseModel):
    name: str

class IngredientCreate(IngredientBase):
    pass

class Ingredient(IngredientBase):
    id: int
    recipe_id: int

    class Config:
        from_attributes = True

class RecipeBase(BaseModel):
    name: str
    desc: str
    cuisine_id: int

class RecipeCreate(RecipeBase):
    ingredients: List[IngredientCreate]
    steps: List[Step]

class Recipe(RecipeBase):
    id: int
    ingredients: List[Ingredient]
    steps: List[Step]

    class Config:
        from_attributes = True

class CuisineBase(BaseModel):
    name: str

class CuisineCreate(CuisineBase):
    pass

class Cuisine(CuisineBase):
    id: int

    class Config:
        from_attributes = True

class SubmitForm(BaseModel):
    name: str
    desc: str
    cuisine_name: str


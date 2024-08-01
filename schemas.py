from typing import List
from pydantic import BaseModel

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

class Recipe(RecipeBase):
    id: int
    ingredients: List[Ingredient]

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

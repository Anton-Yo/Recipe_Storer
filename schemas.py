from pydantic import BaseModel

class IngredientBase(BaseModel):
    name: str

class IngredientCreate(IngredientBase):
    pass

class Ingredient(IngredientBase):
    id: int
    recipe_id: int

    class Config:
        orm_mode = True

class RecipeBase(BaseModel):
    name: str
    desc: str

class RecipeCreate(RecipeBase):
    pass

class Recipe(RecipeBase):
    id: int
    ingredients: list[Ingredient] = []

    class Config:
        orm_mode = True


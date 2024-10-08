from typing import List, Optional
from pydantic import BaseModel, HttpUrl

class CategoryBase(BaseModel):
    name: str

class CategoryCreate(CategoryBase):
    pass

class Category(CategoryBase):
    id: int

    class Config:
        from_attributes = True

class IngredientBase(BaseModel):
    name: str
    quantity: str
    additional_notes: str

class IngredientCreate(IngredientBase):
    pass

class Ingredient(IngredientBase):
    id: int
    recipe_id: int
    category_id: int

    class Config:
        from_attributes = True

class StepBase(BaseModel):
    desc: str
    recipe_id: int

class StepCreate(StepBase):
    pass

class Step(StepBase):
    id: int

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

class RecipeBase(BaseModel):
    name: str
    desc: str
    cook_time: float
    source: Optional[HttpUrl]
    cuisine: Optional[CuisineBase]
    steps: Optional[List[StepBase]]
    ingredients: Optional[List[IngredientBase]]

class RecipeCreate(RecipeBase):
    ingredients: List[IngredientCreate]
    steps: List[StepCreate]

class Recipe(RecipeBase):
    id: int
    ingredients: List[Ingredient]
    steps: List[Step]

    class Config:
        from_attributes = True

class SubmitForm(BaseModel):
    name: str
    desc: str
    cuisine_name: str

class SubmitIng(BaseModel):
    name: str
    quantity: str
    additional_notes: str
    category_id: int
    recipe_id: int

class RecipeInfo(BaseModel):
    name: str
    desc: str
    cuisine_name: str

class IngredientFromFrontEnd(BaseModel):
    id: int
    name: str
    quantity: str
    additional_notes: str
    category: str

class StepFromFrontEnd(BaseModel):
    containedIngredients: List[IngredientFromFrontEnd]
    desc: str
    id: int
     
class RecipeFromFrontEnd(BaseModel):
    name: str
    desc: str
    cook_time: float
    source: str
    cuisine: str

class SubmitRecipe(BaseModel):
    recipe: RecipeFromFrontEnd
    ingredients: List[IngredientFromFrontEnd]
    steps: List[StepFromFrontEnd]

class RecipeID(BaseModel):
    id: int

class StepAndIngredient(BaseModel):
    step_id: int
    ing_id: int

class StepV2(BaseModel):
    id: int
    desc: str
    recipe_id: int
    ingredients: List[Ingredient]

class RecipeToSend(BaseModel):
    name: str
    desc: str
    cook_time: float
    source: str
    cuisine: CuisineBase
    ingredients: List[Ingredient]
    steps: List[StepV2]




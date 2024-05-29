from sqlalchemy import Boolean, Column, ForeignKey, Integer, String
from sqlalchemy.orm import relationship

from .database import Base

class Cuisine(Base):
    __tablename__ = "Cuisine"

    cuisine_id = Column(Integer, primary_key = True)
    cuisine_name = Column(String, unique = True)

class IngredientCategories(Base):
    __tablename__ = "IngredientCategories"

    category_id = Column(Integer, primary_key = True)
    category_name = Column(String)

class Recipes(Base):
    __tablename__ = "Recipes"

    recipe_id = Column(Integer, primary_key = True)
    recipe 

 createStrings.append(
        """CREATE TABLE IF NOT EXISTS Recipes (
            recipeID INTEGER PRIMARY KEY,
            recipeName TEXT,
            recipeDesc TEXT,
            cookTime INTEGER,
            cuisineID INTEGER,
            FOREIGN KEY (cuisineID) REFERENCES Cuisine(cuisineID)
        ); """
    )



class RecipeSteps(Base):
    __tablename__ = "RecipeSteps"

class Ingredients(Base):
    __tablename__ = "Ingredients"







   
    createStrings.append(
        """CREATE TABLE IF NOT EXISTS RecipeSteps (
            recipeID INTEGER,
            stepID INTEGER,
            stepDesc TEXT,
            PRIMARY KEY (recipeID, stepID),
            FOREIGN KEY (recipeID) REFERENCES Recipes(recipeID)
        ); """
    )

    createStrings.append(
        """CREATE TABLE IF NOT EXISTS Ingredients (
            recipeID INTEGER NOT NULL,
            stepID INTEGER NOT NULL,
            ingID INTEGER,
            ingName TEXT,
            ingQuantity TEXT,
            ingInfo TEXT, 
            categoryID INTEGER,
            PRIMARY KEY (recipeID, stepID, ingID),
            FOREIGN KEY (recipeID) REFERENCES Recipes(recipeID), 
            FOREIGN KEY (stepID) REFERENCES RecipeSteps(stepID),
            FOREIGN KEY (categoryID) REFERENCES IngredientCategories(categoryID)
        ); """
    )
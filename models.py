from sqlalchemy import Boolean, Column, ForeignKey, Integer, String
from sqlalchemy.orm import relationship
from database import Base

class Cuisine(Base):
    __tablename__ = "cuisines"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)

    recipe = relationship("Recipe", back_populates="cuisine")


class Category(Base):
    __tablename__ = "categories"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)

    ingredient = relationship("Ingredient", back_populates="category")

class Recipe(Base):
    __tablename__ = "recipes"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    desc = Column(String, index=True)
    cuisine_id = Column(Integer, ForeignKey("cuisines.id"))

    cuisine = relationship("Cuisine", back_populates="recipe")
    ingredients = relationship("Ingredient", back_populates="recipe")
    steps = relationship("Step", back_populates="recipe")

class Ingredient(Base):
    __tablename__ = "ingredients"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    quantity = Column(String, index=True)
    additional_notes = Column(String, index=True)
    category_id = Column(Integer, ForeignKey("categories.id"))
    recipe_id = Column(Integer, ForeignKey("recipes.id"))
    step_id = Column(Integer, ForeignKey("steps.id"))

    recipe = relationship("Recipe", back_populates="ingredients")
    category = relationship("Category", back_populates="ingredient")

class Step(Base):
    __tablename__ = "steps"

    id = Column(Integer, primary_key = True, index=True)
    desc = Column(String, index = True)
    recipe_id = Column(Integer, ForeignKey("recipes.id"))

    recipe = relationship("Recipe", back_populates="steps")




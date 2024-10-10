from sqlalchemy import Boolean, Column, ForeignKey, Integer, String, Table, Float
from sqlalchemy.orm import relationship,DeclarativeBase
from database import Base

class Base (DeclarativeBase):
    pass


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
    cook_time = Column(Float, index=True)
    source = Column(String)
    cuisine_id = Column(Integer, ForeignKey("cuisines.id"))
    
    cuisine = relationship("Cuisine", back_populates="recipe")
    ingredients = relationship("Ingredient", back_populates="recipe")
    steps = relationship("Step", back_populates="recipe")

StepsAndIngredients = Table(
    "StepsAndIngredients",
    Base.metadata,
    Column("step_id", Integer, ForeignKey('steps.id')),
    Column("ing_id", Integer, ForeignKey('ingredients.id'))
)

class Ingredient(Base):
    __tablename__ = "ingredients"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    quantity = Column(String, index=True)
    additional_notes = Column(String, index=True)
    category_id = Column(Integer, ForeignKey("categories.id"))
    recipe_id = Column(Integer, ForeignKey("recipes.id"))

    recipe = relationship("Recipe", back_populates="ingredients")
    category = relationship("Category", back_populates="ingredient")
    steps = relationship("Step", secondary=StepsAndIngredients, back_populates="ingredients")

class Step(Base):
    __tablename__ = "steps"

    id = Column(Integer, primary_key = True, index=True)
    desc = Column(String, index = True)
    recipe_id = Column(Integer, ForeignKey("recipes.id"))

    recipe = relationship("Recipe", back_populates="steps")
    ingredients = relationship("Ingredient", secondary=StepsAndIngredients, back_populates="steps")




import sqlite3

connection = None
cursor = None

createStrings = []


def openDB():
    try:
        global connection
        connection = sqlite3.connect('Recipes.db')
        global cursor
        cursor = connection.cursor()
        print("connection to database established...")
    except sqlite3.Error as e:
        print("Database connection failed with error " + e)

openDB() #Open the database connection and establish the cursor

def createTables(): #Add the necessary empty tables
    createStrings.append(
        """CREATE TABLE IF NOT EXISTS Cuisine (
            cuisineID INTEGER PRIMARY KEY,
            cuisineName TEXT NOT NULL
        ); """
    )

    createStrings.append(
        """CREATE TABLE IF NOT EXISTS IngredientCategories (
            categoryID INTEGER PRIMARY KEY,
            categoryName TEXT NOT NULL
        ); """
    )

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

    for string in createStrings:
        cursor.execute(string)


def insertData():
    cursor.execute("INSERT INTO Cuisine VALUES (0, 'Indian')") 
    cursor.execute("INSERT INTO Recipes VALUES (0, 'Butter Chicken', 'Its yummy chicken', 15, 0)")
    cursor.execute("INSERT INTO IngredientCategories (categoryID, categoryName) VALUES (0, 'meat')")
    cursor.execute("INSERT INTO IngredientCategories (categoryID, categoryName) VALUES (1, 'veges')")

    cursor.execute("INSERT INTO RecipeSteps VALUES (0, 0, 'Step1')")
    cursor.execute("INSERT INTO RecipeSteps VALUES (0, 1, 'Step2')")

    cursor.execute("INSERT INTO Ingredients VALUES (0, 0, 0, 'Bread', '1', 'slice', '1')")
    cursor.execute("INSERT INTO Ingredients VALUES (0, 0, 1, 'Toast', '1', 'slice', '1')")
    cursor.execute("INSERT INTO Ingredients VALUES (1, 1, 0, 'Egg', '100g', 'boiled', '0')")

def commitDB():
    connection.commit()
    connection.close()


def queryRecipe():
    cursor.execute("SELECT ")

def printAll():
    results = []
    cursor.execute("SELECT recipeName FROM Recipes")
    results.append(cursor.fetchall())
    cursor.execute("SELECT ingName FROM Ingredients")
    results.append(cursor.fetchall())

    for row in results:
        print(row)


createTables()
insertData()
printAll()
commitDB()


    


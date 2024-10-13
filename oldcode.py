
#FOR OLD JSON FILES
@app.post("/test_data", response_model=str)
def create_test_data(db: Session = Depends(get_db)):

    #Opens the file
    f = open('testData.json')

    #returns as dictionary
    data = json.load(f)
    #print(data)

    ings = [] #pass this thru to steps
    #iterating through the json.

    #Make the cuisines
    for i in data["cuisines"]:
        #print(i)
        create_cuisine_from_dict(i, db = db)

    #Make the recipes
    for i in data["recipes"]:
        recipe = create_recipe_from_dict(i, db = db)

        # # #make the ingredients for the newly created recipe
        for i in data["ingredients"]:
            #Only include the ingredients that are related to current recipe
            if(i["recipe"] == recipe.name):
                ings.append(create_ingredient_from_dict(i, recipe.id, db = db))

        # #make the steps
        for i in data["steps"]:
            if(i["recipe"] == recipe.name):
                create_step_from_dict(i, recipe.id, db=db)

    # #make the categories
    for i in data["categories"]:
        create_category_from_dict(i, db=db)

    f.close()
    #print(data)
    #create_recipe_from_dict(recipe_data = recipes, db=db)
    return "Data successfully created from JSON"


#BECOMING USELESS
def create_recipe_from_dict(recipe_data: dict, db: Session = Depends(get_db)):
    print(recipe_data)
    db_recipe = models.Recipe(
        name = recipe_data.get("name"), 
        desc = recipe_data.get("desc"), 
        cook_time = recipe_data.get("cook_time"), 
        source = recipe_data.get("source"), 
        cuisine_id = crud.get_cuisine_id_by_name(db, cuisine_name = recipe_data.get("cuisine")))
    db.add(db_recipe)
    db.commit()
    db.refresh(db_recipe)
    #db_recipe = crud.create_recipe(db=db, recipe=recipe)
    return db_recipe

#BECOMING USELESS
def create_cuisine_from_dict(cuisine: dict, db: Session = Depends(get_db)): 
    db_cuisine = crud.create_cuisine(db, cuisine_name = cuisine["name"])
    #db_recipe = crud.create_recipe(db=db, recipe=recipe)
    return db_cuisine



#BECOMING USELESS
def create_ingredient_from_dict(ing_data: dict, recipe_id: int, db: Session = Depends(get_db)):
    db_ing = crud.create_ing_from_dict(db, ing_data = ing_data, recipe_id = recipe_id, step_id = 1)
    if db_ing is None:
        raise HTTPException(status_code=404, detail="Ingredient creation failed")
    return db_ing


#BECOMING USELESS
def create_step_from_dict(step: dict, recipe_id: int, db: Session = Depends(get_db)):
    db_step = crud.create_step(db, step_desc = step["desc"], attached_recipe = recipe_id)

    #Get the ingredients of the recipe involved
    ings_in_recipe = crud.get_ingredients_by_recipe_id(recipe_id, db=db)

    print("....................")
    for i in ings_in_recipe:
        print(i.name)
    print("....................")

    print("Before the loop")
    print(step)

    #for each ingredient in the step, assign the ingredient DB id to the step via relationship
    for containedIng in step["contained_ingredients"]:
        print("------------")
        print(containedIng)
        for ing in ings_in_recipe:
        
            print("Looping")
            print(ing.name)
            print(ing.quantity)
            if containedIng["name"] == ing.name and containedIng["quantity"] == ing.quantity: 
                print(f"{ing.name} from recipe id {ing.recipe_id} is being appended to step {db_step.id}")
                db_step.ingredients.append(ing)
                print("god help me")
    
    print("End")

    for i in db_step.ingredients:
        print(f'I contain {i.name}')

    db.commit()
    db.refresh(db_step)
    #db_step.refresh(db_step)
    return db_step


#BECOMING USLESS
def create_category_from_dict(category: dict, db: Session = Depends(get_db)):
    print(category)
    db_category = crud.create_category(db, category_name = category["name"])
    if db_category is None:
        raise HTTPException(status_code=404, detail="Category creation has failed")
    return db_category
# from website import createApp

# app = createApp()

# if __name__ == '__main__': #only run server if running file directly?
#     app.run(debug=True) 
#     print("running")

from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def root():
    return {"message": "Hello World"}\
    
@app.get("/test/{gg}")
def get_test(gg: int):
    if gg > 5:
        return {"message": "sup ganstas"}
    else:
        return {"message": "u smol"}
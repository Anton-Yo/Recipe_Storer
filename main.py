# from website import createApp

# app = createApp()

# if __name__ == '__main__': #only run server if running file directly?
#     app.run(debug=True) 
#     print("running")

from fastapi import FastAPI

app = FastAPI()

@app.get("/")
async def root():
    return {"message": "Hellow World"}
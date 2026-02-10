from fastapi import FastAPI
from fastapi.testclient import TestClient

app = FastAPI()

@app.get("/")
def read_root():
    return {"Hello": "World"}

client = TestClient(app)
response = client.get("/")
print(f"Status: {response.status_code}")
print(f"Body: {response.text}")

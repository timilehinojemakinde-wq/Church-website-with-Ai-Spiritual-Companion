from fastapi import FastAPI
from pydantic import BaseModel
from rag_engine import retrieve_relevant_scriptures

app = FastAPI()

class Query(BaseModel):
    question: str

@app.post("/ask")
def ask_ai(query: Query):
    #Retrieve top 3 relevant scriptures based on the question
    results = retrieve_relevant_scriptures(query.question, top_k=3)

    # Format response
    response = []
    for r in results:
        response.append(f"{r['book']} {r['chapter']}:{r['verse']} - {r['text']} (Score: {r['similarity_score']})")
    return {"answer": response}
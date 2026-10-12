from fastapi import FastAPI, UploadFile, File
from pydantic import BaseModel
import os

from utils.pdf_loader import load_single_pdf
from utils.vector_store import add_to_vectorstore, load_vectorstore
from utils.rag_chain import build_chain


app = FastAPI()
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)


# ---------------------------
# HOME
# ---------------------------
@app.get("/")
def home():
    return {"message": "RAG AI Backend Running"}


# ---------------------------
# UPLOAD PDF
# ---------------------------
@app.post("/upload")
async def upload_pdf(file: UploadFile = File(...)):

    file_path = os.path.join(UPLOAD_DIR, file.filename)

    with open(file_path, "wb") as f:
        f.write(await file.read())

    # extract text from THIS file
    docs = load_single_pdf(file_path)

    # store in FAISS
    add_to_vectorstore(docs)

    return {
        "message": f"{file.filename} uploaded successfully"
    }


# ---------------------------
# ASK QUESTION
# ---------------------------
class QuestionRequest(BaseModel):
    question: str


@app.post("/ask")
def ask_question(request: QuestionRequest):

    vectorstore = load_vectorstore()

    chain = build_chain(vectorstore)

    answer = chain.invoke(request.question)

    return {
        "question": request.question,
        "answer": answer
    }
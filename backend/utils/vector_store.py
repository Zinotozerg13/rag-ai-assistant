from langchain_huggingface import HuggingFaceEmbeddings
from langchain_community.vectorstores import FAISS
from langchain_text_splitters import RecursiveCharacterTextSplitter
import os

splitter = RecursiveCharacterTextSplitter(
    chunk_size=500,
    chunk_overlap=100
)

DB_PATH = "faiss_index"
INDEX_NAME = "index"

def get_embeddings():
    return HuggingFaceEmbeddings(
        model_name="sentence-transformers/all-MiniLM-L6-v2"
    )

def add_to_vectorstore(documents):
    embeddings = get_embeddings()
    chunks = splitter.split_documents(documents)

    index_file = os.path.join(DB_PATH, f"{INDEX_NAME}.faiss")

    # 🔥 FIRST TIME (no index exists)
    if not os.path.exists(index_file):
        db = FAISS.from_documents(chunks, embeddings)
        db.save_local(DB_PATH, INDEX_NAME)
        return db

    # 🔥 INDEX EXISTS (normal flow)
    db = FAISS.load_local(
        DB_PATH,
        embeddings,
        index_name=INDEX_NAME,
        allow_dangerous_deserialization=True
    )

    db.add_documents(chunks)
    db.save_local(DB_PATH, INDEX_NAME)
    return db

def load_vectorstore():
    embeddings = get_embeddings()

    index_file = os.path.join(DB_PATH, f"{INDEX_NAME}.faiss")
    if not os.path.exists(index_file):
        return None  # or raise error / return empty DB

    db = FAISS.load_local(
        DB_PATH,
        embeddings,
        index_name=INDEX_NAME,
        allow_dangerous_deserialization=True
    )
    return db
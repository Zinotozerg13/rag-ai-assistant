from langchain_groq import ChatGroq

from langchain_core.prompts import ChatPromptTemplate
from langchain_core.runnables import RunnablePassthrough
from langchain_core.output_parsers import StrOutputParser

from dotenv import load_dotenv
import os


# load environment variables
load_dotenv()

GROQ_API_KEY = os.getenv("GROQ_API_KEY")


def build_chain(vectorstore):

    # LLM
    llm = ChatGroq(
        model="llama-3.3-70b-versatile",
        api_key=GROQ_API_KEY
    )

    # retriever from FAISS
    retriever = vectorstore.as_retriever(
        search_kwargs={"k": 4}
    )

    # prompt
    prompt = ChatPromptTemplate.from_template(
        """
        Answer the question based on the context below.

        Context:
        {context}

        Question:
        {question}
        """
    )

    # RAG chain
    chain = (
        {
            "context": retriever,
            "question": RunnablePassthrough()
        }
        | prompt
        | llm
        | StrOutputParser()
    )

    return chain
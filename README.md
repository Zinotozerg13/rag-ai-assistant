# RAG AI Assistant

An AI-powered question-answering application built using **Retrieval-Augmented Generation (RAG)**. The system retrieves relevant information from a document collection and uses a large language model to generate contextual answers to user questions.

## Overview

RAG AI Assistant combines document retrieval with generative AI to provide answers grounded in relevant source material. Instead of relying only on the language model's pre-trained knowledge, it retrieves relevant document chunks and passes them to the model as context.

## Features

* **AI-Powered Question Answering:** Ask questions in natural language.
* **Document Retrieval:** Retrieve relevant information from a document collection.
* **Context-Aware Responses:** Generate answers using retrieved document context.
* **Source References:** Display source documents and page information where available.
* **Groq Integration:** Use Groq-hosted language models for response generation.
* **Interactive Frontend:** A dedicated frontend for interacting with the assistant.

## Tech Stack

### Artificial Intelligence & Backend

* Python
* LangChain
* Groq API
* Retrieval-Augmented Generation (RAG)
* Vector Store and Semantic Retrieval

### Frontend

* React
* TypeScript
* Vite

## Project Structure

```text
rag-ai-assistant/
├── backend/
│   ├── app.ipynb
│   └── .env.example
├── frontend/
├── lumina/
├── .gitignore
└── README.md
```

*Note: Update this structure if your actual folders or files differ.*

## How It Works

1. **Document Processing:** Documents are prepared for retrieval.
2. **Text Retrieval:** The retriever searches for relevant document chunks based on the user's question.
3. **Context Preparation:** The retrieved information is added to a prompt.
4. **Answer Generation:** A language model generates an answer using the supplied context.
5. **Source Display:** Relevant source information can be displayed to help users identify where the answer came from.

## Getting Started

### Prerequisites

Install the following before running the project:

* Python 3.10 or a compatible version supported by your dependencies
* Node.js and npm
* A Groq API key
* Git

### 1. Clone the Repository

```bash
git clone https://github.com/Zinotozerg13/rag-ai-assistant.git
cd rag-ai-assistant
```

### 2. Configure the Backend

Create and activate a Python virtual environment:

**Windows PowerShell**

```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
```

Install the required Python packages:

```powershell
pip install langchain-groq python-dotenv
```

Install any additional dependencies required by your application. If the project has a `requirements.txt` file, use:

```powershell
pip install -r requirements.txt
```

Create a `.env` file inside the `backend` directory:

```text
GROQ_API_KEY=your_groq_api_key_here
```

Replace the placeholder with your own Groq API key. Never commit your `.env` file or expose your API key publicly.

### 3. Run the Backend Notebook

If you're using Jupyter Notebook, install Jupyter if needed:

```powershell
pip install notebook
jupyter notebook
```

Open `app.ipynb` and execute the notebook cells in order.

### 4. Run the Frontend

Open another terminal and navigate to the frontend directory:

```powershell
cd frontend/lumina
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open the local URL printed in the terminal, usually:

```text
http://localhost:5173
```

*The frontend and backend may require additional configuration to communicate with each other.*

## Environment Variables

| Variable       | Description                                        |
| -------------- | -------------------------------------------------- |
| `GROQ_API_KEY` | API key used to access Groq-hosted language models |

Create your own `.env` file locally. The repository should contain only an `.env.example` file with placeholder values, never real credentials.

## Secur

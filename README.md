# 📚 RAG PDF Question Answering System

A **Retrieval-Augmented Generation (RAG)** application that allows users to upload a PDF document and interact with it using natural language.

The system processes the uploaded document, converts its content into searchable vector embeddings, retrieves the most relevant information for a user's question, and uses an LLM to generate an answer based on the retrieved context.

## 🚀 Overview

Traditional LLMs cannot automatically access the private information contained inside a user's documents.

This project solves that problem using **Retrieval-Augmented Generation (RAG)**.

### How it works

```text
PDF Upload
    ↓
Document Loading
    ↓
Text Extraction
    ↓
Text Chunking
    ↓
Embedding Generation
    ↓
Vector Store
    ↓
User Question
    ↓
Query Embedding
    ↓
Similarity Search / Retrieval
    ↓
Relevant Context
    ↓
LLM
    ↓
Generated Answer
```

The overall architecture follows the RAG pipeline of loading documents, splitting them into chunks, generating embeddings, storing them in a vector database, retrieving relevant chunks, and providing that context to an LLM.

---

## ✨ Features

- 📄 Upload PDF documents
- 🔍 Extract text from uploaded documents
- ✂️ Split large documents into smaller chunks
- 🧠 Generate vector embeddings
- 🗃️ Store embeddings in a vector store
- 🔎 Semantic similarity search
- 🤖 Retrieve relevant document chunks
- 💬 Ask questions about uploaded documents
- 📖 Generate context-aware answers using an LLM
- 🧩 Supports different retrieval strategies
- ⚡ Reduces the need to manually search through large documents

The project is designed around the idea of allowing users to "chat with their study materials" and receive answers from their own documents.

---

## 🏗️ Architecture

```text
                         ┌──────────────────┐
                         │    PDF Upload    │
                         └────────┬─────────┘
                                  │
                                  ▼
                         ┌──────────────────┐
                         │ Document Loader  │
                         └────────┬─────────┘
                                  │
                                  ▼
                         ┌──────────────────┐
                         │  Text Splitter   │
                         └────────┬─────────┘
                                  │
                                  ▼
                         ┌──────────────────┐
                         │    Embeddings    │
                         └────────┬─────────┘
                                  │
                                  ▼
                         ┌──────────────────┐
                         │   Vector Store   │
                         └────────┬─────────┘
                                  │
                    ┌─────────────┘
                    │
                    ▼
             ┌───────────────┐
             │ User Question │
             └───────┬───────┘
                     │
                     ▼
             ┌───────────────┐
             │ Query Embedding│
             └───────┬───────┘
                     │
                     ▼
             ┌───────────────┐
             │   Retriever   │
             └───────┬───────┘
                     │
                     ▼
             ┌───────────────┐
             │Relevant Chunks│
             └───────┬───────┘
                     │
                     ▼
             ┌───────────────┐
             │      LLM      │
             └───────┬───────┘
                     │
                     ▼
             ┌───────────────┐
             │     Answer    │
             └───────────────┘
```

---

## 🧠 RAG Pipeline

### 1. Document Loading

The uploaded PDF is loaded and converted into document objects that can be processed by the application.

```text
PDF → Document Loader → Documents
```

The document-loading stage converts raw files into processable document objects.

### 2. Text Chunking

Large documents are divided into smaller chunks.

```text
Document
   ↓
Chunk 1
Chunk 2
Chunk 3
...
Chunk N
```

Chunking helps improve retrieval because the system can retrieve focused pieces of information instead of processing an entire document at once.

The project explores different approaches:

- Character-based splitting
- Token-based splitting
- Semantic / meaning-based splitting

### 3. Embedding Generation

Each chunk is converted into a numerical vector using an embedding model.

```text
"Gradient Descent Optimization"
              ↓
       Embedding Model
              ↓
[0.23, -0.81, 0.44, ...]
```

Embeddings represent the semantic meaning of the text and allow the system to perform similarity-based retrieval.

### 4. Vector Store

The generated embeddings are stored in a vector database/vector store along with the associated text and metadata.

```text
PDF
 ↓
Chunks
 ↓
Embeddings
 ↓
Vector Store
```

Vector stores are designed for efficient similarity search over embeddings. The project material discusses approaches such as **HNSW, IVF and PQ**, as well as vector stores such as **Chroma, FAISS and Annoy**.

### 5. Query Embedding

When the user asks a question, the question is also converted into an embedding.

```text
User Question
      ↓
Embedding Model
      ↓
Query Vector
```

### 6. Retrieval

The query vector is compared against stored document vectors to find the most relevant chunks.

```text
Query
  ↓
Retriever
  ↓
Vector Store
  ↓
Top-K Relevant Chunks
```

A retriever selects the most relevant documents or chunks from the knowledge base.

### 7. Context Augmentation

The retrieved chunks are combined with the user's question to create the context supplied to the LLM.

```text
Retrieved Context
        +
User Question
        ↓
      Prompt
```

### 8. Answer Generation

Finally, the LLM uses the retrieved context to generate the answer.

```text
Context + Question
        ↓
       LLM
        ↓
     Answer
```

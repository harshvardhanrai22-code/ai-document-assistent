from langchain_huggingface import HuggingFaceEmbeddings
from text_splitter import text_chunks

embeddings = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")

chunks = text_chunks(size=1000, lap=200)
raw_chunks = []

for i in range(len(chunks)):
    raw_chunks.append(chunks[i].page_content)

vector = embeddings.embed_documents(raw_chunks)

print(f"Number of embeddings: {len(vector)}")
print("-----------------------")
print(f"Dimension of vector: {len(vector[0])}")
from doc_loader import pdf_loader
from langchain_text_splitters import RecursiveCharacterTextSplitter

def text_chunks(size, lap):
    file_path = "./data/deeplearning.pdf"
    pages = pdf_loader(filePath=file_path)

    splitter = RecursiveCharacterTextSplitter(
        chunk_size = size,
        chunk_overlap = lap
    )

    chunks = splitter.split_documents(pages)
    return chunks

# print(f"Number of Pages: {len(pages)}")
# print(f"Number of chunks: {len(chunks)}")

# print(f"First chunks content: \n{chunks[0].page_content}")
# print(f"Second chunks content: \n{chunks[1].page_content}")
# print("---------------------------------------------------")
# print(f"First chunks content: \n{chunks[0].metadata}")
# print(f"Second chunks content: \n{chunks[1].metadata}")

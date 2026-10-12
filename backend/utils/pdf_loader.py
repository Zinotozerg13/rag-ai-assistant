import fitz
from langchain_core.documents import Document


def load_single_pdf(pdf_path):

    doc = fitz.open(pdf_path)

    documents = []

    for page_num, page in enumerate(doc):

        text = page.get_text()

        if text.strip():

            documents.append(
                Document(
                    page_content=text,
                    metadata={
                        "source": pdf_path,
                        "page": page_num + 1
                    }
                )
            )

    doc.close()

    return documents
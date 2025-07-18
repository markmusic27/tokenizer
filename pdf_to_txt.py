import sys
from PyPDF2 import PdfReader

def pdf_to_text(pdf_path, txt_path):
    reader = PdfReader(pdf_path)
    with open(txt_path, 'w', encoding='utf-8') as f:
        for page_num, page in enumerate(reader.pages):
            text = page.extract_text()
            if text:
                f.write(text)
                f.write("\n\n")  # Add spacing between pages
            else:
                print(f"Warning: Page {page_num + 1} had no extractable text.")

if __name__ == "__main__":
    if len(sys.argv) != 3:
        print("Usage: python pdf_to_txt.py input.pdf output.txt")
    else:
        pdf_to_text(sys.argv[1], sys.argv[2])

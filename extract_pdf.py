import PyPDF2

with open(r'c:\Users\Admin\Downloads\slide\main.pdf', 'rb') as f:
    reader = PyPDF2.PdfReader(f)
    total = len(reader.pages)
    all_text = []
    for i in range(total):
        text = reader.pages[i].extract_text()
        all_text.append(f'\n--- PAGE {i+1} ---\n{text}')
    
    full = '\n'.join(all_text)
    with open(r'c:\Users\Admin\Downloads\slide\extracted_text.txt', 'w', encoding='utf-8') as out:
        out.write(full)
    print(f'Extracted {total} pages, {len(full)} characters')

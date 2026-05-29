import re
import os

base = r"c:\Users\Sivanesh\OneDrive - ELCOT\folder\Gift_Shop\gifthaven"

def process_file(path, is_prod=False, is_cat=False, is_home=False):
    fullpath = os.path.join(base, path)
    with open(fullpath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    if is_prod or is_cat:
        def repl(m):
            bef = content[max(0, m.start() - 500):m.start()]
            name_match = re.search(r"name:\s*['\"](.*?)['\"]", bef)
            kw = name_match.group(1) if name_match else "gift"
            kw = re.sub(r'[^a-zA-Z0-9 ]', '', kw).lower().strip()
            return f"image: '{kw}'"
            
        content = re.sub(r"image:\s*['\"]https://[^'\"]*['\"]", repl, content)
        
        def repl2(m):
            bef = content[max(0, m.start() - 500):m.start()]
            name_match = re.search(r"name:\s*['\"](.*?)['\"]", bef)
            kw = name_match.group(1) if name_match else "gift"
            kw = re.sub(r'[^a-zA-Z0-9 ]', '', kw).lower().strip()
            return f"images: ['{kw}']"
            
        content = re.sub(r"images:\s*\[\s*['\"]https://[^'\]]*['\"]\s*\]", repl2, content)
    
    if is_home:
        def repl3(m):
            bef = content[max(0, m.start() - 300):m.start()]
            name_match = re.search(r"name:\s*['\"](.*?)['\"]", bef)
            kw = name_match.group(1).split(' ')[0].lower() if name_match else "person"
            return f"photo: '{kw}'"
        content = re.sub(r"photo:\s*[\"']https://[^\"']*[\"']", repl3, content)
        content = re.sub(r"src=[\"']https://images\.unsplash[^\"']*[\"']", 'src="gifts wrapped"', content)
        
    with open(fullpath, 'w', encoding='utf-8') as f:
        f.write(content)

try:
    process_file('src/data/products.js', is_prod=True)
    process_file('src/data/categories.js', is_cat=True)
    process_file('src/pages/Home.jsx', is_home=True)
    print("DONE SCRIPT")
except Exception as e:
    print("ERROR:", e)

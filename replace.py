import os

root_dir = r"c:\Users\Sivanesh\OneDrive - ELCOT\folder\Gift_Shop\gifthaven"

for dirpath, dirnames, filenames in os.walk(root_dir):
    if 'node_modules' in dirnames:
        dirnames.remove('node_modules')
    if '.git' in dirnames:
        dirnames.remove('.git')
        
    for file in filenames:
        if file.endswith(('.js', '.jsx', '.css', '.html')):
            path = os.path.join(dirpath, file)
            with open(path, 'r', encoding='utf-8') as f:
                try:
                    content = f.read()
                except UnicodeDecodeError:
                    continue
            
            new_content = content
            
            # Text Replacements
            new_content = new_content.replace('Blessy Gift Shop', 'TRESOR GIFTS')
            new_content = new_content.replace('Lights & Gifts', 'TRESOR GIFTS')
            new_content = new_content.replace('ClassyPik Gifts', 'TRESOR GIFTS')
            new_content = new_content.replace('Green Roots', 'TRESOR GIFTS')
            new_content = new_content.replace('lightsandgifts', 'tresorgifts')
            new_content = new_content.replace('blessygiftshop@gmail.com', 'info@tresorgifts.in')
            
            # CSS classes Replacements
            new_content = new_content.replace('bg-rose-500', 'bg-red-600')
            new_content = new_content.replace('bg-rose-600', 'bg-red-700')
            new_content = new_content.replace('text-rose-500', 'text-red-600')
            new_content = new_content.replace('text-rose-600', 'text-red-700')
            new_content = new_content.replace('border-rose-500', 'border-red-600')
            new_content = new_content.replace('bg-rose-50', 'bg-red-50')
            new_content = new_content.replace('bg-rose-100', 'bg-red-100')
            new_content = new_content.replace('text-rose-400', 'text-red-500')
            new_content = new_content.replace('from-rose-500', 'from-red-600')
            new_content = new_content.replace('to-pink-600', 'to-red-800')
            new_content = new_content.replace('hover:text-rose-400', 'hover:text-red-500')
            
            if new_content != content:
                with open(path, 'w', encoding='utf-8') as f:
                    f.write(new_content)
                print(f"Updated {path}")

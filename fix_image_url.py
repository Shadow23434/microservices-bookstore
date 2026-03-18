import os

path = 'api-gateway/api_gateway/templates/books.html'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace('imageUrl', 'image')

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)

print('Done replacing imageUrl with image in books.html')

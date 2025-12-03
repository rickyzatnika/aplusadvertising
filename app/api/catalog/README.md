API: /api/catalog

GET /api/catalog
- Query params: q, category, available=true|false
- Response: { success, products }

POST /api/catalog
- Required fields: title, desc (min 6) or description (min 6), content (min 6), date (valid ISO), place (string), category (string), price (>= 0)
- Optional fields: slug (auto if omitted; if provided must be lowercase kebab-case, min 3), currency (default IDR), imageUrl (string), images[] (array), available, metadata

{
  "title": "Neon Box Custom",
  "slug": "neon-box-custom",
  "desc": "Ringkasan singkat produk minimal 6 karakter",
  "content": "Deskripsi lengkap/markdown minimal 6 karakter",
  "date": "2025-01-15",
  "place": "Jakarta",
  "price": 250000,
  "currency": "IDR",
  "category": "signage",
  "tags": ["neon", "box", "custom"],
  "imageUrl": "/under.png",
  "images": ["/under.png"],
  "available": true
}
- Response: { success, product }

GET /api/catalog/[id]
- Response: { success, product }

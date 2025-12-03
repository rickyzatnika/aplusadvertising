API: /api/upload

POST /api/upload (multipart/form-data)
- Fields:
  - files: file[] (multi) or file: file (single)
  - folder: string (optional, overrides CLOUDINARY_FOLDER)
- Behavior:
  - If CLOUDINARY_UPLOAD_PRESET is set, uses unsigned upload
  - Else, uses signed upload with CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET
- Response:
  - 201 if all succeed; 207 if partial; 400 if none succeed
  - { success, uploaded: [{ public_id, secure_url, width, height, bytes, format, folder }], failed: [{ error }] }

Example (curl):

curl -X POST http://localhost:3000/api/upload \
  -H "Content-Type: multipart/form-data" \
  -F "files=@/path/to/img1.jpg" \
  -F "files=@/path/to/img2.png" \
  -F "folder=products/neon"

Integrasi dengan katalog
- Setelah upload, kirim hasil secure_url ke endpoint POST /api/catalog sebagai images[] atau imageUrl.
- Contoh payload katalog:
{
  "title": "Neon Box Custom",
  "desc": "Ringkasan minimal 6 char",
  "content": "Deskripsi lengkap minimal 6 char",
  "date": "2025-01-15",
  "place": "Jakarta",
  "category": "signage",
  "price": 250000,
  "images": ["https://res.cloudinary.com/<cloud>/image/upload/v.../img1.jpg", "https://res.cloudinary.com/<cloud>/image/upload/v.../img2.jpg"]
}

Aplus Advertising (JSX + MongoDB)

Stack changes applied:
- JavaScript + JSX (no TypeScript)
- Native MongoDB driver (no Prisma, no Zod)

Getting started
1) Install deps
   npm install

2) Configure environment
   Create a .env file with:
   MONGODB_URI=mongodb+srv://<user>:<pass>@<cluster>/<db>?retryWrites=true&w=majority
   # Optional DB name (default: appdb)
   MONGODB_DB=aplus

3) Run
   npm run dev
   Open http://localhost:3000

API
- POST /api/contact
  body: { name: string, email: string, message: string }
  returns: { success: boolean, contact?, error? }

Notes
- Path alias @/* is configured via jsconfig.json
- All pages/components are plain JSX/JS now
- Remove or adjust any unused packages in package.json if present (e.g., @prisma/client, zod)

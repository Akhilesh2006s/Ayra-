# Ayra-

AYRA Associates: interior & exterior design studio, Hyderabad. Principal architect: Chakilam Saketh Bharadwaj.

- AYRA home (React + TypeScript): `ayra.html` and `src/ayra/` (edit text, photos and projects in `src/ayra/data.ts`)
- Project 49 app: `index.html` and `src/` (served at `/project-49/` after build)
- Photos: `public/ayra/img/`

Run locally: `npm install` then `npm run dev`, open http://localhost:5173/ayra.html
Build: `npm run build` (Vercel runs `vite build && node tools/swap-ayra.mjs`, which puts AYRA at `/` and Project 49 at `/project-49/`).

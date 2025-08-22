# OtakuOasis — Frontend
**Author:** Calvin Whyte (2025)

This is the frontend for OtakuOasis (simple static site or React site).

## Local dev
- If static HTML/JS: open `index.html` in a browser.
- If Vite/React: `npm install` → `npm run dev`

## Deploy to Render (Static Site)
1. Create a **Static Site** on Render and connect this repo.
2. Build command (if using Vite/React): `npm install && npm run build`
3. Publish directory:
   - Vite → `dist`
   - CRA → `build`
   - Static HTML → no publish dir needed (Render will serve root files)
4. Set environment variable `VITE_API_BASE` (or edit config) to your backend URL:

# 🍴 Forkful — Recipe Catalog

**Forkful** is a modern, responsive recipe catalog web app with a large built-in recipe collection, powerful ingredient-based search, a smart pantry matcher, and a hands-free step-by-step cooking mode with timers — designed to take you from "what's for dinner?" to plating up with confidence.

Built with **React 19**, **TypeScript**, **Vite**, **Tailwind CSS**, and **shadcn/ui**.

**Built by Girish Lade** — https://ladestack.in

---

## ✨ Features

### 📖 Recipe Catalog
- **65+ curated recipes** across 8 categories: Breakfast, Poultry, Beef & Pork, Seafood, Pasta & Rice, Vegetarian, Soups & Salads, Desserts & Baking
- Full-text search across titles, descriptions, cuisines, tags, and ingredients
- Filter by **category**, **cuisine**, **difficulty**, and **total time** (slider)
- Sort by **rating**, **total time**, or **name**
- URL-synced search state (`/recipes?q=…`) so results are shareable
- Paginated grid (12 recipes per page) with responsive recipe cards

### 🧊 Pantry — "What's in your kitchen?"
- Add ingredients you already have, with autocomplete suggestions from a pantry index of every ingredient in the catalog
- Recipes are scored by **match percentage** so you instantly see what you can cook right now
- Missing-ingredient list per recipe for quick shopping-list prep

### 👨‍🍳 Cook Mode
- Hands-free step-by-step cooking view with large type and per-step timers
- Progress bar through the recipe

### ⭐ Extras
- Save favorites (persisted in `localStorage`)
- Recipe detail pages with ingredients, steps, nutrition estimates, and ratings
- Dark/light theme toggle
- Fully responsive, mobile-first layout

---

## 🛠 Tech Stack

- **Framework:** React 19 + TypeScript
- **Bundler:** Vite 7
- **Styling:** Tailwind CSS 3 + shadcn/ui + Radix primitives
- **Routing:** react-router 7
- **Forms:** react-hook-form + zod
- **Charts/UI extras:** recharts, embla-carousel, sonner toasts

---

## 🚀 Quick Start

```bash
# Install dependencies
npm install --legacy-peer-deps

# Start the dev server (http://localhost:3000)
npm run dev

# Type-check + build a static production bundle into dist/
npm run build

# Preview the production build locally
npm run preview
```

## 📁 Project Structure

```
forkful/
├── index.html               # App shell (root mount, fonts, meta)
├── src/
│   ├── main.tsx             # Entry point + router setup
│   ├── App.tsx              # Routes and layout
│   ├── pages/               # Home, Catalog, RecipeDetail, Pantry, CookMode, Favorites
│   ├── components/          # Navbar, RecipeCard, feature components
│   ├── components/ui/       # shadcn/ui primitives
│   ├── data/                # Recipe dataset
│   └── lib/                 # Utilities (cn, pantry matching, etc.)
├── public/                  # Static assets
└── dist/                    # Production build output (generated)
```

## ⚙️ Environment Variables

None — the app is fully client-side with a bundled recipe dataset. No API keys or backend services required.

## 🌐 Deploy

This is a static single-page app (`npm run build` → `dist/`). It deploys to any static host:

- **GitHub Pages:** build output is committed to the repo root; Pages is enabled on the default branch.
- **Any static host (Cloudflare Pages, Netlify, Vercel):** upload `dist/` as the publish directory.

> Note: the app uses `BrowserRouter`; deep-link refresh on some static hosts may need an SPA fallback (`404.html` → `index.html`).

## 📄 License

Open-source. Add a `LICENSE` file if you plan to distribute it under a specific license (MIT, Apache-2.0, etc.).

---

Built by [Girish Lade](https://ladestack.in)

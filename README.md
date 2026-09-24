# 🍴 Forkful — Recipe Catalog

**Forkful** is a modern, responsive recipe catalog web app with a huge built-in collection of recipes, powerful ingredient-based search, a smart pantry matcher, and a hands-free **step-by-step cooking mode** with timers — designed to take you from “what’s for dinner?” to plating up with confidence.

Built with **React 19**, **TypeScript**, **Vite**, **Tailwind CSS**, and **shadcn/ui**.

---

## ✨ Features

### 📖 Recipe Catalog
- **65+ curated recipes** across 8 categories: Breakfast, Poultry, Beef & Pork, Seafood, Pasta & Rice, Vegetarian, Soups & Salads, and Desserts & Baking
- Full-text search across titles, descriptions, cuisines, tags, and ingredients
- Filter by **category**, **cuisine**, **difficulty**, and **total time** (slider)
- Sort by **rating**, **total time**, or **name**
- URL-synced search state (`/recipes?q=…`) so results are shareable
- Paginated grid (12 recipes per page) with responsive recipe cards

### 🧊 Pantry — “What’s in your kitchen?”
- Add the ingredients you already have (with autocomplete suggestions from a pantry index of every ingredient in the catalog)
- Recipes are **ranked by match score** — how many ingredients you already have
- “Ready to cook” toggle to show only recipes you can make right now, no shopping required
- Ingredient **alias matching** (e.g. *green onion* ↔ *scallions*, *cilantro* ↔ *coriander*, *heavy cream* ↔ *double cream*)

### 👨‍🍳 Hands-Free Cook Mode
- Distraction-free, full-screen step-by-step view (`/recipe/:id/cook`) with the navbar and footer hidden
- One step at a time with large typography — easy to read from across the kitchen
- **Built-in step timer** with play / pause / reset and a progress bar, auto-suggested from the step’s cook time
- Mark steps as done, jump between steps, and track overall progress
- Scaled ingredient checklist for the current servings

### ⭐ Favorites
- Heart any recipe to save it
- Persisted in `localStorage` (`forkful:favorites`) — survives refreshes, no account needed

### 🏠 Home
- Hero search that jumps straight into the catalog
- Featured recipes (top-rated) and category quick-links
- Stats: recipe count, unique ingredients, timed steps

### 🎨 Design
- Warm, food-forward visual identity with the **Fraunces** display font
- Fully responsive (mobile → desktop), light theme with CSS variable design tokens
- Accessible, keyboard-friendly components powered by Radix UI primitives

---

## 🛠 Tech Stack

| Layer | Tools |
|---|---|
| Framework | React 19, TypeScript ~5.9 |
| Build tool | Vite 7 |
| Routing | React Router 7 |
| Styling | Tailwind CSS 3, CSS variables, tailwindcss-animate |
| UI components | shadcn/ui (New York style) on Radix UI + lucide-react icons |
| Forms & validation | React Hook Form + Zod |
| Misc | Recharts, Sonner (toasts), Embla Carousel, date-fns |
| Linting | ESLint 9 + typescript-eslint |

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** 18+ (20+ recommended)
- **npm** (or pnpm / yarn / bun)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/<your-username>/forkful.git
cd forkful

# 2. Install dependencies
npm install

# 3. Start the dev server (http://localhost:3000)
npm run dev
```

### Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start Vite dev server with HMR on port **3000** |
| `npm run build` | Type-check with `tsc -b` and produce a production build in `dist/` |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint across the project |

### Production Build

```bash
npm run build
npm run preview
```

---

## 📁 Project Structure

```
project/
├── public/
│   └── images/              # Recipe & category photography
├── src/
│   ├── components/
│   │   ├── Navbar.tsx       # Top navigation
│   │   ├── RecipeCard.tsx   # Reusable recipe card
│   │   └── ui/              # shadcn/ui primitives (button, dialog, …)
│   ├── data/
│   │   ├── recipes.ts       # Full recipe catalog (65+ recipes)
│   │   └── images.ts        # Image path helpers
│   ├── hooks/
│   │   ├── useFavorites.ts  # localStorage-backed favorites
│   │   └── use-mobile.ts    # Mobile breakpoint hook
│   ├── lib/
│   │   ├── recipe-utils.ts  # Search, pantry matching, time/qty formatting
│   │   └── utils.ts         # cn() class helper
│   ├── pages/
│   │   ├── Home.tsx         # Landing page
│   │   ├── Catalog.tsx      # Search / filter / sort / paginate
│   │   ├── Pantry.tsx       # Ingredient matcher
│   │   ├── RecipeDetail.tsx # Full recipe view
│   │   ├── CookMode.tsx     # Hands-free step-by-step cooking
│   │   └── Favorites.tsx    # Saved recipes
│   ├── types/
│   │   └── recipe.ts        # Recipe, Ingredient, Step, Category types
│   ├── App.tsx              # Route table
│   └── main.tsx             # App entry point
├── index.html
├── vite.config.ts           # Vite config (@/ path alias, port 3000)
├── tailwind.config.js
├── components.json          # shadcn/ui config
└── package.json
```

---

## 🗺 Routes

| Route | Page | Description |
|---|---|---|
| `/` | Home | Hero, search, featured recipes, categories |
| `/recipes` | Catalog | Full catalog with search, filters, sorting, pagination |
| `/pantry` | Pantry | Add your ingredients, get ranked recipe matches |
| `/favorites` | Favorites | Your saved recipes |
| `/recipe/:id` | Recipe Detail | Ingredients, steps, times, servings scaling |
| `/recipe/:id/cook` | Cook Mode | Full-screen step-by-step cooking with timers |
| `*` | Home | Fallback |

---

## 💾 Data & Persistence

- The recipe catalog is bundled statically in `src/data/recipes.ts` — no backend or API key required.
- Favorites persist in the browser via `localStorage` under the key `forkful:favorites`.
- Pantry selections are session-only (reset on reload).

---

## 🤝 Contributing

Contributions are welcome!

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m "Add amazing feature"`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

Please run `npm run lint` and `npm run build` before submitting.

---

## 📄 License

This project is open-source. Add a `LICENSE` file if you plan to distribute it under a specific license (MIT, Apache-2.0, etc.).

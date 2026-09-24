import type { Category } from '@/types/recipe'

/** Local food photography for every recipe (public/images/{id}.jpg). */
export function recipeImage(id: string): string {
  return `/images/${id}.jpg`
}

/** Representative photo for each category tile. */
export const CATEGORY_IMAGE: Record<Category, string> = {
  Breakfast: recipeImage('shakshuka'),
  Poultry: recipeImage('roast-chicken'),
  'Beef & Pork': recipeImage('steak-frites'),
  Seafood: recipeImage('seafood-paella'),
  'Pasta & Rice': recipeImage('lasagna'),
  Vegetarian: recipeImage('margherita-pizza'),
  'Soups & Salads': recipeImage('tomato-soup'),
  'Desserts & Baking': recipeImage('chocolate-chip-cookies'),
}

/** Photos used on the home hero collage. */
export const HERO_IMAGES = {
  main: recipeImage('lasagna'),
  top: recipeImage('seafood-paella'),
  bottom: recipeImage('chocolate-chip-cookies'),
  cta: recipeImage('roast-chicken'),
}

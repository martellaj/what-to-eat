export interface Meal {
  name: string;
  source: string;
  ingredients?: string[];
}

export const meals = [
  {
    name: "Marinara",
    source: "Our Cookbook",
    ingredients: ["Oil", "Garlic", "28oz can of crushed tomatoes", "Parsley"],
  },
  {
    name: "Fish and Chips",
    source: "No recipe needed",
    ingredients: ["Frozen fish filets", "Frozen french fries"],
  },
  {
    name: "Brats and Tots",
    source: "No recipe needed",
    ingredients: ["Brats", "Frozen tater tots"],
  },
  {
    name: "Kalua Pork",
    source:
      "https://www.allrecipes.com/recipe/24035/kalua-pig-in-a-slow-cooker/",
    ingredients: ["Pork shoulder", "Liquid smoke", "Hawaiian salt"],
  },
];

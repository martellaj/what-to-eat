export interface Meal {
  name: string;
  source: string;
  ingredients?: string[];
}

export const meals = [
  {
    name: "Marinara",
    source: "Our Cookbook",
  },
  {
    name: "Fish and Chips",
    source: "No recipe needed",
  },
  {
    name: "Brats and Tots",
    source: "No recipe needed",
  },
  {
    name: "Kalua Pork",
    source:
      "https://www.allrecipes.com/recipe/24035/kalua-pig-in-a-slow-cooker/",
  },
];

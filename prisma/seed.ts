import prisma from "@/lib/prisma";
import { Prisma } from "@/generated/prisma";

const categoryData: Prisma.IngredientCategoryCreateInput[] = [
  { name: "Frukt & Grönt" },
  { name: "Kött & Fågel" },
  { name: "Chark" },
  { name: "Fisk & Skaldjur" },
  { name: "Mejeri" }, // Ägg?
  { name: "Ost" },
  { name: "Vegetariskt" },
  { name: "Skafferi" },
  { name: "Bröd, Kex & Bageri" },
  { name: "Frysvaror" },
  { name: "Dryck" },
  { name: "Snacks & Godis" },
  { name: "Glass" },
  { name: "Färdigmat & Sallader" },
  { name: "Hälsa & Skönhet" },
  { name: "Barn" },
  { name: "Hem & Hushåll" },
  { name: "Fritid" },
  { name: "Övrigt" },
];

async function main() {
  await prisma.ingredientCategory.createMany({
    data: categoryData,
  });

  console.log("Seeding finished");
}

main();

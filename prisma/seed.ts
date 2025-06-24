import prisma from "@/lib/prisma";
import { Prisma } from "@/generated/prisma";
import { GeneratedIngredients } from "@/lib/schemas/ingredient-generation";

const categoryData: Prisma.IngredientCategoryCreateInput[] = [
  { name: "Frukt & Grönt" },
  { name: "Kött & Fågel" },
  { name: "Chark" },
  { name: "Fisk & Skaldjur" },
  { name: "Mejeri" },
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

const generatedIngredients: GeneratedIngredients = [
  {
    displayNamePlural: "Vetemjöl",
    displayNameSingular: "Vetemjöl",
    ingredientCategory: {
      name: "Skafferi",
    },
    name: "vetemjöl",
    shoppingUnit: "KG",
    aliases: ["vete mjöl", "vetemjol"],
  },
  {
    displayNamePlural: "Socker",
    displayNameSingular: "Socker",
    ingredientCategory: {
      name: "Skafferi",
    },
    name: "socker",
    shoppingUnit: "KG",
    aliases: [],
  },
  {
    displayNamePlural: "Salt",
    displayNameSingular: "Salt",
    ingredientCategory: {
      name: "Skafferi",
    },
    name: "salt",
    shoppingUnit: "G",
    aliases: [],
  },
  {
    displayNamePlural: "Ägg",
    displayNameSingular: "Ägg",
    ingredientCategory: {
      name: "Mejeri",
    },
    name: "ägg",
    shoppingUnit: "ST",
    aliases: [],
  },
  {
    displayNamePlural: "Mjölk",
    displayNameSingular: "Mjölk",
    ingredientCategory: {
      name: "Mejeri",
    },
    name: "mjölk",
    shoppingUnit: "L",
    aliases: [],
  },
  {
    displayNamePlural: "Smör",
    displayNameSingular: "Smör",
    ingredientCategory: {
      name: "Mejeri",
    },
    name: "smör",
    shoppingUnit: "G",
    aliases: [],
  },
  {
    displayNamePlural: "Potatisar",
    displayNameSingular: "Potatis",
    ingredientCategory: {
      name: "Frukt & Grönt",
    },
    name: "potatis",
    shoppingUnit: "KG",
    aliases: [],
  },
  {
    displayNamePlural: "Lökar",
    displayNameSingular: "Lök",
    ingredientCategory: {
      name: "Frukt & Grönt",
    },
    name: "lök",
    shoppingUnit: "ST",
    aliases: [],
  },
  {
    displayNamePlural: "Gula lökar",
    displayNameSingular: "Gul lök",
    ingredientCategory: {
      name: "Frukt & Grönt",
    },
    name: "gul lök",
    shoppingUnit: "ST",
    aliases: ["gullök"],
  },
  {
    displayNamePlural: "Morötter",
    displayNameSingular: "Morot",
    ingredientCategory: {
      name: "Frukt & Grönt",
    },
    name: "morot",
    shoppingUnit: "KG",
    aliases: [],
  },
  {
    displayNamePlural: "Vitlök",
    displayNameSingular: "Vitlök",
    ingredientCategory: {
      name: "Frukt & Grönt",
    },
    name: "vitlök",
    shoppingUnit: "KLYFTOR",
    aliases: [],
  },
  {
    displayNamePlural: "Rapsolja",
    displayNameSingular: "Rapsolja",
    ingredientCategory: {
      name: "Skafferi",
    },
    name: "rapsolja",
    shoppingUnit: "L",
    aliases: [],
  },
  {
    displayNamePlural: "Olivolja",
    displayNameSingular: "Olivolja",
    ingredientCategory: {
      name: "Skafferi",
    },
    name: "olivolja",
    shoppingUnit: "L",
    aliases: [],
  },
  {
    displayNamePlural: "Tomater",
    displayNameSingular: "Tomat",
    ingredientCategory: {
      name: "Frukt & Grönt",
    },
    name: "tomat",
    shoppingUnit: "KG",
    aliases: [],
  },
  {
    displayNamePlural: "Gurkor",
    displayNameSingular: "Gurka",
    ingredientCategory: {
      name: "Frukt & Grönt",
    },
    name: "gurka",
    shoppingUnit: "ST",
    aliases: [],
  },
  {
    displayNamePlural: "Paprikor",
    displayNameSingular: "Paprika",
    ingredientCategory: {
      name: "Frukt & Grönt",
    },
    name: "paprika",
    shoppingUnit: "ST",
    aliases: [],
  },
  {
    displayNamePlural: "Köttfärs",
    displayNameSingular: "Köttfärs",
    ingredientCategory: {
      name: "Kött & Fågel",
    },
    name: "köttfärs",
    shoppingUnit: "G",
    aliases: ["färs", "köttfars"],
  },
  {
    displayNamePlural: "Kycklingfiléer",
    displayNameSingular: "Kycklingfilé",
    ingredientCategory: {
      name: "Kött & Fågel",
    },
    name: "kycklingfilé",
    shoppingUnit: "G",
    aliases: ["kycklingfile"],
  },
  {
    displayNamePlural: "Laxfiléer",
    displayNameSingular: "Laxfilé",
    ingredientCategory: {
      name: "Fisk & Skaldjur",
    },
    name: "laxfilé",
    shoppingUnit: "G",
    aliases: ["laxfile"],
  },
  {
    displayNamePlural: "Grädde",
    displayNameSingular: "Grädde",
    ingredientCategory: {
      name: "Mejeri",
    },
    name: "grädde",
    shoppingUnit: "DL",
    aliases: [],
  },
  {
    displayNamePlural: "Filmjölk",
    displayNameSingular: "Filmjölk",
    ingredientCategory: {
      name: "Mejeri",
    },
    name: "filmjölk",
    shoppingUnit: "L",
    aliases: [],
  },
  {
    displayNamePlural: "Yoghurt",
    displayNameSingular: "Yoghurt",
    ingredientCategory: {
      name: "Mejeri",
    },
    name: "yoghurt",
    shoppingUnit: "G",
    aliases: ["yogurt"],
  },
  {
    displayNamePlural: "Ost",
    displayNameSingular: "Ost",
    ingredientCategory: {
      name: "Ost",
    },
    name: "ost",
    shoppingUnit: "G",
    aliases: [],
  },
  {
    displayNamePlural: "Bröd",
    displayNameSingular: "Bröd",
    ingredientCategory: {
      name: "Bröd, Kex & Bageri",
    },
    name: "bröd",
    shoppingUnit: "ST",
    aliases: [],
  },
  {
    displayNamePlural: "Pasta",
    displayNameSingular: "Pasta",
    ingredientCategory: {
      name: "Skafferi",
    },
    name: "pasta",
    shoppingUnit: "G",
    aliases: [],
  },
  {
    displayNamePlural: "Ris",
    displayNameSingular: "Ris",
    ingredientCategory: {
      name: "Skafferi",
    },
    name: "ris",
    shoppingUnit: "KG",
    aliases: [],
  },
  {
    displayNamePlural: "Havregryn",
    displayNameSingular: "Havregryn",
    ingredientCategory: {
      name: "Skafferi",
    },
    name: "havregryn",
    shoppingUnit: "KG",
    aliases: [],
  },
  {
    displayNamePlural: "Jäst",
    displayNameSingular: "Jäst",
    ingredientCategory: {
      name: "Skafferi",
    },
    name: "jäst",
    shoppingUnit: "ST",
    aliases: [],
  },
  {
    displayNamePlural: "Bakpulver",
    displayNameSingular: "Bakpulver",
    ingredientCategory: {
      name: "Skafferi",
    },
    name: "bakpulver",
    shoppingUnit: "G",
    aliases: [],
  },
  {
    displayNamePlural: "Vaniljsocker",
    displayNameSingular: "Vaniljsocker",
    ingredientCategory: {
      name: "Skafferi",
    },
    name: "vaniljsocker",
    shoppingUnit: "G",
    aliases: [],
  },
  {
    displayNamePlural: "Kanel",
    displayNameSingular: "Kanel",
    ingredientCategory: {
      name: "Skafferi",
    },
    name: "kanel",
    shoppingUnit: "G",
    aliases: [],
  },
  {
    displayNamePlural: "Svartpeppar",
    displayNameSingular: "Svartpeppar",
    ingredientCategory: {
      name: "Skafferi",
    },
    name: "svartpeppar",
    shoppingUnit: "G",
    aliases: [],
  },
  {
    displayNamePlural: "Paprikapulver",
    displayNameSingular: "Paprikapulver",
    ingredientCategory: {
      name: "Skafferi",
    },
    name: "paprikapulver",
    shoppingUnit: "G",
    aliases: [],
  },
  {
    displayNamePlural: "Oregano",
    displayNameSingular: "Oregano",
    ingredientCategory: {
      name: "Skafferi",
    },
    name: "oregano",
    shoppingUnit: "G",
    aliases: [],
  },
  {
    displayNamePlural: "Timjan",
    displayNameSingular: "Timjan",
    ingredientCategory: {
      name: "Skafferi",
    },
    name: "timjan",
    shoppingUnit: "G",
    aliases: [],
  },
  {
    displayNamePlural: "Dill",
    displayNameSingular: "Dill",
    ingredientCategory: {
      name: "Skafferi",
    },
    name: "dill",
    shoppingUnit: "G",
    aliases: [],
  },
  {
    displayNamePlural: "Persilja",
    displayNameSingular: "Persilja",
    ingredientCategory: {
      name: "Skafferi",
    },
    name: "persilja",
    shoppingUnit: "G",
    aliases: [],
  },
  {
    displayNamePlural: "Citroner",
    displayNameSingular: "Citron",
    ingredientCategory: {
      name: "Frukt & Grönt",
    },
    name: "citron",
    shoppingUnit: "ST",
    aliases: [],
  },
  {
    displayNamePlural: "Limefrukter",
    displayNameSingular: "Lime",
    ingredientCategory: {
      name: "Frukt & Grönt",
    },
    name: "lime",
    shoppingUnit: "ST",
    aliases: [],
  },
  {
    displayNamePlural: "Äpplen",
    displayNameSingular: "Äpple",
    ingredientCategory: {
      name: "Frukt & Grönt",
    },
    name: "äpple",
    shoppingUnit: "KG",
    aliases: [],
  },
  {
    displayNamePlural: "Bananer",
    displayNameSingular: "Banan",
    ingredientCategory: {
      name: "Frukt & Grönt",
    },
    name: "banan",
    shoppingUnit: "KG",
    aliases: [],
  },
  {
    displayNamePlural: "Apelsiner",
    displayNameSingular: "Apelsin",
    ingredientCategory: {
      name: "Frukt & Grönt",
    },
    name: "apelsin",
    shoppingUnit: "ST",
    aliases: [],
  },
  {
    displayNamePlural: "Vindruvor",
    displayNameSingular: "Vindruva",
    ingredientCategory: {
      name: "Frukt & Grönt",
    },
    name: "vindruva",
    shoppingUnit: "G",
    aliases: [],
  },
  {
    displayNamePlural: "Jordgubbar",
    displayNameSingular: "Jordgubbe",
    ingredientCategory: {
      name: "Frukt & Grönt",
    },
    name: "jordgubbe",
    shoppingUnit: "G",
    aliases: [],
  },
  {
    displayNamePlural: "Blåbär",
    displayNameSingular: "Blåbär",
    ingredientCategory: {
      name: "Frukt & Grönt",
    },
    name: "blåbär",
    shoppingUnit: "G",
    aliases: [],
  },
  {
    displayNamePlural: "Lingon",
    displayNameSingular: "Lingon",
    ingredientCategory: {
      name: "Frukt & Grönt",
    },
    name: "lingon",
    shoppingUnit: "G",
    aliases: [],
  },
  {
    displayNamePlural: "Ättika",
    displayNameSingular: "Ättika",
    ingredientCategory: {
      name: "Skafferi",
    },
    name: "ättika",
    shoppingUnit: "DL",
    aliases: ["attika"],
  },
  {
    displayNamePlural: "Sojasås",
    displayNameSingular: "Sojasås",
    ingredientCategory: {
      name: "Skafferi",
    },
    name: "sojasås",
    shoppingUnit: "DL",
    aliases: ["soja sås", "soja"],
  },
  {
    displayNamePlural: "Ketchup",
    displayNameSingular: "Ketchup",
    ingredientCategory: {
      name: "Skafferi",
    },
    name: "ketchup",
    shoppingUnit: "G",
    aliases: [],
  },
  {
    displayNamePlural: "Senap",
    displayNameSingular: "Senap",
    ingredientCategory: {
      name: "Skafferi",
    },
    name: "senap",
    shoppingUnit: "G",
    aliases: [],
  },
  {
    displayNamePlural: "Majonnäs",
    displayNameSingular: "Majonnäs",
    ingredientCategory: {
      name: "Skafferi",
    },
    name: "majonnäs",
    shoppingUnit: "G",
    aliases: ["majonnas"],
  },
  {
    displayNamePlural: "Krossade tomater",
    displayNameSingular: "Krossade tomater",
    ingredientCategory: {
      name: "Skafferi",
    },
    name: "krossade tomater",
    shoppingUnit: "G",
    aliases: ["krossad tomat", "krossade tomat"],
  },
  {
    displayNamePlural: "Tomatpuré",
    displayNameSingular: "Tomatpuré",
    ingredientCategory: {
      name: "Skafferi",
    },
    name: "tomatpuré",
    shoppingUnit: "G",
    aliases: ["tomat pure"],
  },
  {
    displayNamePlural: "Lökpulver",
    displayNameSingular: "Lökpulver",
    ingredientCategory: {
      name: "Skafferi",
    },
    name: "lökpulver",
    shoppingUnit: "G",
    aliases: [],
  },
  {
    displayNamePlural: "Vitlökspulver",
    displayNameSingular: "Vitlökspulver",
    ingredientCategory: {
      name: "Skafferi",
    },
    name: "vitlökspulver",
    shoppingUnit: "G",
    aliases: [],
  },
  {
    displayNamePlural: "Buljongtärningar",
    displayNameSingular: "Buljongtärning",
    ingredientCategory: {
      name: "Skafferi",
    },
    name: "buljongtärning",
    shoppingUnit: "ST",
    aliases: ["buljong tärning", "buljong", "buljongtärningar"],
  },
  {
    displayNamePlural: "Hönsbuljongtärningar",
    displayNameSingular: "Hönsbuljongtärningar",
    ingredientCategory: {
      name: "Skafferi",
    },
    name: "hönsbuljongtärning",
    shoppingUnit: "ST",
    aliases: [
      "hönsbuljong tärning",
      "hönsbuljong",
      "hönsbuljongtärningar",
      "kycklingbuljongtärning",
      "kycklingbuljongtärningar",
      "kycklingbuljong",
    ],
  },
  {
    displayNamePlural: "Köttbuljongtärningar",
    displayNameSingular: "Köttbuljongtärningar",
    ingredientCategory: {
      name: "Skafferi",
    },
    name: "köttbuljongtärning",
    shoppingUnit: "ST",
    aliases: [
      "köttbuljong tärning",
      "köttbuljong",
      "köttbuljongtärning",
      "köttbuljongtärningar",
    ],
  },
  {
    displayNamePlural: "Svampbuljongtärningar",
    displayNameSingular: "Svampbuljongtärningar",
    ingredientCategory: {
      name: "Skafferi",
    },
    name: "svampbuljongtärning",
    shoppingUnit: "ST",
    aliases: [
      "svampbuljong tärning",
      "svampbuljong",
      "svampbuljongtärning",
      "svampbuljongtärningar",
    ],
  },
  {
    displayNamePlural: "Honung",
    displayNameSingular: "Honung",
    ingredientCategory: {
      name: "Skafferi",
    },
    name: "honung",
    shoppingUnit: "G",
    aliases: [],
  },
  {
    displayNamePlural: "Sirap",
    displayNameSingular: "Sirap",
    ingredientCategory: {
      name: "Skafferi",
    },
    name: "sirap",
    shoppingUnit: "DL",
    aliases: [],
  },
  {
    displayNamePlural: "Choklad",
    displayNameSingular: "Choklad",
    ingredientCategory: {
      name: "Skafferi",
    },
    name: "choklad",
    shoppingUnit: "G",
    aliases: [],
  },
  {
    displayNamePlural: "Kakao",
    displayNameSingular: "Kakao",
    ingredientCategory: {
      name: "Skafferi",
    },
    name: "kakao",
    shoppingUnit: "G",
    aliases: [],
  },
  {
    displayNamePlural: "Gelatin",
    displayNameSingular: "Gelatin",
    ingredientCategory: {
      name: "Skafferi",
    },
    name: "gelatin",
    shoppingUnit: "G",
    aliases: [],
  },
  {
    displayNamePlural: "Ströbröd",
    displayNameSingular: "Ströbröd",
    ingredientCategory: {
      name: "Skafferi",
    },
    name: "ströbröd",
    shoppingUnit: "G",
    aliases: [],
  },
  {
    displayNamePlural: "Majsstärkelse",
    displayNameSingular: "Majsstärkelse",
    ingredientCategory: {
      name: "Skafferi",
    },
    name: "majsstärkelse",
    shoppingUnit: "G",
    aliases: ["maizena"],
  },
  {
    displayNamePlural: "Potatismjöl",
    displayNameSingular: "Potatismjöl",
    ingredientCategory: {
      name: "Skafferi",
    },
    name: "potatismjöl",
    shoppingUnit: "G",
    aliases: [],
  },
  {
    displayNamePlural: "Gräddfil",
    displayNameSingular: "Gräddfil",
    ingredientCategory: {
      name: "Mejeri",
    },
    name: "gräddfil",
    shoppingUnit: "DL",
    aliases: [],
  },
  {
    displayNamePlural: "Crème fraîche",
    displayNameSingular: "Crème fraîche",
    ingredientCategory: {
      name: "Mejeri",
    },
    name: "crème fraîche",
    shoppingUnit: "DL",
    aliases: ["creme fraiche", "cremefraiche"],
  },
  {
    displayNamePlural: "Kaffe",
    displayNameSingular: "Kaffe",
    ingredientCategory: {
      name: "Dryck",
    },
    name: "kaffe",
    shoppingUnit: "G",
    aliases: [],
  },
  {
    displayNamePlural: "Te",
    displayNameSingular: "Te",
    ingredientCategory: {
      name: "Dryck",
    },
    name: "te",
    shoppingUnit: "G",
    aliases: [],
  },
  {
    displayNamePlural: "Vatten",
    displayNameSingular: "Vatten",
    ingredientCategory: {
      name: "Dryck",
    },
    name: "vatten",
    shoppingUnit: "L",
    aliases: [],
  },
  {
    displayNamePlural: "Gräslök",
    displayNameSingular: "Gräslök",
    ingredientCategory: {
      name: "Frukt & Grönt",
    },
    name: "gräslök",
    shoppingUnit: "G",
    aliases: [],
  },
  {
    displayNamePlural: "Röda lökar",
    displayNameSingular: "Röd lök",
    ingredientCategory: {
      name: "Frukt & Grönt",
    },
    name: "röd lök",
    shoppingUnit: "ST",
    aliases: ["rödlök"],
  },
  {
    displayNamePlural: "Purjolökar",
    displayNameSingular: "Purjolök",
    ingredientCategory: {
      name: "Frukt & Grönt",
    },
    name: "purjolök",
    shoppingUnit: "ST",
    aliases: ["purjo lök"],
  },
  {
    displayNamePlural: "Kål",
    displayNameSingular: "Kål",
    ingredientCategory: {
      name: "Frukt & Grönt",
    },
    name: "kål",
    shoppingUnit: "KG",
    aliases: ["vitkål"],
  },
  {
    displayNamePlural: "Broccoli",
    displayNameSingular: "Broccoli",
    ingredientCategory: {
      name: "Frukt & Grönt",
    },
    name: "broccoli",
    shoppingUnit: "ST",
    aliases: [],
  },
  {
    displayNamePlural: "Blomkål",
    displayNameSingular: "Blomkål",
    ingredientCategory: {
      name: "Frukt & Grönt",
    },
    name: "blomkål",
    shoppingUnit: "ST",
    aliases: [],
  },
  {
    displayNamePlural: "Ärter",
    displayNameSingular: "Ärta",
    ingredientCategory: {
      name: "Frysvaror",
    },
    name: "ärta",
    shoppingUnit: "G",
    aliases: ["ärtor", "frysta ärter"],
  },
  {
    displayNamePlural: "Majs",
    displayNameSingular: "Majs",
    ingredientCategory: {
      name: "Skafferi",
    },
    name: "majs",
    shoppingUnit: "G",
    aliases: [],
  },
  {
    displayNamePlural: "Kidneybönor",
    displayNameSingular: "Kidneyböna",
    ingredientCategory: {
      name: "Skafferi",
    },
    name: "kidneyböna",
    shoppingUnit: "G",
    aliases: ["kidney bönor"],
  },
  {
    displayNamePlural: "Linser",
    displayNameSingular: "Lins",
    ingredientCategory: {
      name: "Skafferi",
    },
    name: "lins",
    shoppingUnit: "G",
    aliases: [],
  },
  {
    displayNamePlural: "Kikärtor",
    displayNameSingular: "Kikärta",
    ingredientCategory: {
      name: "Skafferi",
    },
    name: "kikärta",
    shoppingUnit: "G",
    aliases: ["kikärtor"],
  },
  {
    displayNamePlural: "Kokosmjölk",
    displayNameSingular: "Kokosmjölk",
    ingredientCategory: {
      name: "Skafferi",
    },
    name: "kokosmjölk",
    shoppingUnit: "DL",
    aliases: [],
  },
  {
    displayNamePlural: "Fisksås",
    displayNameSingular: "Fisksås",
    ingredientCategory: {
      name: "Skafferi",
    },
    name: "fisksås",
    shoppingUnit: "DL",
    aliases: ["fisk sås"],
  },
  {
    displayNamePlural: "Ostronsås",
    displayNameSingular: "Ostronsås",
    ingredientCategory: {
      name: "Skafferi",
    },
    name: "ostronsås",
    shoppingUnit: "DL",
    aliases: ["ostron sås"],
  },
  {
    displayNamePlural: "Sambal oelek",
    displayNameSingular: "Sambal oelek",
    ingredientCategory: {
      name: "Skafferi",
    },
    name: "sambal oelek",
    shoppingUnit: "G",
    aliases: [],
  },
  {
    displayNamePlural: "Ingefära",
    displayNameSingular: "Ingefära",
    ingredientCategory: {
      name: "Frukt & Grönt",
    },
    name: "ingefära",
    shoppingUnit: "G",
    aliases: [],
  },
  {
    displayNamePlural: "Chilis",
    displayNameSingular: "Chili",
    ingredientCategory: {
      name: "Frukt & Grönt",
    },
    name: "chili",
    shoppingUnit: "ST",
    aliases: [],
  },
  {
    displayNamePlural: "Koriander",
    displayNameSingular: "Koriander",
    ingredientCategory: {
      name: "Frukt & Grönt",
    },
    name: "koriander",
    shoppingUnit: "G",
    aliases: [],
  },
  {
    displayNamePlural: "Spiskummin",
    displayNameSingular: "Spiskummin",
    ingredientCategory: {
      name: "Skafferi",
    },
    name: "spiskummin",
    shoppingUnit: "G",
    aliases: ["kummin"],
  },
  {
    displayNamePlural: "Kardemumma",
    displayNameSingular: "Kardemumma",
    ingredientCategory: {
      name: "Skafferi",
    },
    name: "kardemumma",
    shoppingUnit: "G",
    aliases: [],
  },
  {
    displayNamePlural: "Nejlikor",
    displayNameSingular: "Nejlika",
    ingredientCategory: {
      name: "Skafferi",
    },
    name: "nejlika",
    shoppingUnit: "G",
    aliases: [],
  },
  {
    displayNamePlural: "Lagerblad",
    displayNameSingular: "Lagerblad",
    ingredientCategory: {
      name: "Skafferi",
    },
    name: "lagerblad",
    shoppingUnit: "ST",
    aliases: [],
  },
  {
    displayNamePlural: "Äppelcidervinäger",
    displayNameSingular: "Äppelcidervinäger",
    ingredientCategory: {
      name: "Skafferi",
    },
    name: "äppelcidervinäger",
    shoppingUnit: "DL",
    aliases: [
      "apple cider vinäger",
      "äpplecider vinäger",
      "äpple cidervinäger",
    ],
  },
  {
    displayNamePlural: "Balsamvinäger",
    displayNameSingular: "Balsamvinäger",
    ingredientCategory: {
      name: "Skafferi",
    },
    name: "balsamvinäger",
    shoppingUnit: "DL",
    aliases: [],
  },
  {
    displayNamePlural: "Fetaost",
    displayNameSingular: "Fetaost",
    ingredientCategory: {
      name: "Ost",
    },
    name: "fetaost",
    shoppingUnit: "G",
    aliases: [],
  },
  {
    displayNamePlural: "Mozzarella",
    displayNameSingular: "Mozzarella",
    ingredientCategory: {
      name: "Ost",
    },
    name: "mozzarella",
    shoppingUnit: "G",
    aliases: [],
  },
  {
    displayNamePlural: "Hallon",
    displayNameSingular: "Hallon",
    ingredientCategory: {
      name: "Frukt & Grönt",
    },
    name: "hallon",
    shoppingUnit: "G",
    aliases: [],
  },
  {
    displayNamePlural: "Grönsaksbuljong",
    displayNameSingular: "Grönsaksbuljong",
    ingredientCategory: {
      name: "Skafferi",
    },
    name: "grönsaksbuljong",
    shoppingUnit: "G",
    aliases: ["vegetarisk buljong"],
  },
  {
    displayNamePlural: "Margarin",
    displayNameSingular: "Margarin",
    ingredientCategory: {
      name: "Mejeri",
    },
    name: "margarin",
    shoppingUnit: "G",
    aliases: [],
  },
  {
    displayNamePlural: "Röda linser",
    displayNameSingular: "Röd lins",
    ingredientCategory: {
      name: "Skafferi",
    },
    name: "röd lins",
    shoppingUnit: "G",
    aliases: ["röda linser"],
  },
  {
    displayNamePlural: "Saffran",
    displayNameSingular: "Saffran",
    ingredientCategory: {
      name: "Skafferi",
    },
    name: "saffran",
    shoppingUnit: "G",
    aliases: [],
  },
  {
    displayNamePlural: "Matlagningsvin",
    displayNameSingular: "Matlagningsvin",
    ingredientCategory: {
      name: "Skafferi",
    },
    name: "matlagningsvin",
    shoppingUnit: "DL",
    aliases: ["vin"],
  },
  {
    displayNamePlural: "Rågmjöl",
    displayNameSingular: "Rågmjöl",
    ingredientCategory: {
      name: "Skafferi",
    },
    name: "rågmjöl",
    shoppingUnit: "KG",
    aliases: [],
  },
  {
    displayNamePlural: "Lättmjölk",
    displayNameSingular: "Lättmjölk",
    ingredientCategory: {
      name: "Mejeri",
    },
    name: "lättmjölk",
    shoppingUnit: "L",
    aliases: [],
  },
  {
    displayNamePlural: "Vispgrädde",
    displayNameSingular: "Vispgrädde",
    ingredientCategory: {
      name: "Mejeri",
    },
    name: "vispgrädde",
    shoppingUnit: "DL",
    aliases: [],
  },
  {
    displayNamePlural: "Apelsinjuice",
    displayNameSingular: "Apelsinjuice",
    ingredientCategory: {
      name: "Dryck",
    },
    name: "apelsinjuice",
    shoppingUnit: "L",
    aliases: [],
  },
  {
    displayNamePlural: "Frysta bär",
    displayNameSingular: "Frysta bär",
    ingredientCategory: {
      name: "Frysvaror",
    },
    name: "frysta bär",
    shoppingUnit: "G",
    aliases: [],
  },
  {
    displayNamePlural: "Pesto",
    displayNameSingular: "Pesto",
    ingredientCategory: {
      name: "Skafferi",
    },
    name: "pesto",
    shoppingUnit: "G",
    aliases: [],
  },
  {
    displayNamePlural: "Kikärtsmjöl",
    displayNameSingular: "Kikärtsmjöl",
    ingredientCategory: {
      name: "Skafferi",
    },
    name: "kikärtsmjöl",
    shoppingUnit: "G",
    aliases: [],
  },
  {
    displayNamePlural: "Soltorkade tomater",
    displayNameSingular: "Soltorkad tomat",
    ingredientCategory: {
      name: "Skafferi",
    },
    name: "soltorkad tomat",
    shoppingUnit: "G",
    aliases: [],
  },
  {
    displayNamePlural: "Färskost",
    displayNameSingular: "Färskost",
    ingredientCategory: {
      name: "Ost",
    },
    name: "färskost",
    shoppingUnit: "G",
    aliases: [],
  },
  {
    displayNamePlural: "Couscous",
    displayNameSingular: "Couscous",
    ingredientCategory: {
      name: "Skafferi",
    },
    name: "couscous",
    shoppingUnit: "G",
    aliases: [],
  },
  {
    displayNamePlural: "Bulgur",
    displayNameSingular: "Bulgur",
    ingredientCategory: {
      name: "Skafferi",
    },
    name: "bulgur",
    shoppingUnit: "G",
    aliases: [],
  },
  {
    displayNamePlural: "Grötris",
    displayNameSingular: "Grötris",
    ingredientCategory: {
      name: "Skafferi",
    },
    name: "grötris",
    shoppingUnit: "G",
    aliases: [],
  },
  {
    displayNamePlural: "Mandlar",
    displayNameSingular: "Mandel",
    ingredientCategory: {
      name: "Skafferi",
    },
    name: "mandel",
    shoppingUnit: "G",
    aliases: [],
  },
  {
    displayNamePlural: "Valnötter",
    displayNameSingular: "Valnöt",
    ingredientCategory: {
      name: "Skafferi",
    },
    name: "valnöt",
    shoppingUnit: "G",
    aliases: [],
  },
  {
    displayNamePlural: "Russin",
    displayNameSingular: "Russin",
    ingredientCategory: {
      name: "Skafferi",
    },
    name: "russin",
    shoppingUnit: "G",
    aliases: [],
  },
];

async function main() {
  // await prisma.ingredientCategory.createMany({
  //   data: categoryData,
  // });

  for (const ing of generatedIngredients) {
    const {
      name,
      shoppingUnit,
      displayNameSingular,
      displayNamePlural,
      ingredientCategory,
      aliases,
    } = ing;

    await prisma.ingredient.create({
      data: {
        name,
        shoppingUnit,
        displayNameSingular,
        displayNamePlural,
        ingredientCategory: {
          connect: { name: ingredientCategory.name },
        },
        ingredientAliases: {
          create: aliases?.map((alias) => ({
            name: alias,
          })),
        },
      },
    });
  }

  console.log("Seeding finished");
}

main();

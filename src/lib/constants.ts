import { Unit } from "@/lib/generated/prisma";

export const UNIT_ALIASES: Record<string, Unit> = {
  // Volume
  LITER: "L",
  DECILITER: "DL",
  CENTILITER: "CL",
  MILLILITER: "ML",
  MATSKED: "MSK",
  TESKED: "TSK",
  KRYDDMÅTT: "KRM",

  // Weight
  KILO: "KG",
  KILOGRAM: "KG",
  GRAM: "G",

  // Count
  STYCK: "ST",
  STYCKEN: "ST",
  FÖRPACKNING: "FÖRP",
  FORP: "FÖRP",
  PKT: "FÖRP",
  PAKET: "FÖRP",
  PACK: "FÖRP",
  BURK: "FÖRP",
  PÅSE: "FÖRP",
  KONSERV: "FÖRP",
};

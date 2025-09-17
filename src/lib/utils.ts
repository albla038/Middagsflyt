import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import {
  addDays,
  endOfWeek,
  format,
  getISOWeek,
  getISOWeekYear,
  setISOWeek,
  startOfWeek,
  subDays,
} from "date-fns";
import { sv } from "date-fns/locale";
import {
  ScheduledNoteDisplayContent,
  ScheduledRecipeDisplayContent,
} from "@/lib/types";
import { ShoppingListItemResponse } from "@/lib/schemas/shopping-list";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function removeAccents(str: string) {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

export function normalizeString(str: string) {
  return removeAccents(str).toLowerCase().trim();
}

export function slugify(...args: string[]) {
  const joined = args.join("-");
  const normalized = normalizeString(joined);

  return normalized
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/[^a-z0-9-]/g, "") // Remove non-alphanumeric characters except hyphens
    .replace(/-+/g, "-") // Replace multiple hyphens with a single hyphen
    .replace(/^-+|-+$/g, ""); // Remove leading and trailing hyphens
}

export function generateUniqueSlug(
  baseSlug: string,
  existingSlugs: Set<string>,
): string {
  if (!existingSlugs.has(baseSlug)) return baseSlug;

  let counter = 2;
  let candidateSlug = `${baseSlug}-${counter}`;
  while (existingSlugs.has(candidateSlug)) {
    candidateSlug = `${baseSlug}-${++counter}`;
  }

  return candidateSlug;
}

export function nameToInitials(name: string): string {
  if (!name) return "";

  const parts = name.split(" ");
  const initials = parts.map((part) => part.charAt(0).toUpperCase()).join("");

  return initials;
}

export function formatQuantityDecimal(quantity: number): string {
  if (Number.isInteger(quantity)) {
    return quantity.toString();
  }

  if (quantity.toFixed(0).length > 2) {
    return quantity.toFixed(0);
  }

  const value = Math.round(quantity * 100) / 100; // Round to two decimal places
  const remainder = value % 1;
  const truncatedValue = Math.trunc(value);

  const displayValue = truncatedValue ? truncatedValue.toString() + " " : "";

  switch (remainder) {
    case 0.5:
      return displayValue + "½";
    case 0.25:
      return displayValue + "¼";
    case 0.75:
      return displayValue + "¾";
  }

  return value.toString();
}

export function calculateStartAndEndDateOfWeek(year: number, week: number) {
  // Get the start and end dates of the week
  const startDateOfWeek = startOfWeek(setISOWeek(new Date(year, 0, 1), week), {
    weekStartsOn: 1, // Monday as the first day of the week
    locale: sv,
  });
  const endDateOfWeek = endOfWeek(startDateOfWeek, {
    weekStartsOn: 1,
    locale: sv,
  });

  return { startDateOfWeek, endDateOfWeek };
}

export function calculateNextAndPrevWeekNumbers(startDateOfWeek: Date) {
  // Calculate the next week and year number
  const startDateOfNextWeek = addDays(startDateOfWeek, 7);
  const nextWeek = getISOWeek(startDateOfNextWeek);
  const nextWeekYear = getISOWeekYear(startDateOfNextWeek);

  // Calculate the previous week and year number
  const startDateOfPrevWeek = subDays(startDateOfWeek, 7);
  const prevWeek = getISOWeek(startDateOfPrevWeek);
  const prevWeekYear = getISOWeekYear(startDateOfPrevWeek);

  return { nextWeek, nextWeekYear, prevWeek, prevWeekYear };
}

export function groupRecipesByWeekday(
  startDate: Date,
  recipes: ScheduledRecipeDisplayContent[],
  notes: ScheduledNoteDisplayContent[],
) {
  const groupedRecipes = new Map<
    string,
    {
      date: Date;
      recipes: ScheduledRecipeDisplayContent[];
      notes: ScheduledNoteDisplayContent[];
    }
  >();

  // Generate dates for the week
  const weekDates = Array.from({ length: 7 }, (_, i) => addDays(startDate, i));

  // Initialize the map with empty arrays for each date
  weekDates.forEach((weekDate) => {
    const dateKey = format(weekDate, "yyyy-MM-dd");
    groupedRecipes.set(dateKey, {
      date: weekDate,
      recipes: [],
      notes: [],
    });
  });

  // Group the recipes
  recipes.forEach((recipe) => {
    // Match the recipe date to the corresponding week date and add it to the map
    const dateKey = format(recipe.date, "yyyy-MM-dd");
    const dayData = groupedRecipes.get(dateKey);
    if (dayData) {
      dayData.recipes.push(recipe);
    }
  });

  // Group the scheduled notes
  notes.forEach((note) => {
    // Match the note date to the corresponding week date and add it to the map
    const dateKey = format(note.date, "yyyy-MM-dd");
    const dayData = groupedRecipes.get(dateKey);
    if (dayData) {
      dayData.notes.push(note);
    }
  });

  return groupedRecipes;
}

export function groupItemsByCategory(
  items: ShoppingListItemResponse[],
  categories: { id: string; name: string }[],
) {
  // Map category IDs to names for easy lookup
  const categoryMap = new Map<string, string>();
  categories.forEach(({ id, name }) => categoryMap.set(id, name));

  const groupedItems = new Map<string, ShoppingListItemResponse[]>();

  // Pre-populate the map to maintain a consistent order
  categories.forEach(({ name }) => groupedItems.set(name, []));
  groupedItems.set("Handlat", []);

  // Sort items into categories
  items.forEach((item) => {
    let categoryName: string;

    if (item.isPurchased) {
      categoryName = "Handlat";
    } else if (!item.categoryId) {
      categoryName = "Övrigt";
    } else {
      // Get category name from ID
      const foundCategoryName = categoryMap.get(item.categoryId);
      if (!foundCategoryName) {
        throw new Error(`Category not found for id: ${item.categoryId}`);
      }

      categoryName = foundCategoryName;
    }

    const categoryData = groupedItems.get(categoryName);
    if (categoryData) {
      categoryData.push(item);
    }
  });

  [...groupedItems].forEach(([category, items]) => {
    if (items.length === 0) {
      groupedItems.delete(category);
    }
  });

  return groupedItems;
}

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

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

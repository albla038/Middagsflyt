import { ActionErrorCode } from "@/lib/types/error-codes";

const DEFAULT_ACTION_ERROR_MESSAGES: Record<ActionErrorCode, string> = {
  NOT_FOUND:
    "Det du letade efter, eller försökte ändra, kunde inte hittas. Det kan redan ha tagits bort.",
  CONFLICT:
    "Ändringen kunde inte sparas eftersom uppgifterna krockar med befintlig information.",
  FORBIDDEN: "Du har inte behörighet att utföra den här åtgärden.",
  VALIDATION_FAILED:
    "Viss information saknas eller har fel format. Kontrollera dina uppgifter och försök igen.",
  INTERNAL_ERROR: "Våra servrar har problem just nu. Försök igen senare.",
  UNAUTHORIZED:
    "Du är inte inloggad, eller så har din session gått ut. Vänligen logga in på nytt.",
};

export function getActionErrorMessage(
  code: ActionErrorCode,
  overrides?: Partial<Record<ActionErrorCode, string>>,
): string {
  return overrides?.[code] ?? DEFAULT_ACTION_ERROR_MESSAGES[code];
}

import { ActionErrorCode } from "@/lib/types/error-codes";
import { BetterFetchError } from "@better-fetch/fetch";

// Returns a user-friendly error message for React Query errors, (based on BetterFetchError status codes)
export function getDefaultQueryErrorMessage(error: Error): string {
  if (error instanceof BetterFetchError) {
    const status = error.status;

    switch (status) {
      case 400:
        return "Något gick fel. Kontrollera dina uppgifter och försök igen.";
      case 401:
        return "Du är inte inloggad, eller så har din session gått ut. Vänligen logga in på nytt.";
      case 403:
        return "Du har inte behörighet att utföra den här åtgärden.";
      case 404:
        return "Vi kunde inte hitta det du letade efter.";
      case 408:
        return "Det tog för lång tid att svara. Kontrollera din internetanslutning och försök igen.";
      case 500:
        return "Våra servrar har problem just nu. Försök igen senare.";
      case 503:
        return "Tjänsten är för tillfället inte tillgänglig. Vi jobbar på det!";
    }
  }

  return "Ett oväntat fel inträffade. Försök igen senare.";
}

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

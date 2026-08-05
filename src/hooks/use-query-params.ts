import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo } from "react";
import z from "zod";

/**
 * A custom React/Next.js hook that manages query parameters in the URL using a Zod schema for validation and parsing.
 */

export function useQueryParams<S extends z.ZodObject<z.ZodRawShape>>(
  schema: S,
  defaultValues: z.infer<S>,
): [z.infer<S>, (newParams: Partial<z.infer<S>>) => void] {
  const params = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const currentValues = useMemo(() => {
    // Convert URLSearchParams to a plain object
    const urlValues = Object.fromEntries(params);

    // Merge default values with URL values, giving precedence to URL values
    const rawValues = { ...defaultValues, ...urlValues };

    // Validate and parse the merged values using the provided schema
    const parsed = schema.safeParse(rawValues);
    return parsed.success ? parsed.data : defaultValues;
  }, [params, schema, defaultValues]);

  const setQueryParams = useCallback(
    (newValues: Partial<z.infer<S>>) => {
      // Create new URLSearchParams that will be written to the URL
      const searchParams = new URLSearchParams(params);

      // Merge current values with new values, giving precedence to new values
      const updated = { ...currentValues, ...newValues };

      // Update the URLSearchParams with the updated values
      Object.entries(updated).forEach(([key, value]) => {
        const isDefault = value === defaultValues[key];

        if (value === null || value === undefined || isDefault) {
          searchParams.delete(key);
        } else {
          searchParams.set(key, String(value));
        }
      });

      // Update the URL
      router.replace(`${pathname}?${searchParams.toString()}`, {
        scroll: false,
      });
    },
    [params, currentValues, defaultValues, pathname, router],
  );

  return [currentValues, setQueryParams];
}

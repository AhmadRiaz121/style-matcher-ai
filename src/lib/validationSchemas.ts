import { z } from 'zod';

/**
 * Schema for validating AI-generated clothing analysis responses
 */
export const ClothingAnalysisSchema = z.object({
  category: z.enum(['tops', 'bottoms', 'suits', 'dresses', 'outerwear', 'shoes', 'accessories']),
  name: z.string().min(1).max(100),
  color: z.string().max(50).optional()
});

export type ClothingAnalysis = z.infer<typeof ClothingAnalysisSchema>;

/**
 * Schema for validating AI-generated outfit suggestions
 */
export const OutfitSuggestionSchema = z.object({
  name: z.string().min(1).max(100),
  items: z.array(z.number().int().nonnegative()),
  tip: z.string().max(500).optional()
});

export const OutfitSuggestionsArraySchema = z.array(OutfitSuggestionSchema);

export type OutfitSuggestion = z.infer<typeof OutfitSuggestionSchema>;

/**
 * Safely parse JSON and validate against a schema
 * Returns null if parsing or validation fails
 */
export function safeJsonParse<T>(
  jsonString: string,
  schema: z.ZodType<T>
): T | null {
  try {
    const parsed = JSON.parse(jsonString);
    const validated = schema.safeParse(parsed);
    if (validated.success) {
      return validated.data;
    }
    console.warn('JSON validation failed:', validated.error.message);
    return null;
  } catch (error) {
    console.warn('JSON parsing failed:', error);
    return null;
  }
}

/**
 * Extract JSON from AI response text (handles markdown code blocks)
 */
export function extractJsonFromResponse(text: string): string | null {
  // Try to find JSON object or array
  const jsonMatch = text.match(/\{[\s\S]*\}/) || text.match(/\[[\s\S]*\]/);
  return jsonMatch ? jsonMatch[0] : null;
}

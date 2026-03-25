export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

export function validateRequired(value: unknown, fieldName: string): string | null {
  if (value === undefined || value === null || value === '') {
    return `${fieldName} is required`;
  }
  return null;
}

export function validateString(value: unknown, fieldName: string, maxLength = 500): string | null {
  if (typeof value !== 'string') return `${fieldName} must be a string`;
  if (value.length > maxLength) return `${fieldName} must be at most ${maxLength} characters`;
  return null;
}

export function validateEnum<T extends string>(value: unknown, fieldName: string, allowed: T[]): string | null {
  if (!allowed.includes(value as T)) {
    return `${fieldName} must be one of: ${allowed.join(', ')}`;
  }
  return null;
}

export function validateDateString(value: unknown, fieldName: string): string | null {
  if (typeof value !== 'string') return `${fieldName} must be a date string`;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return `${fieldName} must be in YYYY-MM-DD format`;
  return null;
}

export function runValidation(checks: Array<string | null>): ValidationResult {
  const errors = checks.filter((e): e is string => e !== null);
  return { valid: errors.length === 0, errors };
}

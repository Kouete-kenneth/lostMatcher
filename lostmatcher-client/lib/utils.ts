/**
 * Utility function to combine class names (similar to clsx/cn)
 * Filters out falsy values and joins valid class names
 */
export function cn(...classes: (string | undefined | null | false)[]): string {
	return classes.filter(Boolean).join(" ");
}

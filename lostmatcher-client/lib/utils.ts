import { clsx, type ClassValue } from "clsx";

/**
 * Utility function to combine class names using clsx
 */
export function cn(...inputs: ClassValue[]) {
	return clsx(inputs);
}

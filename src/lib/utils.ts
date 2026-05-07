import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Utility function to merge Tailwind CSS classes using clsx and tailwind-merge.
 * @param {...ClassValue[]} inputs - The classes to merge.
 * @returns {string} The merged class names.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

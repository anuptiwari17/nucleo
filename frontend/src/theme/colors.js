// src/theme/colors.js
export const COLORS = {
  // Primary (blue)
  primary: "bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500",
  primaryOutline:
    "border-primary-600 text-primary-600 hover:bg-primary-50 focus:ring-primary-500",

  // Accent (violet – used only for special actions)
  accent: "bg-accent-600 text-white hover:bg-accent-700 focus:ring-accent-500",
  accentOutline:
    "border-accent-600 text-accent-600 hover:bg-accent-50 focus:ring-accent-500",

  // Neutral
  neutralBg: "bg-white dark:bg-neutral-900",
  neutralBorder: "border-neutral-300 dark:border-neutral-700",
  neutralText: "text-neutral-900 dark:text-neutral-100",
  neutralMuted: "text-neutral-600 dark:text-neutral-400",

  // Success / Error (kept for future toast, etc.)
  success: "bg-success-600 text-white hover:bg-success-700 focus:ring-success-500",
  error: "bg-error-600 text-white hover:bg-error-700 focus:ring-error-500",
};
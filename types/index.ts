// Shared TypeScript types for the expense tracker

// Server Action response format (per agents.md Section 14)
export type ServerActionResponse<T = unknown> =
  | { success: true; data: T }
  | { success: false; error: string };

// Expense categories (per agents.md Section 6.2)
export type ExpenseCategory = "Food" | "Rent" | "Travel" | "Bills" | "Other";

export const EXPENSE_CATEGORIES: ExpenseCategory[] = [
  "Food",
  "Rent",
  "Travel",
  "Bills",
  "Other",
];

// Expense source type
export type ExpenseSource = "manual" | "automatic";

// Date range for queries
export type DateRange = {
  start: Date;
  end: Date;
};

// Monthly summary data
export type MonthlySummary = {
  total: number;
  byCategory: Record<ExpenseCategory, number>;
  categoryBreakdown: Array<{
    category: ExpenseCategory;
    amount: number;
    percentage: number;
  }>;
};




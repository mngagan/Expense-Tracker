"use server";

import { getUserId } from "@/lib/auth-helpers";
import { prisma } from "@/lib/db";
import { ServerActionResponse, ExpenseCategory } from "@/types";

type CategoryBreakdown = {
  category: ExpenseCategory;
  amount: number;
  percentage: number;
};

type MonthlySummary = {
  total: number;
  breakdown: CategoryBreakdown[];
  insight: string;
};

// Get summary for a specific month
export async function getMonthlySummary(
  year: number,
  month: number
): Promise<ServerActionResponse<MonthlySummary>> {
  try {
    const userId = await getUserId();

    const firstDay = new Date(year, month - 1, 1);
    const lastDay = new Date(year, month, 0, 23, 59, 59);

    // Get all expenses for the month
    const expenses = await prisma.expense.findMany({
      where: {
        userId,
        date: {
          gte: firstDay,
          lte: lastDay,
        },
      },
      select: {
        amount: true,
        category: true,
      },
    });

    // Calculate totals by category
    const categoryTotals: Record<string, number> = {};
    let total = 0;

    expenses.forEach((expense) => {
      const cat = expense.category as ExpenseCategory;
      categoryTotals[cat] = (categoryTotals[cat] || 0) + expense.amount;
      total += expense.amount;
    });

    // Create breakdown with percentages
    const breakdown: CategoryBreakdown[] = Object.entries(categoryTotals)
      .map(([category, amount]) => ({
        category: category as ExpenseCategory,
        amount,
        percentage: total > 0 ? (amount / total) * 100 : 0,
      }))
      .sort((a, b) => b.amount - a.amount);

    // Generate simple insight
    let insight = "No expenses this month.";
    if (breakdown.length > 0) {
      const topCategory = breakdown[0];
      insight = `Most spent on ${topCategory.category} (₹${topCategory.amount.toFixed(2)})`;
    }

    return {
      success: true,
      data: {
        total,
        breakdown,
        insight,
      },
    };
  } catch (error) {
    return {
      success: false,
      error: "Could not load summary. Please try again.",
    };
  }
}




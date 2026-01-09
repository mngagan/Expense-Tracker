"use server";

import { getUserId } from "@/lib/auth-helpers";
import { prisma } from "@/lib/db";
import { ServerActionResponse } from "@/types";
import { ExpenseCategory } from "@/types";
import { z } from "zod";

// Validation schema
const addExpenseSchema = z.object({
  amount: z.number().positive("Amount must be greater than 0"),
  date: z.date(),
  category: z.enum(["Food", "Rent", "Travel", "Bills", "Other"]),
  note: z.string().optional(),
});

// Server Action to add expense (per agents.md Section 14)
export async function addExpense(
  data: {
    amount: number;
    date: Date;
    category: ExpenseCategory;
    note?: string;
  }
): Promise<ServerActionResponse<{ id: string }>> {
  try {
    // Validate authentication
    const userId = await getUserId();

    // Validate input
    const validated = addExpenseSchema.parse(data);

    // Create expense
    const expense = await prisma.expense.create({
      data: {
        userId,
        amount: validated.amount,
        date: validated.date,
        category: validated.category,
        note: validated.note,
        source: "manual",
      },
    });

    return { success: true, data: { id: expense.id } };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: "Invalid expense data. Please check all fields.",
      };
    }

    // Never expose technical errors to users (per agents.md Section 16)
    return {
      success: false,
      error: "Could not save expense. Please try again.",
    };
  }
}




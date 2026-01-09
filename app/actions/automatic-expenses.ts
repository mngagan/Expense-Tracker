"use server";

import { getUserId } from "@/lib/auth-helpers";
import { prisma } from "@/lib/db";
import { ServerActionResponse, ExpenseCategory } from "@/types";
import { z } from "zod";

// Create automatic expense
const createAutomaticExpenseSchema = z.object({
  name: z.string().min(1, "Name is required"),
  amount: z.number().positive("Amount must be greater than 0"),
  category: z.enum(["Food", "Rent", "Travel", "Bills", "Other"]),
});

export async function createAutomaticExpense(data: {
  name: string;
  amount: number;
  category: ExpenseCategory;
}): Promise<ServerActionResponse<{ id: string }>> {
  try {
    const userId = await getUserId();
    const validated = createAutomaticExpenseSchema.parse(data);

    const now = new Date();
    const startMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;

    const automaticExpense = await prisma.automaticExpense.create({
      data: {
        userId,
        name: validated.name,
        amount: validated.amount,
        category: validated.category,
        startMonth,
        isActive: true,
      },
    });

    return { success: true, data: { id: automaticExpense.id } };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: "Invalid data. Please check all fields.",
      };
    }
    return {
      success: false,
      error: "Could not create automatic expense. Please try again.",
    };
  }
}

// Get all automatic expenses
export async function getAutomaticExpenses() {
  try {
    const userId = await getUserId();

    const expenses = await prisma.automaticExpense.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    return { success: true, data: expenses } as ServerActionResponse<
      typeof expenses
    >;
  } catch (error) {
    return {
      success: false,
      error: "Could not load automatic expenses.",
    } as ServerActionResponse<never>;
  }
}

// Skip automatic expense for current month
export async function skipAutomaticExpense(
  automaticExpenseId: string
): Promise<ServerActionResponse> {
  try {
    const userId = await getUserId();

    // Verify the automatic expense belongs to the user
    const autoExpense = await prisma.automaticExpense.findFirst({
      where: {
        id: automaticExpenseId,
        userId,
      },
    });

    if (!autoExpense) {
      return {
        success: false,
        error: "Automatic expense not found.",
      };
    }

    const now = new Date();
    const currentYearMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;

    // Create skip entry (idempotent)
    await prisma.skippedAutomaticExpense.upsert({
      where: {
        automaticExpenseId_yearMonth: {
          automaticExpenseId,
          yearMonth: currentYearMonth,
        },
      },
      create: {
        automaticExpenseId,
        yearMonth: currentYearMonth,
      },
      update: {},
    });

    // Delete the expense for this month if it exists
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

    await prisma.expense.deleteMany({
      where: {
        userId,
        automaticExpenseId,
        date: {
          gte: startOfMonth,
          lte: endOfMonth,
        },
      },
    });

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: "Could not skip automatic expense. Please try again.",
    };
  }
}

// Remove automatic expense forever
export async function removeAutomaticExpense(
  automaticExpenseId: string
): Promise<ServerActionResponse> {
  try {
    const userId = await getUserId();

    // Verify ownership and deactivate
    await prisma.automaticExpense.updateMany({
      where: {
        id: automaticExpenseId,
        userId,
      },
      data: {
        isActive: false,
      },
    });

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: "Could not remove automatic expense. Please try again.",
    };
  }
}




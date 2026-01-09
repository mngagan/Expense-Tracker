"use server";

import { getUserId } from "@/lib/auth-helpers";
import { prisma } from "@/lib/db";
import { ServerActionResponse } from "@/types";

// Get expenses for home screen (last 3)
export async function getRecentExpenses() {
  try {
    const userId = await getUserId();

    const expenses = await prisma.expense.findMany({
      where: { userId },
      orderBy: { date: "desc" },
      take: 3,
      select: {
        id: true,
        amount: true,
        date: true,
        category: true,
        note: true,
      },
    });

    return { success: true, data: expenses } as ServerActionResponse<
      typeof expenses
    >;
  } catch (error) {
    return {
      success: false,
      error: "Could not load expenses. Please try again.",
    } as ServerActionResponse<never>;
  }
}

// Get today's total
export async function getTodayTotal() {
  try {
    const userId = await getUserId();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const result = await prisma.expense.aggregate({
      where: {
        userId,
        date: {
          gte: today,
          lt: tomorrow,
        },
      },
      _sum: {
        amount: true,
      },
    });

    return {
      success: true,
      data: result._sum.amount ?? 0,
    } as ServerActionResponse<number>;
  } catch (error) {
    return {
      success: false,
      error: "Could not load today's total.",
    } as ServerActionResponse<never>;
  }
}

// Get this month's total
export async function getThisMonthTotal() {
  try {
    const userId = await getUserId();
    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

    const result = await prisma.expense.aggregate({
      where: {
        userId,
        date: {
          gte: firstDay,
          lte: lastDay,
        },
      },
      _sum: {
        amount: true,
      },
    });

    return {
      success: true,
      data: result._sum.amount ?? 0,
    } as ServerActionResponse<number>;
  } catch (error) {
    return {
      success: false,
      error: "Could not load this month's total.",
    } as ServerActionResponse<never>;
  }
}




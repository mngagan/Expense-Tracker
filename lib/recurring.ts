import { prisma } from "@/lib/db";

// Automatic expense logic (per agents.md Section 7)
// On app open OR dashboard load: Check active automatic expenses
// If current month entry does not exist → create it (idempotent)

export async function ensureAutomaticExpensesForCurrentMonth(
  userId: string
): Promise<void> {
  try {
    const now = new Date();
    const currentYearMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;

    // Get all active automatic expenses for this user
    const automaticExpenses = await prisma.automaticExpense.findMany({
      where: {
        userId,
        isActive: true,
      },
    });

    // For each automatic expense, check if current month entry exists
    for (const autoExpense of automaticExpenses) {
      // Check if this month is skipped
      const isSkipped = await prisma.skippedAutomaticExpense.findUnique({
        where: {
          automaticExpenseId_yearMonth: {
            automaticExpenseId: autoExpense.id,
            yearMonth: currentYearMonth,
          },
        },
      });

      if (isSkipped) {
        continue; // Skip this month, don't create expense
      }

      // Check if expense already exists for this month
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

      const existingExpense = await prisma.expense.findFirst({
        where: {
          userId,
          automaticExpenseId: autoExpense.id,
          date: {
            gte: startOfMonth,
            lte: endOfMonth,
          },
        },
      });

      // If no expense exists and startMonth is before or equal to current month, create it
      if (!existingExpense) {
        const expenseStartMonth = new Date(autoExpense.startMonth + "-01");
        const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);

        if (expenseStartMonth <= currentMonthStart) {
          // Create expense for current month (on the 1st of the month)
          await prisma.expense.create({
            data: {
              userId,
              amount: autoExpense.amount,
              date: new Date(now.getFullYear(), now.getMonth(), 1),
              category: autoExpense.category,
              note: autoExpense.name,
              source: "automatic",
              automaticExpenseId: autoExpense.id,
            },
          });
        }
      }
    }
  } catch (error) {
    // Fail silently - don't break the app if automatic expense creation fails
    // In production, this should use structured logging
  }
}

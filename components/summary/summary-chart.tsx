"use client";

import { useState, useEffect } from "react";
import { getMonthlySummary } from "@/app/actions/get-summary";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { ServerActionResponse } from "@/types";

// Summary chart component (per agents.md Section 6.3)
// One chart at a time, no dense legends, simple insight
export function SummaryChart() {
  const [month, setMonth] = useState<"current" | "previous">("current");
  const [data, setData] = useState<ServerActionResponse<any> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [month]);

  const loadData = async () => {
    setLoading(true);
    const now = new Date();
    let year = now.getFullYear();
    let monthNum = now.getMonth() + 1;

    if (month === "previous") {
      monthNum -= 1;
      if (monthNum === 0) {
        monthNum = 12;
        year -= 1;
      }
    }

    const result = await getMonthlySummary(year, monthNum);
    setData(result);
    setLoading(false);
  };

  if (loading || !data || !data.success) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center">
            <p className="text-muted-foreground">
              {loading ? "Loading..." : data?.error || "No data available"}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const { total, breakdown, insight } = data.data;

  // Colors for pie chart (mobile-friendly, high contrast)
  const COLORS = [
    "#3b82f6", // blue
    "#10b981", // green
    "#f59e0b", // amber
    "#ef4444", // red
    "#8b5cf6", // purple
  ];

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Summary</CardTitle>
          <div className="flex gap-2">
            <Button
              variant={month === "current" ? "default" : "outline"}
              size="sm"
              onClick={() => setMonth("current")}
            >
              This Month
            </Button>
            <Button
              variant={month === "previous" ? "default" : "outline"}
              size="sm"
              onClick={() => setMonth("previous")}
            >
              Last Month
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Total */}
        <div className="text-center">
          <p className="text-sm text-muted-foreground mb-1">Total</p>
          <p className="text-3xl font-bold">₹{total.toFixed(2)}</p>
        </div>

        {/* Pie Chart */}
        {breakdown.length > 0 ? (
          <>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={breakdown}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ category, percentage }) =>
                      `${category}: ${percentage.toFixed(0)}%`
                    }
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="amount"
                  >
                    {breakdown.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: number) => `₹${value.toFixed(2)}`}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Simple insight text */}
            <div className="text-center pt-4">
              <p className="text-sm text-muted-foreground">{insight}</p>
            </div>
          </>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <p>No expenses for this month.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}




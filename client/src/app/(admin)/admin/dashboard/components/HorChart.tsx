"use client"

import { useEffect, useState } from "react"
import { TrendingUp } from "lucide-react"
import { Bar, BarChart, XAxis, YAxis, Cell } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { getToken } from "@/lib"
import axios from "axios"
import apiClient from "@/lib/apiClient"

const colors = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
  "var(--chart-6)",
  "var(--chart-7)",
  "var(--chart-8)",
]

export const chartConfig: ChartConfig = {
  jobs: { label: "Jobs", color: "var(--chart-1)" },
}

export function ChartBarJobsPerCategory() {
  const [data, setData] = useState<{ category: string; jobs: number }[]>([])

  useEffect(() => {
    async function fetchData() {
      try {
        const token = getToken()
        const res = await apiClient.get("/api/admin/jobs-per-category", {
          headers: { Authorization: `Bearer ${token}` },
        })
        setData(res.data)
      } catch (error) {
        console.error("Error fetching jobs per category:", error)
      }
    }

    fetchData()
  }, [])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Jobs Per Category</CardTitle>
        <CardDescription>Top 8 Categories</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart
            layout="vertical"
            data={data}
            margin={{ left: -20 }}
          >
            <XAxis type="number" dataKey="jobs" hide />
            <YAxis
              dataKey="category"
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey="jobs" radius={5}>
              {data.map((entry, index) => (
                <Cell key={entry.category} fill={colors[index % colors.length]} />
              ))}
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 leading-none font-medium">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="text-muted-foreground leading-none">
          Showing total jobs for the top 8 categories
        </div>
      </CardFooter>
    </Card>
  )
}

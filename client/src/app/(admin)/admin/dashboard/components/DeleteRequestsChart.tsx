"use client"

import { useEffect, useState } from "react"
import { TrendingUp } from "lucide-react"
import { LineChart, Line, CartesianGrid, XAxis } from "recharts"

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
import axios from "axios"
import { getToken } from "@/lib"
import apiClient from "@/lib/apiClient"

export const chartConfig: ChartConfig = {
  requests: { label: "Delete Requests", color: "var(--chart-1)" },
}

export function DeleteRequestsLineChart() {
  const [data, setData] = useState<{ month: string; requests: number }[]>([])

  useEffect(() => {
    async function fetchData() {
      try {
        const token = getToken()
        const res = await apiClient.get("/api/admin/delete-requests-chart", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        setData(res.data)
      } catch (error) {
        console.error("Error fetching delete requests chart:", error)
      }
    }

    fetchData()
  }, [])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Delete Requests</CardTitle>
        <CardDescription>Last 6 months</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart
            data={data}
            margin={{ left: 12, right: 12 }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(5)} // "YYYY-MM" → "MM"
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Line
              dataKey="requests"
              type="natural"
              stroke="var(--color-requests)"
              strokeWidth={2}
              dot={{ fill: "var(--color-requests)" }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 leading-none font-medium">
          Trending up by 5% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="text-muted-foreground leading-none">
          Showing total delete requests per month
        </div>
      </CardFooter>
    </Card>
  )
}

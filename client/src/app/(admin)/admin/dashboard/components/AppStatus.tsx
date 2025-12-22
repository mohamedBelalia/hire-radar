"use client"

import { useEffect, useState } from "react"
import { TrendingUp } from "lucide-react"
import { Pie, PieChart } from "recharts"

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

// Define chart colors for each status
const statusColors: Record<string, string> = {
  pending: "var(--chart-1)",
  reviewed: "var(--chart-2)",
  accepted: "var(--chart-3)",
  rejected: "var(--chart-4)",
  other: "var(--chart-5)",
}

export const chartConfig: ChartConfig = {
  count: { label: "Applications" },
  pending: { label: "Pending", color: statusColors.pending },
  reviewed: { label: "Reviewed", color: statusColors.reviewed },
  accepted: { label: "Accepted", color: statusColors.accepted },
  rejected: { label: "Rejected", color: statusColors.rejected },
  other: { label: "Other", color: statusColors.other },
}

export function ChartPieApplicationStatus() {
  const [data, setData] = useState<
    { status: string; count: number; fill: string }[]
  >([])

  useEffect(() => {
    async function fetchData() {
      try {
        const token = getToken()
        const res = await apiClient.get("/api/admin/app-status-chart", {
          headers: { Authorization: `Bearer ${token}` },
        })

        const formattedData = res.data.map((item: { status: string; count: number }) => ({
          ...item,
          fill: statusColors[item.status.toLowerCase()] || statusColors.other,
        }))

        setData(formattedData)
      } catch (error) {
        console.error("Error fetching chart data:", error)
      }
    }

    fetchData()
  }, [])

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Applications Status</CardTitle>
        <CardDescription>Distribution of application statuses</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px] [&_.recharts-pie-label-text]:fill-foreground"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie data={data} dataKey="count" nameKey="status" />
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 leading-none font-medium">
          Overview of application statuses <TrendingUp className="h-4 w-4" />
        </div>
        <div className="text-muted-foreground leading-none">
          Shows total applications by status
        </div>
      </CardFooter>
    </Card>
  )
}

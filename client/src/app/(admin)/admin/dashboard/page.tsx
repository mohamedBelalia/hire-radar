"use client"

import * as React from "react"
import { getToken } from "@/lib"
import { getDashboardStats } from "@/services/admin"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { BarChartUserRoles } from "./components/PieChart"
import { DeleteRequestsLineChart } from "./components/DeleteRequestsChart"
import { ChartBarJobsPerCategory } from "./components/HorChart"
import { ChartPieApplicationStatus } from "./components/AppStatus"

interface DashboardChartData {
  date: string
  users: number
  jobs: number
  applicants: number
}

export const description = "Dashboard chart: Users, Jobs, Applicants"

const chartConfig = {
  users: { label: "Users", color: "var(--chart-1)" },
  jobs: { label: "Jobs", color: "var(--chart-2)" },
  applicants: { label: "Applicants", color: "var(--chart-3)" },
} satisfies ChartConfig

export default function DashboardChart() {
  const [chartData, setChartData] = React.useState<DashboardChartData[]>([])
  const [timeRange, setTimeRange] = React.useState("7d")

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getDashboardStats(getToken())        
        setChartData(res.data)
      } catch (err) {
        console.error(err)
      }
    }
    fetchData()
  }, [])

  // Filter data based on selected time range
  const filteredData = chartData.filter((item) => {
    if (!item.date) return false
    const date = new Date(item.date)
    const referenceDate = new Date() // today
    let daysToSubtract = 90
    if (timeRange === "30d") daysToSubtract = 30
    else if (timeRange === "7d") daysToSubtract = 7

    const startDate = new Date(referenceDate)
    startDate.setDate(startDate.getDate() - daysToSubtract)
    return date >= startDate
  })

  return (
    <div>
      <Card className="pt-0">
        <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
          <div className="grid flex-1 gap-1">
            <CardTitle>Dashboard Chart</CardTitle>
            <CardDescription>
              Showing Users, Jobs, and Applicants for the last period
            </CardDescription>
          </div>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="hidden rounded-lg sm:ml-auto sm:flex" aria-label="Select a value">
              <SelectValue placeholder="Select range" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="90d" className="rounded-lg">Last 3 months</SelectItem>
              <SelectItem value="30d" className="rounded-lg">Last 30 days</SelectItem>
              <SelectItem value="7d" className="rounded-lg">Last 7 days</SelectItem>
            </SelectContent>
          </Select>
        </CardHeader>

        <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
          <ChartContainer config={chartConfig} className="aspect-auto h-[250px] w-full">
            <AreaChart data={filteredData}>
              <defs>
                <linearGradient id="fillUsers" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--chart-1)" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="var(--chart-1)" stopOpacity={0.1} />
                </linearGradient>
                <linearGradient id="fillJobs" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--chart-2)" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="var(--chart-2)" stopOpacity={0.1} />
                </linearGradient>
                <linearGradient id="fillApplicants" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--chart-3)" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="var(--chart-3)" stopOpacity={0.1} />
                </linearGradient>
              </defs>

              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={32}
                tickFormatter={(value) =>
                  new Date(value).toLocaleDateString("en-US", { month: "short", day: "numeric" })
                }
              />
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    labelFormatter={(value) =>
                      new Date(value).toLocaleDateString("en-US", { month: "short", day: "numeric" })
                    }
                    indicator="dot"
                  />
                }
              />

              <Area type="natural" dataKey="users" stroke="var(--chart-1)" fill="url(#fillUsers)" stackId="a" />
              <Area type="natural" dataKey="jobs" stroke="var(--chart-2)" fill="url(#fillJobs)" stackId="a" />
              <Area type="natural" dataKey="applicants" stroke="var(--chart-3)" fill="url(#fillApplicants)" stackId="a" />

              <ChartLegend content={<ChartLegendContent />} />
            </AreaChart>
          </ChartContainer>
        </CardContent>
      </Card>


      <div className="mt-5 grid md:grid-cols-2 gap-2">
        <BarChartUserRoles />

        <div>
          <DeleteRequestsLineChart />
        </div>     
      </div>

      <div className="mt-5 flex justify-between gap-2">
        <div className="w-[50%]">
          <ChartPieApplicationStatus />
        </div>

        <div className="w-[70%]">
          <ChartBarJobsPerCategory />
        </div>     
      </div>
    </div>
  )
}

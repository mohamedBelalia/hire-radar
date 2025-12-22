"use client"

import { useEffect, useState } from "react"
import { TrendingUp } from "lucide-react"
import { BarChart, Bar, CartesianGrid, XAxis, Cell } from "recharts"

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
import { getUserRoles } from "@/services/admin"
import { getToken } from "@/lib"

const roleColors: Record<string, string> = {
  admin: "var(--color-admin)",
  employer: "var(--color-employer)",
  candidate: "var(--color-candidate)",
  other: "var(--color-other)",
}

export const chartConfig: ChartConfig = {
  users: { label: "Users", color: "var(--chart-1)" },
  admin: { label: "Admin", color: roleColors.admin },
  employer: { label: "Employer", color: roleColors.employer },
  candidate: { label: "Candidate", color: roleColors.candidate },
  other: { label: "Other", color: roleColors.other },
}

export function BarChartUserRoles() {
  const [data, setData] = useState<
    { role: string; users: number; fill: string }[]
  >([])

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await getUserRoles(getToken())
        
        const formattedData = res.data.map((item: { browser: string; visitors: number }) => {
          const roleKey = item.browser.toLowerCase()
          return {
            role: item.browser,
            users: item.visitors,
            fill: roleColors[roleKey] || roleColors.other,
          }
        })

        setData(formattedData)
      } catch (error) {
        console.error("Error fetching user roles:", error)
      }
    }

    fetchData()
  }, [])

  return (
    <Card>
      <CardHeader>
        <CardTitle>User Roles Distribution</CardTitle>
        <CardDescription>Admins, Employers, and Candidates</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart data={data} margin={{ left: 12, right: 12 }}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="role"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey="users" fill="var(--color-users)">
              {data.map((entry) => (
                <Cell key={entry.role} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 leading-none font-medium">
          User roles overview <TrendingUp className="h-4 w-4" />
        </div>
        <div className="text-muted-foreground leading-none">
          Showing total users by role
        </div>
      </CardFooter>
    </Card>
  )
}

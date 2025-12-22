"use client"

import { useEffect, useState } from "react"
import { TrendingUp } from "lucide-react"
import { Pie, PieChart, Cell } from "recharts"

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

// Role-based colors
const roleColors: Record<string, string> = {
  admin: "var(--color-admin)",
  employer: "var(--color-employer)",
  candidate: "var(--color-candidate)",
  other: "var(--color-other)",
}

// Chart config for labels
export const chartConfig: ChartConfig = {
  visitors: { label: "Users" },
  admin: { label: "Admin", color: roleColors.admin },
  employer: { label: "Employer", color: roleColors.employer },
  candidate: { label: "Candidate", color: roleColors.candidate },
  other: { label: "Other", color: roleColors.other },
}

export function ChartPieRoles() {
  const [data, setData] = useState<
    { browser: string; visitors: number }[]
  >([])

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await getUserRoles(getToken())
        setData(res.data)
      } catch (error) {
        console.error("Error fetching chart data:", error)
      }
    }

    fetchData()
  }, [])

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>User Roles Distribution</CardTitle>
        <CardDescription>Admins, Employers, and Candidates</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="[&_.recharts-pie-label-text]:fill-foreground mx-auto aspect-square max-h-[250px] pb-0"
        >
          <PieChart>
            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
            <Pie data={data} dataKey="visitors" label nameKey="browser" />
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 leading-none font-medium">
          User roles overview <TrendingUp className="h-4 w-4" />
        </div>
        <div className="text-muted-foreground leading-none">
          Showing total users by role
        </div>
      </CardFooter>
    </Card>
  )
}

"use client"

import * as React from "react"
import { TrendingUp } from "lucide-react"
import { Label, Pie, PieChart } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
const chartData = [
  { hostel: "Faith", students: 300, fill: "#FF69B4" },
  { hostel: "Barnabas", students: 450, fill: "#34A85A" },
  { hostel: "Male Annex", students: 187, fill: "#6495ED" },
  { hostel: "Female Annex", students: 273, fill: "#FFC107" },
  { hostel: "new", students: 190, fill: "#8BC34A" },
];
const chartConfig = {
  students: {
    label: "students",
  },
  Faith: {
    label: "Faith",
    color: "hsl(var(--chart-1))",
  },
  Barnabas: {
    label: "Barnsbas",
    color: "hsl(var(--chart-2))",
  },
  Maleannex: {
    label: "male annex",
    color: "hsl(var(--chart-3))",
  },
  Femaleannex: {
    label: "FEmale Annex",
    color: "hsl(var(--chart-4))",
  },
  New: {
    label: "new",
    color: "hsl(var(--chart-5))",
  },
} satisfies ChartConfig

export function Piechart() {
  const totalstudents = React.useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.students, 0)
  }, [])

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Pie Chart - Donut with Text</CardTitle>
        <CardDescription>January - december 2024</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="students"
              nameKey="hostel"
              innerRadius={60}
              strokeWidth={5}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {totalstudents.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          students
                        </tspan>
                      </text>
                    )
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing total students for the last 12 months
        </div>
      </CardFooter>
    </Card>
  )
}

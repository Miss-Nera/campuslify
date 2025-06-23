"use client"

import { TrendingUp } from "lucide-react"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"

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
  { month: "January", er: 186, sr: 80 },
  { month: "February", er: 305, sr: 200 },
  { month: "March", er: 237, sr: 120 },
  { month: "April", er: 73, sr: 190 },
  { month: "May", er: 209, sr: 130 },
  { month: "June", er: 214, sr: 140 },
]

const chartConfig = {
  er: {
    label: "Excecutive room",
    color: "hsl(var(--chart-1))",
  },
  sr: {
    label: "Standard Room",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig

export function Barchart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Bar Chart - Multiple</CardTitle>
        <CardDescription>January - June 2024</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dashed" />}
            />
            <Bar dataKey="er" fill="#0000ff" radius={4} />
            <Bar dataKey="sr" fill="#ffa500" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing total students for the last 6 months
        </div>
      </CardFooter>
    </Card>
  )
}

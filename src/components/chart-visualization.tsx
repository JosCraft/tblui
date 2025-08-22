"use client"

import { useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  PieChart,
  Pie,
  LineChart,
  Line,
} from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { TrendingUp, BarChart3, PieChartIcon, LineChartIcon } from "lucide-react"
import type { ChartVisualizationProps } from "@/interfaces/chart-visualization"

export function ChartVisualization({ data, rowColumns, valueColumns }: ChartVisualizationProps) {
  const chartData = useMemo(() => {
    if (rowColumns.length === 0 || valueColumns.length === 0 || !valueColumns.every((col) => col && col.id)) return []

    const aggregated: { [key: string]: any } = {}

    data.forEach((row) => {
      const key =
        rowColumns.length > 0
          ? rowColumns
              .filter((col) => col && col.id)
              .map((col) => row[col.id])
              .join(" - ")
          : "Total"

      if (!aggregated[key]) {
        aggregated[key] = { name: key }
        valueColumns
          .filter((col) => col && col.id)
          .forEach((col) => {
            aggregated[key][col.id] = 0
          })
      }

      valueColumns
        .filter((col) => col && col.id)
        .forEach((col) => {
          aggregated[key][col.id] += Number(row[col.id]) || 0
        })
    })

    return Object.values(aggregated)
  }, [rowColumns, valueColumns, data])

  const colors = ["#8884d8", "#82ca9d", "#ffc658", "#ff7300", "#00ff00"]

  if (chartData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Visualizaciones
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-[300px] text-muted-foreground">
            Selecciona campos de filas y datos para generar gráficos
          </div>
        </CardContent>
      </Card>
    )
  }

  const validValueColumns = valueColumns.filter((col) => col && col.id && col.name)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5" />
          Visualizaciones
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="bar" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="bar" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Barras
            </TabsTrigger>
            <TabsTrigger value="pie" className="flex items-center gap-2">
              <PieChartIcon className="w-4 h-4" />
              Circular
            </TabsTrigger>
            <TabsTrigger value="line" className="flex items-center gap-2">
              <LineChartIcon className="w-4 h-4" />
              Líneas
            </TabsTrigger>
          </TabsList>

          <TabsContent value="bar" className="mt-6">
            <div className="w-full overflow-hidden">
              <ChartContainer
                config={{
                  ...Object.fromEntries(
                    validValueColumns.map((col, index) => [
                      col.id,
                      {
                        label: col.name,
                        color: colors[index % colors.length],
                      },
                    ]),
                  ),
                }}
                className="h-[400px] w-full"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    {validValueColumns.map((col, index) => (
                      <Bar key={col.id} dataKey={col.id} fill={colors[index % colors.length]} name={col.name} />
                    ))}
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
          </TabsContent>

          <TabsContent value="pie" className="mt-6">
            <div className="w-full overflow-hidden">
              <ChartContainer
                config={{
                  ...Object.fromEntries(
                    chartData.map((item, index) => [
                      item.name,
                      {
                        label: item.name,
                        color: colors[index % colors.length],
                      },
                    ]),
                  ),
                }}
                className="h-[400px] w-full"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                    <Pie
                      data={chartData.map((item, index) => ({
                        name: item.name,
                        value: validValueColumns.reduce((sum, col) => sum + (item[col.id] || 0), 0),
                        fill: colors[index % colors.length],
                      }))}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={120}
                      fill="#8884d8"
                      dataKey="value"
                    />
                  </PieChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
          </TabsContent>

          <TabsContent value="line" className="mt-6">
            <div className="w-full overflow-hidden">
              <ChartContainer
                config={{
                  ...Object.fromEntries(
                    validValueColumns.map((col, index) => [
                      col.id,
                      {
                        label: col.name,
                        color: colors[index % colors.length],
                      },
                    ]),
                  ),
                }}
                className="h-[400px] w-full"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    {validValueColumns.map((col, index) => (
                      <Line
                        key={col.id}
                        type="monotone"
                        dataKey={col.id}
                        stroke={colors[index % colors.length]}
                        strokeWidth={2}
                        name={col.name}
                      />
                    ))}
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

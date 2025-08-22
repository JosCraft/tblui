"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { ColumnFiltersProps } from "@/interfaces/column-filters"

export function ColumnFilters({ data, rowColumns, colColumns, valueColumns, onFiltersChange }: ColumnFiltersProps) {
  const [columnFilters, setColumnFilters] = useState<Record<string, string[]>>({})

  const getActiveColumns = () => {
    const activeColumns = [...rowColumns, ...colColumns, ...valueColumns]
    // Remover duplicados basándose en el id
    const uniqueColumns = activeColumns.filter(
      (column, index, self) => index === self.findIndex((c) => c.id === column.id),
    )
    return uniqueColumns
  }

  // Obtener valores únicos para una columna específica
  const getUniqueValues = (columnKey: string) => {
    const values = data.map((item) => String(item[columnKey] || "")).filter(Boolean)
    return [...new Set(values)].sort()
  }

  // Manejar cambio de filtro para una columna
  const handleFilterChange = (columnKey: string, value: string) => {
    if (value === "todos") {
      // Remover filtro para esta columna
      const newFilters = { ...columnFilters }
      delete newFilters[columnKey]
      setColumnFilters(newFilters)
      onFiltersChange(newFilters)
    } else {
      // Agregar valor al filtro de esta columna
      const currentValues = columnFilters[columnKey] || []
      if (!currentValues.includes(value)) {
        const newFilters = {
          ...columnFilters,
          [columnKey]: [...currentValues, value],
        }
        setColumnFilters(newFilters)
        onFiltersChange(newFilters)
      }
    }
  }

  // Remover un valor específico del filtro
  const removeFilterValue = (columnKey: string, value: string) => {
    const currentValues = columnFilters[columnKey] || []
    const newValues = currentValues.filter((v) => v !== value)

    if (newValues.length === 0) {
      const newFilters = { ...columnFilters }
      delete newFilters[columnKey]
      setColumnFilters(newFilters)
      onFiltersChange(newFilters)
    } else {
      const newFilters = {
        ...columnFilters,
        [columnKey]: newValues,
      }
      setColumnFilters(newFilters)
      onFiltersChange(newFilters)
    }
  }

  // Limpiar todos los filtros
  const clearAllFilters = () => {
    setColumnFilters({})
    onFiltersChange({})
  }

  const activeColumns = getActiveColumns()
  const hasActiveFilters = Object.keys(columnFilters).length > 0

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg">Filtros por Columna</CardTitle>
        {hasActiveFilters && (
          <Button variant="outline" size="sm" onClick={clearAllFilters}>
            Limpiar Filtros
          </Button>
        )}
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {activeColumns.map((column) => {
            const uniqueValues = getUniqueValues(column.id)
            const activeFilters = columnFilters[column.id] || []

            return (
              <div key={column.id} className="space-y-2">
                <label className="text-sm font-medium">{column.name}</label>

                <Select onValueChange={(value) => handleFilterChange(column.id, value)}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Seleccionar..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos</SelectItem>
                    {uniqueValues.map((value) => (
                      <SelectItem key={value} value={value}>
                        {value}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Mostrar filtros activos como badges */}
                {activeFilters.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {activeFilters.map((value) => (
                      <Badge key={value} variant="secondary" className="text-xs">
                        {value}
                        <button
                          onClick={() => removeFilterValue(column.id, value)}
                          className="ml-1 hover:bg-gray-300 rounded-full p-0.5"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}

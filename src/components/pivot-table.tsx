"use client"

import { useMemo, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronRightIcon } from "lucide-react"
import type { Column } from "./column-selector"

interface PivotTableProps {
  data: any[]
  rowColumns: Column[]
  colColumns: Column[]
  valueColumns: Column[]
}

interface GroupedRow {
  id: string
  level: number
  isGroup: boolean
  isExpanded: boolean
  groupKey: string
  groupValue: string
  children?: GroupedRow[]
  data: Record<string, any>
  parentId?: string
}

interface ColumnGroup {
  id: string
  name: string
  children: Array<{
    id: string
    name: string
    accessor: string
  }>
}

export function PivotTable({ data, rowColumns, colColumns, valueColumns }: PivotTableProps) {
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set())

  const toggleGroup = (groupId: string) => {
    setExpandedGroups((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(groupId)) {
        newSet.delete(groupId)
      } else {
        newSet.add(groupId)
      }
      return newSet
    })
  }

  const { tableData, columnGroups } = useMemo(() => {
    if (data.length === 0) return { tableData: [], columnGroups: [] }

    const colGroups: ColumnGroup[] = []

    if (colColumns.length > 0) {
      const colValues = [...new Set(data.map((row) => colColumns.map((col) => row[col.id]).join(" | ")))].sort()

      colValues.forEach((colVal) => {
        colGroups.push({
          id: colVal,
          name: colVal,
          children: valueColumns.map((valCol) => ({
            id: `${colVal}_${valCol.id}`,
            name: valCol.name,
            accessor: `${colVal}_${valCol.id}`,
          })),
        })
      })
    } else {
      colGroups.push({
        id: "total",
        name: "Total",
        children: valueColumns.map((valCol) => ({
          id: valCol.id,
          name: valCol.name,
          accessor: valCol.id,
        })),
      })
    }

    const createHierarchicalData = (columnGroups: ColumnGroup[]): GroupedRow[] => {
      if (rowColumns.length === 0) {
        const flatData = data.map((row, index) => ({
          id: `flat_${index}`,
          level: 0,
          isGroup: false,
          isExpanded: false,
          groupKey: "",
          groupValue: "",
          data: row,
        }))

        const totalRow = createTotalRow(columnGroups, data)
        return [...flatData, totalRow]
      }

      const groupedData = new Map<string, any>()

      data.forEach((row) => {
        let currentLevel = groupedData
        let currentPath = ""

        rowColumns.forEach((col, colIndex) => {
          const value = row[col.id]
          currentPath += (currentPath ? "|" : "") + value

          if (!currentLevel.has(value)) {
            currentLevel.set(value, {
              groupKey: currentPath,
              groupValue: value,
              level: colIndex,
              children: new Map(),
              data: {},
              rows: [],
            })
          }

          currentLevel.get(value).rows.push(row)
          currentLevel = currentLevel.get(value).children
        })
      })

      const convertToTree = (
        map: Map<string, any>,
        level: number,
        columnGroups: ColumnGroup[],
        parentId = "",
      ): GroupedRow[] => {
        const result: GroupedRow[] = []

        map.forEach((group, key) => {
          const groupId = parentId ? `${parentId}_${key}` : key

          const groupTotals: Record<string, number> = {}

          columnGroups.forEach((colGroup) => {
            colGroup.children.forEach((col) => {
              const accessor = col.accessor
              let total = 0

              group.rows.forEach((row: any) => {
                if (colColumns.length > 0) {
                  const colKey = colColumns.map((c) => row[c.id]).join(" | ")
                  if (colKey === colGroup.id) {
                    const valColId = col.accessor.split("_").pop()
                    total += Number.parseFloat(row[valColId]) || 0
                  }
                } else {
                  total += Number.parseFloat(row[col.accessor]) || 0
                }
              })

              groupTotals[accessor] = total
            })
          })

          const hasChildren = level < rowColumns.length - 1 || group.rows.length > 0

          const groupRow: GroupedRow = {
            id: groupId,
            level,
            isGroup: true,
            isExpanded: expandedGroups.has(groupId),
            groupKey: group.groupKey,
            groupValue: group.groupValue,
            data: { ...groupTotals, [`row_${rowColumns[level].id}`]: group.groupValue },
            parentId,
          }

          result.push(groupRow)

          if (groupRow.isExpanded && hasChildren) {
            if (level < rowColumns.length - 1) {
              const children = convertToTree(group.children, level + 1, columnGroups, groupId)
              result.push(...children)

              result.push({
                id: `${groupId}_subtotal`,
                level: level + 1,
                isGroup: true,
                isExpanded: false,
                groupKey: "",
                groupValue: `Subtotal ${group.groupValue}`,
                data: { ...groupTotals, [`row_${rowColumns[level].id}`]: `Subtotal ${group.groupValue}` },
                parentId: groupId,
              })
            } else {
              group.rows.forEach((row: any, index: number) => {
                const rowTotals: Record<string, number> = {}

                columnGroups.forEach((colGroup) => {
                  colGroup.children.forEach((col) => {
                    const accessor = col.accessor

                    if (colColumns.length > 0) {
                      const colKey = colColumns.map((c) => row[c.id]).join(" | ")
                      if (colKey === colGroup.id) {
                        const valColId = col.accessor.split("_").pop()
                        rowTotals[accessor] = Number.parseFloat(row[valColId]) || 0
                      } else {
                        rowTotals[accessor] = 0
                      }
                    } else {
                      rowTotals[accessor] = Number.parseFloat(row[col.accessor]) || 0
                    }
                  })
                })

                result.push({
                  id: `${groupId}_row_${index}`,
                  level: level + 1,
                  isGroup: false,
                  isExpanded: false,
                  groupKey: "",
                  groupValue: `${row[rowColumns[level].id]} - Detalle`,
                  data: {
                    ...rowTotals,
                    ...Object.fromEntries(rowColumns.map((col) => [`row_${col.id}`, row[col.id]])),
                  },
                  parentId: groupId,
                })
              })

              result.push({
                id: `${groupId}_subtotal`,
                level: level + 1,
                isGroup: true,
                isExpanded: false,
                groupKey: "",
                groupValue: `Subtotal ${group.groupValue}`,
                data: { ...groupTotals, [`row_${rowColumns[level].id}`]: `Subtotal ${group.groupValue}` },
                parentId: groupId,
              })
            }
          }
        })

        return result
      }

      const hierarchicalData = convertToTree(groupedData, 0, colGroups)

      const totalRow = createTotalRow(colGroups, data)
      return [...hierarchicalData, totalRow]
    }

    const createTotalRow = (columnGroups: ColumnGroup[], data: any[]): GroupedRow => {
      const totalData: Record<string, number> = {}

      columnGroups.forEach((colGroup) => {
        colGroup.children.forEach((col) => {
          const accessor = col.accessor
          let total = 0

          data.forEach((row) => {
            if (colColumns.length > 0) {
              const colKey = colColumns.map((c) => row[c.id]).join(" | ")
              if (colKey === colGroup.id) {
                const valColId = col.accessor.split("_").pop()
                total += Number.parseFloat(row[valColId]) || 0
              }
            } else {
              total += Number.parseFloat(row[col.accessor]) || 0
            }
          })

          totalData[accessor] = total
        })
      })

      return {
        id: "total_row",
        level: 0,
        isGroup: true,
        isExpanded: false,
        groupKey: "TOTAL",
        groupValue: "TOTAL GENERAL",
        data: totalData,
      }
    }

    return { tableData: createHierarchicalData(colGroups), columnGroups: colGroups }
  }, [data, rowColumns, colColumns, valueColumns, expandedGroups])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tabla Pivotable</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {rowColumns.length === 0 && colColumns.length === 0 && valueColumns.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Arrastra columnas a las secciones de Filas, Columnas o Datos para crear la tabla pivotable
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  {columnGroups.length > 1 && (
                    <tr className="bg-blue-200">
                      {rowColumns.length > 0 && (
                        <th key="hierarchy" className="border border-gray-300 p-2 text-left font-semibold">
                          {rowColumns.map((col) => col.name).join(" / ")}
                        </th>
                      )}
                      {columnGroups.map((colGroup) => (
                        <th
                          key={colGroup.id}
                          colSpan={colGroup.children.length}
                          className="border border-gray-300 p-2 text-center font-semibold bg-blue-300"
                        >
                          {colGroup.name}
                        </th>
                      ))}
                    </tr>
                  )}

                  <tr className="bg-blue-100">
                    <th className="border border-gray-300 p-2 text-left font-semibold">
                      {rowColumns.length > 0 ? rowColumns.map((col) => col.name).join(" / ") : "Datos"}
                    </th>
                    {columnGroups.map((colGroup) =>
                      colGroup.children.map((col) => (
                        <th key={col.id} className="border border-gray-300 p-2 text-center font-semibold">
                          {col.name}
                        </th>
                      )),
                    )}
                  </tr>
                </thead>
                <tbody>
                  {tableData.map((rowData, index) => {
                    const hasExpandableChildren =
                      rowData.isGroup &&
                      (rowData.level < rowColumns.length - 1 ||
                        (rowData.level === rowColumns.length - 1 &&
                          tableData.some((item) => item.parentId === rowData.id && !item.isGroup)))

                    const isSubtotal = rowData.id.includes("_subtotal")

                    return (
                      <tr
                        key={rowData.id}
                        className={`border-b hover:bg-gray-50 ${
                          isSubtotal
                            ? "bg-blue-200 font-bold border-t-2 border-blue-400"
                            : rowData.isGroup
                              ? "bg-blue-50"
                              : ""
                        } ${rowData.id === "total_row" ? "bg-green-100 font-bold border-t-2 border-green-500" : ""}`}
                      >
                        <td className="border border-gray-300 p-2">
                          <div
                            className={`flex items-center gap-2 ${
                              isSubtotal
                                ? "font-semibold bg-blue-200 border-t-2 border-blue-400"
                                : rowData.isGroup
                                  ? "font-semibold bg-blue-100"
                                  : ""
                            }`}
                            style={{ paddingLeft: `${rowData.level * 20}px` }}
                          >
                            {hasExpandableChildren && (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-4 w-4 p-0"
                                onClick={() => toggleGroup(rowData.id)}
                              >
                                {rowData.isExpanded ? (
                                  <ChevronDown className="h-3 w-3" />
                                ) : (
                                  <ChevronRightIcon className="h-3 w-3" />
                                )}
                              </Button>
                            )}
                            <span>{rowData.groupValue || `Fila ${index + 1}`}</span>
                          </div>
                        </td>

                        {columnGroups.map((colGroup) =>
                          colGroup.children.map((col) => {
                            const value = rowData.data[col.accessor] || 0
                            const cellClass = isSubtotal
                              ? "text-right font-mono bg-blue-200 font-bold border-t-2 border-blue-400"
                              : rowData.isGroup
                                ? "bg-blue-100 font-semibold text-right font-mono"
                                : "text-right font-mono"

                            return (
                              <td key={col.id} className="border border-gray-300 p-2">
                                <div className={cellClass}>{value.toLocaleString()}</div>
                              </td>
                            )
                          }),
                        )}
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

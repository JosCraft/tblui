"use client"

import { useMemo, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronRightIcon } from "lucide-react"
import type { PivotTableProps, GroupedRow, ColumnGroup, Header } from "@/interfaces/pivot-table"

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

  const { tableData, columnGroups, columnHeaders } = useMemo(() => {
    if (data.length === 0) return { tableData: [], columnGroups: [], columnHeaders: [] }

    console.log("[v0] Datos recibidos:", data.length, "registros")
    console.log(
      "[v0] Columnas de fila:",
      rowColumns.map((c) => c.name),
    )
    console.log(
      "[v0] Columnas de columna:",
      colColumns.map((c) => c.name),
    )
    console.log(
      "[v0] Columnas de valor:",
      valueColumns.map((c) => c.name),
    )

const createColumnHierarchy = (): { groups: ColumnGroup[]; headers: Header[] } => {
      if (colColumns.length === 0) {
return {
          groups: [
            {
              id: "total",
              name: "Total",
              children: valueColumns.map((valCol) => ({
                id: valCol.id,
                name: valCol.name,
                accessor: valCol.id,
              })),
            },
          ],
          headers: [],
        }
      }

      // Crear todas las combinaciones únicas de valores de columnas
type ColumnNode = { value: string; path: string[]; children: Map<string, ColumnNode>; level: number }

const columnCombinations: Map<string, ColumnNode> = new Map()

      data.forEach((row) => {
        let currentLevel = columnCombinations
const path: string[] = []

        colColumns.forEach((col, index) => {
          const value = row[col.id]
          path.push(value)

          if (!currentLevel.has(value)) {
            currentLevel.set(value, {
              value,
              path: [...path],
              children: new Map(),
              level: index,
            })
          }

currentLevel = currentLevel.get(value)!.children
        })
      })

      // Convertir la estructura en grupos de columnas planos
const flattenColumnGroups = (map: Map<string, ColumnNode>, level = 0, parentPath: string[] = []): ColumnGroup[] => {
const groups: ColumnGroup[] = []

        map.forEach((item, key) => {
          const currentPath = [...parentPath, key]

          if (level === colColumns.length - 1) {
            // Último nivel - crear columnas para cada valor
groups.push({
              id: currentPath.join(" | "),
              name: key,
              children: valueColumns.map((valCol) => ({
                id: `${currentPath.join("_")}_${valCol.id}`,
                name: valCol.name,
                accessor: `${currentPath.join("_")}_${valCol.id}`,
              })),
            })
          } else {
            // Niveles intermedios - continuar recursión
            const childGroups = flattenColumnGroups(item.children, level + 1, currentPath)
            groups.push(...childGroups)
          }
        })

        return groups
      }

      // Crear encabezados jerárquicos
const createHeaders = (map: Map<string, ColumnNode>, level = 0, parentPath: string[] = []): Header[] => {
const headers: Header[] = []

map.forEach((item: ColumnNode, key: string) => {
          const currentPath = [...parentPath, key]

          if (level === colColumns.length - 1) {
            // Último nivel
headers.push({
              name: key,
              accessor: `${currentPath.join("_")}_GROUP`,
              colSpan: valueColumns.length,
              children: valueColumns.map((valCol) => ({
                name: valCol.name,
                accessor: `${currentPath.join("_")}_${valCol.id}`,
                colSpan: 1,
              })),
            })
          } else {
            // Calcular colSpan basado en los hijos
const childHeaders: Header[] = createHeaders(item.children, level + 1, currentPath)
            const totalColSpan = childHeaders.reduce((sum, child) => sum + (child.colSpan || 1), 0)

headers.push({
              name: key,
              accessor: `${currentPath.join("_")}_GROUP`,
              colSpan: totalColSpan,
              children: childHeaders,
            })
          }
        })

        return headers
      }

      const groups = flattenColumnGroups(columnCombinations)
      const headerStructure = createHeaders(columnCombinations)

      console.log("[v0] Grupos de columnas creados:", groups.length)
      console.log("[v0] Estructura de encabezados:", headerStructure)

      return { groups, headers: headerStructure }
    }

    const { groups: colGroups, headers: columnHeaderStructure } = createColumnHierarchy()

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
const valColId = col.accessor.split("_").pop() as string
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
const valColId = col.accessor.split("_").pop() as string
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
const valColId = col.accessor.split("_").pop() as string
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

    return {
      tableData: createHierarchicalData(colGroups),
      columnGroups: colGroups,
      columnHeaders: columnHeaderStructure,
    }
  }, [data, rowColumns, colColumns, valueColumns, expandedGroups])

  const renderColumnHeaders = () => {
    if (colColumns.length === 0) {
      return (
        <tr>
          <th className="border bg-primary text-primary-foreground p-2 text-left font-semibold">
            {rowColumns.length > 0 ? rowColumns.map((col) => col.name).join(" / ") : "Datos"}
          </th>
          {valueColumns.map((col) => (
            <th key={col.id} className="border bg-primary text-primary-foreground p-2 text-center font-semibold">
              {col.name}
            </th>
          ))}
        </tr>
      )
    }

const renderHeaderLevel = (headers: Header[], level = 0) => {
      return (
        <tr>
          {level === 0 && (
            <th
              rowSpan={colColumns.length + 1}
              className="border bg-primary text-primary-foreground p-2 text-left font-semibold"
            >
              {rowColumns.length > 0 ? rowColumns.map((col) => col.name).join(" / ") : "Datos"}
            </th>
          )}
{headers.map((header: Header, index: number) => (
            <th
              key={`${level}_${index}`}
              colSpan={header.colSpan}
              className={`border p-2 text-center font-semibold ${
                level === 0
                  ? "bg-primary text-primary-foreground"
                  : level === 1
                    ? "bg-secondary text-secondary-foreground"
                    : "bg-muted text-muted-foreground"
              }`}
            >
              {header.name}
            </th>
          ))}
        </tr>
      )
    }

const getAllLevels = (headers: Header[], currentLevel = 0, allLevels: Header[][] = []) => {
      if (!allLevels[currentLevel]) {
allLevels[currentLevel] = [] as Header[]
      }

headers.forEach((header: Header) => {
        allLevels[currentLevel].push(header)
        if (header.children && header.children.length > 0) {
          getAllLevels(header.children, currentLevel + 1, allLevels)
        }
      })

      return allLevels
    }

    const allLevels = getAllLevels(columnHeaders)

    return allLevels.map((levelHeaders, level) => renderHeaderLevel(levelHeaders, level))
  }

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
                <thead>{renderColumnHeaders()}</thead>
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
                        className={`border-b hover:bg-muted/50 ${
                          isSubtotal ? "font-bold border-t-2" : rowData.isGroup ? "" : ""
                        } ${rowData.id === "total_row" ? "font-bold border-t-2" : ""}`}
                      >
                        <td
                          className={`border p-2 ${
                            rowData.id === "total_row"
                              ? "bg-accent text-accent-foreground"
                              : isSubtotal
                                ? "bg-secondary text-secondary-foreground"
                                : rowData.isGroup && rowData.level === 0
                                  ? "bg-muted text-muted-foreground"
                                  : ""
                          }`}
                        >
                          <div
                            className={`flex items-center gap-2 ${
                              isSubtotal ? "font-semibold" : rowData.isGroup ? "font-semibold" : ""
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
                          colGroup.children.map((col: ColumnGroup["children"][number]) => {
                            const value = rowData.data[col.accessor] || 0
                            const cellClass = isSubtotal
                              ? "text-right font-mono font-bold"
                              : rowData.isGroup
                                ? "font-semibold text-right font-mono"
                                : "text-right font-mono"

                            return (
                              <td
                                key={col.id}
                                className={`border p-2 ${
                                  rowData.id === "total_row"
                                    ? "bg-accent text-accent-foreground"
                                    : isSubtotal
                                      ? "bg-secondary text-secondary-foreground"
                                      : rowData.isGroup && rowData.level === 0
                                        ? "bg-muted text-muted-foreground"
                                        : ""
                                }`}
                              >
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

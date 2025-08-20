"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DragDropContext, Droppable, Draggable, type DropResult } from "@hello-pangea/dnd"
import { RotateCcw } from "lucide-react"

export type Column = {
  id: string
  name: string
  type: "dimension" | "measure"
}

interface ColumnSelectorProps {
  availableColumns: Column[]
  rowColumns: Column[]
  colColumns: Column[]
  valueColumns: Column[]
  onColumnsChange: (type: string, columns: Column[]) => void
  onReset: () => void
}

export function ColumnSelector({
  availableColumns,
  rowColumns,
  colColumns,
  valueColumns,
  onColumnsChange,
  onReset,
}: ColumnSelectorProps) {
  const usedColumnIds = new Set([
    ...rowColumns.map((col) => col.id),
    ...colColumns.map((col) => col.id),
    ...valueColumns.map((col) => col.id),
  ])

  const unusedColumns = availableColumns.filter((col) => !usedColumnIds.has(col.id))

  const handleDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result

    if (!destination) return

    const draggedColumn = availableColumns.find((col) => col.id === draggableId)
    if (!draggedColumn) return

    // Remove from source
    const sourceColumns = getColumnsByType(source.droppableId)
    const newSourceColumns = sourceColumns.filter((col) => col.id !== draggableId)
    onColumnsChange(source.droppableId, newSourceColumns)

    // Add to destination
    const destColumns = getColumnsByType(destination.droppableId)
    const newDestColumns = [...destColumns]
    newDestColumns.splice(destination.index, 0, draggedColumn)
    onColumnsChange(destination.droppableId, newDestColumns)
  }

  const getColumnsByType = (type: string): Column[] => {
    switch (type) {
      case "rows":
        return rowColumns
      case "columns":
        return colColumns
      case "values":
        return valueColumns
      case "available":
        return unusedColumns
      default:
        return []
    }
  }

  const DropZone = ({
    id,
    title,
    columns,
    className = "",
  }: {
    id: string
    title: string
    columns: Column[]
    className?: string
  }) => (
    <Card className={className}>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <Droppable droppableId={id}>
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className={`min-h-[80px] p-3 border-2 border-dashed rounded-lg transition-colors ${
                snapshot.isDraggingOver ? "border-primary bg-primary/5" : "border-border"
              }`}
            >
              {columns.map((column, index) => (
                <Draggable key={column.id} draggableId={column.id} index={index}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className={`mb-2 ${snapshot.isDragging ? "opacity-50" : ""}`}
                    >
                      <Badge variant={column.type === "dimension" ? "default" : "secondary"} className="cursor-move">
                        {column.name}
                      </Badge>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
              {columns.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">Arrastra campos aquí</p>
              )}
            </div>
          )}
        </Droppable>
      </CardContent>
    </Card>
  )

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="space-y-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Campos Disponibles</CardTitle>
            <Button onClick={onReset} variant="outline" size="sm">
              <RotateCcw className="w-4 h-4 mr-2" />
              Resetear
            </Button>
          </CardHeader>
          <CardContent>
            <Droppable droppableId="available" direction="horizontal">
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={`flex flex-wrap gap-2 min-h-[60px] p-4 border-2 border-dashed rounded-lg transition-colors ${
                    snapshot.isDraggingOver ? "border-primary bg-primary/5" : "border-border"
                  }`}
                >
                  {unusedColumns.map((column, index) => (
                    <Draggable key={column.id} draggableId={column.id} index={index}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className={snapshot.isDragging ? "opacity-50" : ""}
                        >
                          <Badge
                            variant={column.type === "dimension" ? "default" : "secondary"}
                            className="cursor-move"
                          >
                            {column.name}
                          </Badge>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                  {unusedColumns.length === 0 && (
                    <p className="text-sm text-muted-foreground">Todos los campos están en uso</p>
                  )}
                </div>
              )}
            </Droppable>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <DropZone id="rows" title="Filas" columns={rowColumns} />
          <DropZone id="columns" title="Columnas" columns={colColumns} />
          <DropZone id="values" title="Datos" columns={valueColumns} />
        </div>
      </div>
    </DragDropContext>
  )
}

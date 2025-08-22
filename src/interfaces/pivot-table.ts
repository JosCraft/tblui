import type { Column } from '@/interfaces/column'

export interface PivotTableProps {
  data: any[]
  rowColumns: Column[]
  colColumns: Column[]
  valueColumns: Column[]
}

export interface GroupedRow {
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

export interface ColumnGroup {
  id: string
  name: string
  children: Array<{
    id: string
    name: string
    accessor: string
  }>
}

export interface Header {
  name: string
  accessor: string
  colSpan: number
  children?: Header[]
}


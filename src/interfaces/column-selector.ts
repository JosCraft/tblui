import type { Column } from '@/interfaces/column'

export interface ColumnSelectorProps {
  availableColumns: Column[]
  rowColumns: Column[]
  colColumns: Column[]
  valueColumns: Column[]
  onColumnsChange: (type: string, columns: Column[]) => void
  onReset: () => void
}


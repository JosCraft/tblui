import type { Column } from '@/interfaces/column'

export interface ColumnFiltersProps {
  data: any[]
  rowColumns: Column[]
  colColumns: Column[]
  valueColumns: Column[]
  onFiltersChange: (filters: Record<string, string[]>) => void
}


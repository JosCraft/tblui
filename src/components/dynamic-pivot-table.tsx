"use client"

import { useState } from "react"
import { FilterHeader } from "./filter-header"
import { ColumnSelector } from "./column-selector"
import { ColumnFilters } from "./column-filters"
import type { Column } from "@/interfaces/column"
import { PivotTable } from "./pivot-table"
import { ChartVisualization } from "./chart-visualization"

const sampleData: Record<string, any>[] = [
  {
    id: 1,
    cod_form: "302",
    gestion: "2024",
    mes: "1",
    sedes: "CHUQUISACA",
    provincia: "OROPEZA",
    municipio: "SUCRE",
    establecimiento: "C.S JUANA AZURDUY DE PADILLA",
    formulario: "VIGILANCIA EPIDEMIOLÓGICA",
    variable: "COVID-19",
    subvariable: "60 años y más",
    totalv: 2,
    totalm: 0,
    totalg: 2,
  },
  {
    id: 2,
    cod_form: "302",
    gestion: "2024",
    mes: "1",
    sedes: "LA PAZ",
    provincia: "MURILLO",
    municipio: "LA PAZ",
    establecimiento: "HOSPITAL DEL NIÑO",
    formulario: "VIGILANCIA EPIDEMIOLÓGICA",
    variable: "DENGUE",
    subvariable: "20-39 años",
    totalv: 5,
    totalm: 3,
    totalg: 8,
  },
  {
    id: 3,
    cod_form: "302",
    gestion: "2024",
    mes: "2",
    sedes: "SANTA CRUZ",
    provincia: "ANDRÉS IBÁÑEZ",
    municipio: "SANTA CRUZ",
    establecimiento: "HOSPITAL JAPONÉS",
    formulario: "VIGILANCIA EPIDEMIOLÓGICA",
    variable: "MALARIA",
    subvariable: "40-59 años",
    totalv: 1,
    totalm: 2,
    totalg: 3,
  },
  {
    id: 4,
    cod_form: "302",
    gestion: "2024",
    mes: "2",
    sedes: "COCHABAMBA",
    provincia: "CERCADO",
    municipio: "COCHABAMBA",
    establecimiento: "HOSPITAL VIEDMA",
    formulario: "RECURSOS HUMANOS",
    variable: "PERSONAL MÉDICO",
    subvariable: "Médicos generales",
    totalv: 15,
    totalm: 8,
    totalg: 23,
  },
  {
    id: 5,
    cod_form: "302",
    gestion: "2024",
    mes: "3",
    sedes: "TARIJA",
    provincia: "CERCADO",
    municipio: "TARIJA",
    establecimiento: "HOSPITAL SAN JUAN DE DIOS",
    formulario: "EQUIPAMIENTO",
    variable: "EQUIPOS MÉDICOS",
    subvariable: "Rayos X",
    totalv: 2,
    totalm: 1,
    totalg: 3,
  },
]
const availableColumns: Column[] = [
  { id: "cod_form", name: "Código de Formulario", type: "dimension" },
  { id: "cod_grup", name: "Código de Grupo", type: "dimension" },
  { id: "gestion", name: "Gestión", type: "dimension" },
  { id: "mes", name: "Mes", type: "dimension" },
  { id: "sem", name: "Semana", type: "dimension" },
  { id: "cod_depto", name: "Código de Departamento", type: "dimension" },
  { id: "sedes", name: "Sedes/Departamento", type: "dimension" },
  { id: "provincia", name: "Provincia", type: "dimension" },
  { id: "cod_area", name: "Código de Área", type: "dimension" },
  { id: "red_establ", name: "Red de Establecimiento", type: "dimension" },
  { id: "codmuni", name: "Código de Municipio", type: "dimension" },
  { id: "municipio", name: "Municipio", type: "dimension" },
  { id: "corr_establ", name: "Correlativo Establecimiento", type: "dimension" },
  { id: "estado_est", name: "Estado del Establecimiento", type: "dimension" },
  { id: "establecimiento", name: "Establecimiento", type: "dimension" },
  { id: "ambito", name: "Ámbito", type: "dimension" },
  { id: "nivel", name: "Nivel", type: "dimension" },
  { id: "tipo", name: "Tipo", type: "dimension" },
  { id: "institucion", name: "Institución", type: "dimension" },
  { id: "subsector", name: "Subsector", type: "dimension" },
  { id: "codvariable", name: "Código de Variable", type: "dimension" },
  { id: "codvariable1", name: "Código de Variable 1", type: "dimension" },
  { id: "formulario", name: "Formulario", type: "dimension" },
  { id: "grupo", name: "Grupo", type: "dimension" },
  { id: "orden", name: "Orden", type: "dimension" },
  { id: "variable", name: "Variable", type: "dimension" },
  { id: "subvariable", name: "Subvariable", type: "dimension" },
  { id: "totalv", name: "Total Varones", type: "measure" },
  { id: "totalm", name: "Total Mujeres", type: "measure" },
  { id: "totalg", name: "Total General", type: "measure" },
];

export function DynamicPivotTable() {
const [currentData] = useState(sampleData)
  const [filteredData, setFilteredData] = useState(sampleData)
  const [rowColumns, setRowColumns] = useState<Column[]>([availableColumns[0]]) // Departamento
  const [colColumns, setColColumns] = useState<Column[]>([availableColumns[4]]) // Formulario
  const [valueColumns, setValueColumns] = useState<Column[]>([availableColumns[11]]) // Total General

  const handleFiltersChange = (filters: { departamento: string; formulario: string; variable: string }) => {
    console.log("[v0] Filtros seleccionados:", filters)
    // Los filtros se guardan pero no se aplican automáticamente
    // Esta función se usará después para cargar datos desde la API
  }

  const handleColumnFiltersChange = (filters: Record<string, string[]>) => {
    console.log("[v0] Filtros por columna:", filters)

    if (Object.keys(filters).length === 0) {
      // Sin filtros, mostrar todos los datos
      setFilteredData(currentData)
      return
    }

    // Aplicar filtros
    const filtered = currentData.filter((item) => {
      return Object.entries(filters).every(([columnKey, values]) => {
        const itemValue = String(item[columnKey] || "")
        return values.includes(itemValue)
      })
    })

    setFilteredData(filtered)
  }

  const handleColumnsChange = (type: string, columns: Column[]) => {
    switch (type) {
      case "rows":
        setRowColumns(columns)
        break
      case "columns":
        setColColumns(columns)
        break
      case "values":
        setValueColumns(columns)
        break
    }
  }

  const handleReset = () => {
    setRowColumns([availableColumns[0]])
    setColColumns([availableColumns[4]])
    setValueColumns([availableColumns[11]])
  }

  return (
    <div className="space-y-6">
      <FilterHeader onFiltersChange={handleFiltersChange} />

      <ColumnSelector
        availableColumns={availableColumns}
        rowColumns={rowColumns}
        colColumns={colColumns}
        valueColumns={valueColumns}
        onColumnsChange={handleColumnsChange}
        onReset={handleReset}
      />

      <ColumnFilters
        data={currentData}
        rowColumns={rowColumns}
        colColumns={colColumns}
        valueColumns={valueColumns}
        onFiltersChange={handleColumnFiltersChange}
      />

      <PivotTable data={filteredData} rowColumns={rowColumns} colColumns={colColumns} valueColumns={valueColumns} />

      <ChartVisualization data={filteredData} rowColumns={rowColumns} valueColumns={valueColumns} />
    </div>
  )
}

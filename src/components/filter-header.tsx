"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search } from "lucide-react"

interface FilterHeaderProps {
  onFiltersChange: (filters: { departamento: string; formulario: string; variable: string }) => void
}

export function FilterHeader({ onFiltersChange }: FilterHeaderProps) {
  const [departamento, setDepartamento] = useState("")
  const [formulario, setFormulario] = useState("")
  const [variable, setVariable] = useState("")

  const departamentos = [
    "CHUQUISACA",
    "LA PAZ",
    "COCHABAMBA",
    "ORURO",
    "POTOSÍ",
    "TARIJA",
    "SANTA CRUZ",
    "BENI",
    "PANDO",
  ]

  const formularios = [
    "VIGILANCIA EPIDEMIOLÓGICA",
    "RECURSOS HUMANOS",
    "INFRAESTRUCTURA",
    "EQUIPAMIENTO",
    "MEDICAMENTOS",
  ]

  const variables = ["COVID-19", "DENGUE", "MALARIA", "TUBERCULOSIS", "VIH/SIDA", "CHAGAS"]

  const handleGetData = () => {
    onFiltersChange({ departamento, formulario, variable })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Search className="w-5 h-5" />
          Filtros de Búsqueda
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div className="space-y-2">
            <label className="text-sm font-medium">Departamento</label>
            <Select value={departamento} onValueChange={setDepartamento}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar departamento" />
              </SelectTrigger>
              <SelectContent>
                {departamentos.map((dept) => (
                  <SelectItem key={dept} value={dept}>
                    {dept}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Formulario</label>
            <Select value={formulario} onValueChange={setFormulario}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar formulario" />
              </SelectTrigger>
              <SelectContent>
                {formularios.map((form) => (
                  <SelectItem key={form} value={form}>
                    {form}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Variable</label>
            <Select value={variable} onValueChange={setVariable}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar variable" />
              </SelectTrigger>
              <SelectContent>
                {variables.map((var_item) => (
                  <SelectItem key={var_item} value={var_item}>
                    {var_item}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button onClick={handleGetData} disabled={!departamento || !formulario || !variable} className="w-full">
            Obtener Datos
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

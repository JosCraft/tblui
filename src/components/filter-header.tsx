"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Loader2 } from "lucide-react"
import { useDepartamentos, useFormularios, useVariables } from "@/hooks/useFilterData"

interface FilterHeaderProps {
  onFiltersChange: (filters: { departamento: string; formulario: string; variable: string }) => void
}

export function FilterHeader({ onFiltersChange }: FilterHeaderProps) {
  const [departamento, setDepartamento] = useState("")
  const [formulario, setFormulario] = useState("")
  const [variable, setVariable] = useState("")

  const { departamentos, loading: loadingDepartamentos, error: errorDepartamentos } = useDepartamentos()
  const { formularios, loading: loadingFormularios, error: errorFormularios } = useFormularios()
  const { variables, loading: loadingVariables, error: errorVariables } = useVariables()

  const handleDepartamentoChange = (value: string) => {
    setDepartamento(value)
  }

  const handleFormularioChange = (value: string) => {
    setFormulario(value)
  }

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
            <Select value={departamento} onValueChange={handleDepartamentoChange}>
              <SelectTrigger>
                <SelectValue placeholder={loadingDepartamentos ? "Cargando..." : "Seleccionar departamento"} />
              </SelectTrigger>
              <SelectContent>
                {departamentos.map((dept) => (
                  <SelectItem key={dept.id} value={dept.id}>
                    {dept.nombre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errorDepartamentos && <p className="text-sm text-destructive">{errorDepartamentos}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Formulario</label>
            <Select value={formulario} onValueChange={handleFormularioChange}>
              <SelectTrigger>
                <SelectValue placeholder={loadingFormularios ? "Cargando..." : "Seleccionar formulario"} />
              </SelectTrigger>
              <SelectContent>
                {formularios.map((form) => (
                  <SelectItem key={form.id} value={form.id}>
                    {form.nombre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errorFormularios && <p className="text-sm text-destructive">{errorFormularios}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Variable</label>
            <Select value={variable} onValueChange={setVariable}>
              <SelectTrigger>
                <SelectValue placeholder={loadingVariables ? "Cargando..." : "Seleccionar variable"} />
              </SelectTrigger>
              <SelectContent>
                {variables.map((var_item) => (
                  <SelectItem key={var_item.id} value={var_item.id}>
                    {var_item.nombre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errorVariables && <p className="text-sm text-destructive">{errorVariables}</p>}
          </div>

          <Button
            onClick={handleGetData}
            disabled={loadingDepartamentos || loadingFormularios || loadingVariables}
            className="w-full"
          >
            {(loadingDepartamentos || loadingFormularios || loadingVariables) && (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            )}
            Obtener Datos
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

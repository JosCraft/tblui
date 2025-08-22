"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Loader2 } from "lucide-react"
import { useDepartamentos, useFormularios } from "@/hooks/useFilterData"
import { useGruposByFormularioQuery } from "@/hooks/queries"
import type { FilterHeaderProps } from "@/interfaces/filter-header"

export function FilterHeader({ onFiltersChange }: FilterHeaderProps) {
  const [departamento, setDepartamento] = useState("")
  const [formulario, setFormulario] = useState("")
  const [grupo, setGrupo] = useState("")

  const { departamentos, loading: loadingDepartamentos, error: errorDepartamentos } = useDepartamentos()
  const { formularios, loading: loadingFormularios, error: errorFormularios } = useFormularios()
  
  // Convertir formulario string a number para la query
  const formularioId = formulario ? parseInt(formulario) : undefined
  const { data: grupos, isLoading: loadingGrupos, error: errorGruposQuery } = useGruposByFormularioQuery(formularioId)
  
  const errorGrupos = errorGruposQuery ? 'Error al cargar grupos' : null

  const handleDepartamentoChange = (value: string) => {
    setDepartamento(value)
  }

  const handleFormularioChange = (value: string) => {
    setFormulario(value)
    // Limpiar grupo cuando cambia el formulario
    setGrupo("")
  }

  const handleGetData = () => {
    // Mapear grupo a variable para mantener compatibilidad con la interfaz existente
    onFiltersChange({ departamento, formulario, variable: grupo })
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
{(formularios || []).map((form) => (
                  <SelectItem key={form.id} value={form.id}>
                    {form.nombre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errorFormularios && <p className="text-sm text-destructive">{errorFormularios}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Grupo</label>
            <Select value={grupo} onValueChange={setGrupo} disabled={!formulario}>
              <SelectTrigger>
                <SelectValue placeholder={
                  !formulario 
                    ? "Seleccionar formulario primero" 
                    : loadingGrupos 
                    ? "Cargando..." 
                    : "Seleccionar grupo"
                } />
              </SelectTrigger>
              <SelectContent>
                {(grupos || []).map((grupo_item) => (
                  <SelectItem key={grupo_item.id_grupo} value={grupo_item.id_grupo}>
                    {grupo_item.nombre_grupo}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errorGrupos && <p className="text-sm text-destructive">{errorGrupos}</p>}
          </div>

          <Button
            onClick={handleGetData}
            disabled={loadingDepartamentos || loadingFormularios || loadingGrupos}
            className="w-full"
          >
            {(loadingDepartamentos || loadingFormularios || loadingGrupos) && (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            )}
            Obtener Datos
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

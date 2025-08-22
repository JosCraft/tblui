"use client"

import { useState, useEffect } from "react"
import { apiService, type VariableResponse } from "@/services/api"
import { useDepartamentosQuery, useFormulariosQuery } from "@/hooks/queries"

export function useDepartamentos() {
  const { data, isLoading, error } = useDepartamentosQuery()
  return { departamentos: data ?? [], loading: isLoading, error: error ? 'Error al cargar departamentos' : null }
}

export function useFormularios() {
  const { data, isLoading, error } = useFormulariosQuery()
  return { formularios: data ?? [], loading: isLoading, error: error ? 'Error al cargar formularios' : null }
}

export function useVariables() {
  const [variables, setVariables] = useState<VariableResponse[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchVariables = async () => {
      setLoading(true)
      setError(null)
      try {
        const data = await apiService.getVariables()
        setVariables(data)
      } catch (err) {
        setError("Error al cargar variables")
        console.error("[v0] Error in useVariables:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchVariables()
  }, [])

  return { variables, loading, error }
}

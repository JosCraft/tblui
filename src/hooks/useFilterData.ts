"use client"

import { useState, useEffect } from "react"
import { apiService, type DepartamentoResponse, type FormularioResponse, type VariableResponse } from "@/services/api"

export function useDepartamentos() {
  const [departamentos, setDepartamentos] = useState<DepartamentoResponse[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchDepartamentos = async () => {
      setLoading(true)
      setError(null)
      try {
        const data = await apiService.getDepartamentos()
        setDepartamentos(data)
      } catch (err) {
        setError("Error al cargar departamentos")
        console.error("[v0] Error in useDepartamentos:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchDepartamentos()
  }, [])

  return { departamentos, loading, error }
}

export function useFormularios() {
  const [formularios, setFormularios] = useState<FormularioResponse[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchFormularios = async () => {
      setLoading(true)
      setError(null)
      try {
        const data = await apiService.getFormularios()
        setFormularios(data)
      } catch (err) {
        setError("Error al cargar formularios")
        console.error("[v0] Error in useFormularios:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchFormularios()
  }, [])

  return { formularios, loading, error }
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

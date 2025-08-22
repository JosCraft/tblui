import axios from "axios"

const API_BASE_URL = "http://127.0.0.1:8000"

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
})

export interface DepartamentoResponse {
  id_depto: string
  sede: string
}

export interface FormularioResponse {
  id_formulario: string
  nombre_formulario: string
}

export interface VariableResponse {
  id: string
  nombre: string
}

export interface GrupoResponse {
  id_grupo: string
  nombre_grupo: string
}

export const apiService = {
  // Obtener departamentos
  getDepartamentos: async (): Promise<DepartamentoResponse[]> => {
    try {
      const response = await apiClient.get("/departamentos")
      return response.data
    } catch (error) {
      console.error("[v0] Error fetching departamentos:", error)
      throw error
    }
  },

  // Obtener formularios (puede depender del departamento seleccionado)
  getFormularios: async (departamentoId?: string): Promise<FormularioResponse[]> => {
    try {
      const params = departamentoId ? { departamento_id: departamentoId } : {}
      const response = await apiClient.get("/formularios", { params })
      return response.data
    } catch (error) {
      console.error("[v0] Error fetching formularios:", error)
      throw error
    }
  },

  // Obtener variables (puede depender del formulario seleccionado)
  getVariables: async (formularioId?: string): Promise<VariableResponse[]> => {
    try {
      const params = formularioId ? { formulario_id: formularioId } : {}
      const response = await apiClient.get("/variables", { params })
      return response.data
    } catch (error) {
      console.error("[v0] Error fetching variables:", error)
      throw error
    }
  },

  getGrupos: async (): Promise<GrupoResponse[]> => {
    try {
      const response = await apiClient.get("/grupos")
      return response.data
    } catch (error) {
      console.error("[v0] Error fetching grupos:", error)
      throw error
    }
  }
}

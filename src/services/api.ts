/**
 * Servicio API con tipado completo usando interfaces TypeScript
 * 
 * Cambios aplicados:
 * - Importación de todas las interfaces desde src/interfaces/
 * - Tipado de peticiones axios con genéricos <T>  
 * - Mapeo correcto de campos de respuesta usando las interfaces
 * - Todas las funciones tienen tipos de retorno específicos
 * - Type-safety completo para requests y responses
 */
import axios from "axios"
import type { Departament } from "@/interfaces/departament"
import type { Formulario } from "@/interfaces/formulario"
import type { Variable } from "@/interfaces/variable"
import type { Grupo } from "@/interfaces/grupo"
import type { Provincia } from "@/interfaces/provincia"
import type { Municipio } from "@/interfaces/municipio"
import type { Establecimiento, EstablecimientoAtributo } from "@/interfaces/establecimiento"
import type { RedSalud } from "@/interfaces/red_salud"
import type { SubVariable } from "@/interfaces/sub_variable"

const API_BASE_URL = "http://127.0.0.1:8000"

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
})

// Response interfaces para mapear las respuestas del API
export interface DepartamentoResponse {
  id: string
  nombre: string
}

export interface FormularioResponse {
  id: string
  nombre: string
}

export interface VariableResponse {
  id: string
  nombre: string
}

export interface GrupoResponse {
  id_grupo: string
  nombre_grupo: string
}

export interface ProvinciaResponse { id: string; nombre: string; id_departamento?: string }
export interface MunicipioResponse { id: string; nombre: string; id_provincia?: string; id_departamento?: string }
export interface EstablecimientoResponse { id: string; nombre: string; id_municipio?: string; id_departamento?: string }
export interface EstablecimientoAtributoResponse {
  id: string
  nombre: string
  redS?: number
  provincia?: number
  tipo?: string
  subsector?: string
  institucion?: string
  nivel?: string
}
export interface RedSaludResponse { id: string; nombre: string }
export interface SubvariableResponse { id: string; nombre: string; variable_id?: string }

export const apiService = {
  // Obtener departamentos
  getDepartamentos: async (): Promise<DepartamentoResponse[]> => {
    try {
      const response = await apiClient.get<Departament[]>("/departamentos")
      const raw = response.data
      return raw.map((d) => ({ id: String(d.id_depto ?? d.cod_depto ?? ""), nombre: String(d.sede ?? "") }))
    } catch (error) {
      console.error("[v0] Error fetching departamentos:", error)
      throw error
    }
  },

  // Obtener formularios (puede depender del departamento seleccionado)
  getFormularios: async (departamentoId?: string): Promise<FormularioResponse[]> => {
    try {
      const params = departamentoId ? { departamento_id: departamentoId } : {}
      const response = await apiClient.get<Formulario[]>("/formularios", { params })
      const raw = response.data
      return raw.map((f) => ({ id: String(f.id_formulario ?? ""), nombre: String(f.nombre_formulario ?? "") }))
    } catch (error) {
      console.error("[v0] Error fetching formularios:", error)
      throw error
    }
  },

  // Obtener variables (puede depender del formulario seleccionado)
  getVariables: async (formularioId?: string): Promise<VariableResponse[]> => {
    try {
      const params = formularioId ? { formulario_id: formularioId } : {}
      const response = await apiClient.get<Variable[]>("/variables", { params })
      const raw = response.data
      return raw.map((v) => ({ id: String(v.id_variable ?? ""), nombre: String(v.nombre_variable ?? "") }))
    } catch (error) {
      console.error("[v0] Error fetching variables:", error)
      throw error
    }
  },

  getGrupos: async (): Promise<GrupoResponse[]> => {
    try {
      const response = await apiClient.get<Grupo[]>("/grupos")
      const raw = response.data
      return raw.map((g) => ({ id_grupo: String(g.id_grupo ?? ""), nombre_grupo: String(g.nombre_grupo ?? "") }))
    } catch (error) {
      console.error("[v0] Error fetching grupos:", error)
      throw error
    }
  },

  // Provincias
  getProvincias: async (): Promise<ProvinciaResponse[]> => {
    const { data } = await apiClient.get<Provincia[]>("/provincias")
    return data.map((p) => ({ id: String(p.id_provincia ?? ""), nombre: String(p.nombre_provincia ?? ""), id_departamento: p.id_depto ? String(p.id_depto) : undefined }))
  },
  getProvinciasByDepartamento: async (departament: number): Promise<ProvinciaResponse[]> => {
    const { data } = await apiClient.get<Provincia[]>(`/provincias/departament/${departament}`)
    return data.map((p) => ({ id: String(p.id_provincia ?? ""), nombre: String(p.nombre_provincia ?? ""), id_departamento: p.id_depto ? String(p.id_depto) : undefined }))
  },

  // Municipios
  getMunicipios: async (): Promise<MunicipioResponse[]> => {
    const { data } = await apiClient.get<Municipio[]>("/municipio")
    return data.map((m) => ({ id: String(m.id_municipio ?? ""), nombre: String(m.nombre_municipio ?? ""), id_provincia: m.id_provincia ? String(m.id_provincia) : undefined }))
  },
  getMunicipiosByProvincia: async (provincias: number): Promise<MunicipioResponse[]> => {
    const { data } = await apiClient.get<Municipio[]>(`/municipio/${provincias}`)
    return data.map((m) => ({ id: String(m.id_municipio ?? ""), nombre: String(m.nombre_municipio ?? ""), id_provincia: m.id_provincia ? String(m.id_provincia) : undefined }))
  },
  getMunicipiosByDepartamento: async (departament: number): Promise<MunicipioResponse[]> => {
    const { data } = await apiClient.get<Municipio[]>(`/municipio/departament/${departament}`)
    return data.map((m) => ({ id: String(m.id_municipio ?? ""), nombre: String(m.nombre_municipio ?? "") }))
  },

  // Establecimientos
  getEstablecimientos: async (): Promise<EstablecimientoResponse[]> => {
    const { data } = await apiClient.get<Establecimiento[]>("/establecimiento")
    return data.map((e) => ({ id: String(e.id_establecimiento ?? ""), nombre: String(e.nombre ?? ""), id_municipio: e.id_municipio ? String(e.id_municipio) : undefined }))
  },
  getEstablecimientosByMunicipio: async (municipios: number): Promise<EstablecimientoResponse[]> => {
    const { data } = await apiClient.get<Establecimiento[]>(`/establecimiento/${municipios}`)
    return data.map((e) => ({ id: String(e.id_establecimiento ?? ""), nombre: String(e.nombre ?? ""), id_municipio: e.id_municipio ? String(e.id_municipio) : undefined }))
  },
  getEstablecimientosByDepartamento: async (departament: number): Promise<EstablecimientoResponse[]> => {
    const { data } = await apiClient.get<Establecimiento[]>(`/establecimiento/departament/${departament}`)
    return data.map((e) => ({ id: String(e.id_establecimiento ?? ""), nombre: String(e.nombre ?? "") }))
  },

  // Establecimiento Atributos
  getEstablecimientoAtributos: async (): Promise<EstablecimientoAtributoResponse[]> => {
    const { data } = await apiClient.get<EstablecimientoAtributo[]>("/establecimientoAtributo")
    return data.map((a) => ({ id: String(a.id_atributo ?? ""), nombre: String(a.tipo_establecimiento ?? a.nivel ?? "") }))
  },
  getEstablecimientoAtributosByRed: async (redS: number): Promise<EstablecimientoAtributoResponse[]> => {
    const { data } = await apiClient.get<EstablecimientoAtributo[]>(`/establecimientoAtributo/${redS}`)
    return data.map((a) => ({ id: String(a.id_atributo ?? ""), nombre: String(a.tipo_establecimiento ?? a.nivel ?? ""), redS: a.id_red }))
  },
  getEstablecimientoAtributosByProvincia: async (provincia: number): Promise<EstablecimientoAtributoResponse[]> => {
    const { data } = await apiClient.get<EstablecimientoAtributo[]>(`/establecimientoAtributo/provincia/${provincia}`)
    return data.map((a) => ({ id: String(a.id_atributo ?? ""), nombre: String(a.tipo_establecimiento ?? a.nivel ?? ""), provincia: a.id_provincia }))
  },
  getEstablecimientoAtributosByTipo: async (tipo: string): Promise<EstablecimientoAtributoResponse[]> => {
    const { data } = await apiClient.get<EstablecimientoAtributo[]>(`/establecimientoAtributo/tipo/${tipo}`)
    return data.map((a) => ({ id: String(a.id_atributo ?? ""), nombre: String(a.tipo_establecimiento ?? ""), tipo: a.tipo_establecimiento }))
  },
  getEstablecimientoAtributosBySubsector: async (subsector: string): Promise<EstablecimientoAtributoResponse[]> => {
    const { data } = await apiClient.get<EstablecimientoAtributo[]>(`/establecimientoAtributo/subsector/${subsector}`)
    return data.map((a) => ({ id: String(a.id_atributo ?? ""), nombre: String(a.subsector ?? ""), subsector: a.subsector }))
  },
  getEstablecimientoAtributosByInstitucion: async (institucion: string): Promise<EstablecimientoAtributoResponse[]> => {
    const { data } = await apiClient.get<EstablecimientoAtributo[]>(`/establecimientoAtributo/institucion/${institucion}`)
    return data.map((a) => ({ id: String(a.id_atributo ?? ""), nombre: String(a.institucion ?? ""), institucion: a.institucion }))
  },
  getEstablecimientoAtributosByNivel: async (nivel: string): Promise<EstablecimientoAtributoResponse[]> => {
    const { data } = await apiClient.get<EstablecimientoAtributo[]>(`/establecimientoAtributo/nivel/${nivel}`)
    return data.map((a) => ({ id: String(a.id_atributo ?? ""), nombre: String(a.nivel ?? ""), nivel: a.nivel }))
  },
  getListaNiveles: async (): Promise<string[]> => {
    const { data } = await apiClient.get<string[]>(`/establecimientoAtributo/lista_nivel`)
    return data
  },
  getListaTipos: async (): Promise<string[]> => {
    const { data } = await apiClient.get<string[]>(`/establecimientoAtributo/lista_tipo`)
    return data
  },
  getListaSubsectores: async (): Promise<string[]> => {
    const { data } = await apiClient.get<string[]>(`/establecimientoAtributo/lista_subsector`)
    return data
  },
  getListaInstituciones: async (): Promise<string[]> => {
    const { data } = await apiClient.get<string[]>(`/establecimientoAtributo/lista_institucion`)
    return data
  },

  // Redes de salud
  getRedesSalud: async (): Promise<RedSaludResponse[]> => {
    const { data } = await apiClient.get<RedSalud[]>(`/redes-salud`)
    return data.map((r) => ({ id: String(r.id_red ?? ""), nombre: String(r.nombre_red ?? "") }))
  },

  // Subvariables
  getSubvariables: async (): Promise<SubvariableResponse[]> => {
    const { data } = await apiClient.get<SubVariable[]>(`/subvariables`)
    return data.map((s) => ({ id: String(s.id_subvariable ?? ""), nombre: String(s.nombre_subvariable ?? "") }))
  },

  // Variables extendido
  getSubvariablesByVariable: async (variableId: number): Promise<SubvariableResponse[]> => {
    const { data } = await apiClient.get<SubVariable[]>(`/variables/${variableId}/subvariables`)
    return data.map((s) => ({ id: String(s.id_subvariable ?? ""), nombre: String(s.nombre_subvariable ?? "") }))
  },

  // Formularios extendido
  getGruposByFormulario: async (formularioId: number): Promise<GrupoResponse[]> => {
    const { data } = await apiClient.get<Grupo[]>(`/formularios/${formularioId}/grupos`)
    return data.map((g) => ({ id_grupo: String(g.id_grupo ?? ""), nombre_grupo: String(g.nombre_grupo ?? "") }))
  },

  // Grupos extendido
  getGruposByFormularioAlt: async (formularioId: number): Promise<GrupoResponse[]> => {
    const { data } = await apiClient.get<Grupo[]>(`/grupos/formulario/${formularioId}`)
    return data.map((g) => ({ id_grupo: String(g.id_grupo ?? ""), nombre_grupo: String(g.nombre_grupo ?? "") }))
  },
}

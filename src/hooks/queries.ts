import { useQuery, keepPreviousData } from '@tanstack/react-query'
import { apiService } from '@/services/api'

// 1. Departamentos
export function useDepartamentosQuery() {
  return useQuery({
    queryKey: ['departamentos'],
    queryFn: apiService.getDepartamentos,
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60 * 5,
  })
}

// 2. Provincias
export function useProvinciasQuery() {
  return useQuery({
    queryKey: ['provincias'],
    queryFn: apiService.getProvincias,
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60 * 5,
  })
}

export function useProvinciasByDepartamentoQuery(departament?: number) {
  return useQuery({
    queryKey: ['provincias', 'departamento', departament],
    queryFn: () => apiService.getProvinciasByDepartamento(departament as number),
    enabled: typeof departament === 'number',
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60 * 5,
  })
}

// 3. Municipios
export function useMunicipiosQuery() {
  return useQuery({
    queryKey: ['municipios'],
    queryFn: apiService.getMunicipios,
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60 * 5,
  })
}

export function useMunicipiosByProvinciaQuery(provincias?: number) {
  return useQuery({
    queryKey: ['municipios', 'provincia', provincias],
    queryFn: () => apiService.getMunicipiosByProvincia(provincias as number),
    enabled: typeof provincias === 'number',
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60 * 5,
  })
}

export function useMunicipiosByDepartamentoQuery(departament?: number) {
  return useQuery({
    queryKey: ['municipios', 'departamento', departament],
    queryFn: () => apiService.getMunicipiosByDepartamento(departament as number),
    enabled: typeof departament === 'number',
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60 * 5,
  })
}

// 4. Establecimientos
export function useEstablecimientosQuery() {
  return useQuery({
    queryKey: ['establecimientos'],
    queryFn: apiService.getEstablecimientos,
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60 * 5,
  })
}

export function useEstablecimientosByMunicipioQuery(municipios?: number) {
  return useQuery({
    queryKey: ['establecimientos', 'municipio', municipios],
    queryFn: () => apiService.getEstablecimientosByMunicipio(municipios as number),
    enabled: typeof municipios === 'number',
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60 * 5,
  })
}

export function useEstablecimientosByDepartamentoQuery(departament?: number) {
  return useQuery({
    queryKey: ['establecimientos', 'departamento', departament],
    queryFn: () => apiService.getEstablecimientosByDepartamento(departament as number),
    enabled: typeof departament === 'number',
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60 * 5,
  })
}

// 5. Establecimiento Atributos
export function useEstablecimientoAtributosQuery() {
  return useQuery({
    queryKey: ['establecimientoAtributo'],
    queryFn: apiService.getEstablecimientoAtributos,
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60 * 5,
  })
}

export function useEstablecimientoAtributosByRedQuery(redS?: number) {
  return useQuery({
    queryKey: ['establecimientoAtributo', 'red', redS],
    queryFn: () => apiService.getEstablecimientoAtributosByRed(redS as number),
    enabled: typeof redS === 'number',
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60 * 5,
  })
}

export function useEstablecimientoAtributosByProvinciaQuery(provincia?: number) {
  return useQuery({
    queryKey: ['establecimientoAtributo', 'provincia', provincia],
    queryFn: () => apiService.getEstablecimientoAtributosByProvincia(provincia as number),
    enabled: typeof provincia === 'number',
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60 * 5,
  })
}

export function useEstablecimientoAtributosByTipoQuery(tipo?: string) {
  return useQuery({
    queryKey: ['establecimientoAtributo', 'tipo', tipo],
    queryFn: () => apiService.getEstablecimientoAtributosByTipo(tipo as string),
    enabled: typeof tipo === 'string' && !!tipo,
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60 * 5,
  })
}

export function useEstablecimientoAtributosBySubsectorQuery(subsector?: string) {
  return useQuery({
    queryKey: ['establecimientoAtributo', 'subsector', subsector],
    queryFn: () => apiService.getEstablecimientoAtributosBySubsector(subsector as string),
    enabled: typeof subsector === 'string' && !!subsector,
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60 * 5,
  })
}

export function useEstablecimientoAtributosByInstitucionQuery(institucion?: string) {
  return useQuery({
    queryKey: ['establecimientoAtributo', 'institucion', institucion],
    queryFn: () => apiService.getEstablecimientoAtributosByInstitucion(institucion as string),
    enabled: typeof institucion === 'string' && !!institucion,
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60 * 5,
  })
}

export function useEstablecimientoAtributosByNivelQuery(nivel?: string) {
  return useQuery({
    queryKey: ['establecimientoAtributo', 'nivel', nivel],
    queryFn: () => apiService.getEstablecimientoAtributosByNivel(nivel as string),
    enabled: typeof nivel === 'string' && !!nivel,
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60 * 5,
  })
}

export function useListaNivelesQuery() {
  return useQuery({
    queryKey: ['establecimientoAtributo', 'lista_nivel'],
    queryFn: apiService.getListaNiveles,
    staleTime: 1000 * 60 * 60,
  })
}

export function useListaTiposQuery() {
  return useQuery({
    queryKey: ['establecimientoAtributo', 'lista_tipo'],
    queryFn: apiService.getListaTipos,
    staleTime: 1000 * 60 * 60,
  })
}

export function useListaSubsectoresQuery() {
  return useQuery({
    queryKey: ['establecimientoAtributo', 'lista_subsector'],
    queryFn: apiService.getListaSubsectores,
    staleTime: 1000 * 60 * 60,
  })
}

export function useListaInstitucionesQuery() {
  return useQuery({
    queryKey: ['establecimientoAtributo', 'lista_institucion'],
    queryFn: apiService.getListaInstituciones,
    staleTime: 1000 * 60 * 60,
  })
}

// 6. Redes de Salud
export function useRedesSaludQuery() {
  return useQuery({
    queryKey: ['redes-salud'],
    queryFn: apiService.getRedesSalud,
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60 * 10,
  })
}

// 7. Variables y Subvariables
export function useVariablesQuery() {
  return useQuery({
    queryKey: ['variables'],
    queryFn: () => apiService.getVariables(),
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60 * 10,
  })
}

export function useSubvariablesQuery() {
  return useQuery({
    queryKey: ['subvariables'],
    queryFn: apiService.getSubvariables,
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60 * 10,
  })
}

export function useSubvariablesByVariableQuery(variableId?: number) {
  return useQuery({
    queryKey: ['variables', variableId, 'subvariables'],
    queryFn: () => apiService.getSubvariablesByVariable(variableId as number),
    enabled: typeof variableId === 'number',
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60 * 10,
  })
}

// 8. Formularios y Grupos
export function useFormulariosQuery() {
  return useQuery({
    queryKey: ['formularios'],
    queryFn: () => apiService.getFormularios(),
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60 * 10,
  })
}

export function useGruposByFormularioQuery(formularioId?: number) {
  return useQuery({
    queryKey: ['formularios', formularioId, 'grupos'],
    queryFn: () => apiService.getGruposByFormulario(formularioId as number),
    enabled: typeof formularioId === 'number',
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60 * 10,
  })
}

// 9. Grupos
export function useGruposQuery() {
  return useQuery({
    queryKey: ['grupos'],
    queryFn: apiService.getGrupos,
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60 * 10,
  })
}

export function useGruposByFormularioAltQuery(formularioId?: number) {
  return useQuery({
    queryKey: ['grupos', 'formulario', formularioId],
    queryFn: () => apiService.getGruposByFormularioAlt(formularioId as number),
    enabled: typeof formularioId === 'number',
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60 * 10,
  })
}


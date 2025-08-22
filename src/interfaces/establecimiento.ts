export interface Establecimiento {
  cod_establecimiento: string
  nombre: string
  id_municipio: number
  id_establecimiento: number
}

export interface EstablecimientoAtributo {
  id_establecimiento: number
  id_red: number
  id_provincia: number
  estado_est: string
  ambito: string
  nivel: string
  tipo_establecimiento: string
  institucion: string
  subsector: string
  num_camas: number
  tiene_laboratorio: boolean
  recursos_humanos: string
  id_atributo: number
}

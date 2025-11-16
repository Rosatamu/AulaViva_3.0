import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type RMLData = {
  id: number
  nombres: string | null
  nombre_usuario: string | null
  grado: string | null
  id_estudiante: string | null
  codigo_estudiante: string | null
  sexo: number | null
  peso_pre: number | null
  peso_post: number | null
  talla_pre: number | null
  talla_post: number | null
  imc_pre: number | null
  imc_post: number | null
  leger_pre: number | null
  leger_post: number | null
  fuerza_pre: number | null
  fuerza_post: number | null
  flex_pre: number | null
  flex_post: number | null
  vo2max_pre: number | null
  vo2max_post: number | null
  vo2max_pre_cat: string | null
  vo2max_post_cat: string | null
  sexo_letra: string | null
  grado_num: number | null
  edad_estimada: number | null
  vo2max_dif: number | null
  vo2max_porcambio: number | null
  leger_dif: number | null
  leger_porcambio: number | null
  fuerza_dif: number | null
  fuerza_porcambio: number | null
  flex_dif: number | null
  flex_porcambio: number | null
}
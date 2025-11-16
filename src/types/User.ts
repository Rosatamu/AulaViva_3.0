export interface UserData {
  id: string;
  nombres?: string;
  apellidos?: string;
  name: string;
  age: number;
  weight: number;
  height: number;
  imc: number;
  classification: string;
  energia?: number;
  carbohidratos?: number;
  proteinas?: number;
  actividad_fisica?: number;
  currentLevel: number;
  totalPoints: number;
  achievements: string[];
  // Datos adicionales de RML
  grado?: string | null;
  sexo?: string | null;
  vo2max_pre?: number | null;
  vo2max_post?: number | null;
  leger_pre?: number | null;
  leger_post?: number | null;
  fuerza_pre?: number | null;
  fuerza_post?: number | null;
  flex_pre?: number | null;
  flex_post?: number | null;
  tipo_usuario?: 'estudiante' | 'publico';
}

export interface ApiUserResponse {
  id: string;
  nombres?: string;
  apellidos?: string;
  edad?: number;
  peso?: number;
  talla?: number;
  imc?: number;
  clasificacion?: string;
  energia?: number;
  carbohidratos?: number;
  proteinas?: number;
  actividad_fisica?: number;
  [key: string]: any;
}
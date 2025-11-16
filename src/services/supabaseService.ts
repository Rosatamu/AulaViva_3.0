import { supabase, type RMLData } from '../lib/supabase'
import { UserData } from '../types/User'

export const supabaseService = {
  // Obtener todos los estudiantes
  async getAllStudents(): Promise<RMLData[]> {
    try {
      const { data, error } = await supabase
        .from('rml_datos')
        .select('*')
        .order('nombres', { ascending: true })

      if (error) {
        console.error('Error fetching students:', error)
        throw new Error('Error al cargar estudiantes desde Supabase')
      }

      return data || []
    } catch (error) {
      console.error('Error in getAllStudents:', error)
      throw error
    }
  },

  async getStudentById(studentId: string): Promise<RMLData | null> {
    try {
      // Intentar buscar primero por id_estudiante (columna principal)
      let { data, error } = await supabase
        .from('rml_datos')
        .select('*')
        .eq('id_estudiante', studentId)
        .maybeSingle()

      // Si no se encontró, intentar por codigo_estudiante como respaldo
      if (!data && !error) {
        const result = await supabase
          .from('rml_datos')
          .select('*')
          .eq('codigo_estudiante', studentId)
          .maybeSingle()

        data = result.data
        error = result.error
      }

      if (error) {
        console.error('Error fetching student:', error)
        throw new Error('Error al cargar datos del estudiante')
      }

      if (!data) {
        throw new Error(`Estudiante con código "${studentId}" no encontrado`)
      }

      return data
    } catch (error) {
      console.error('Error in getStudentById:', error)
      throw error
    }
  },

  async getAvailableStudentIds(): Promise<string[]> {
    try {
      const { data, error } = await supabase
        .from('rml_datos')
        .select('id_estudiante, codigo_estudiante')
        .order('id_estudiante', { ascending: true })

      if (error) {
        console.error('Error fetching student IDs:', error)
        return []
      }

      // Priorizar id_estudiante, usar codigo_estudiante como respaldo
      return data.map(item => item.id_estudiante || item.codigo_estudiante).filter(id => id !== null) as string[]
    } catch (error) {
      console.error('Error in getAvailableStudentIds:', error)
      return []
    }
  },

  convertRMLToUserData(rmlData: RMLData): UserData {
    // Calcular edad estimada si no existe
    const age = rmlData.edad_estimada || this.calculateAgeFromGrade(rmlData.grado_num)
    
    // Usar datos más recientes (post si existen, sino pre)
    const weight = rmlData.peso_post || rmlData.peso_pre || 0
    const height = rmlData.talla_post || rmlData.talla_pre || 0
    const imc = rmlData.imc_post || rmlData.imc_pre || 0
    
    // Clasificar IMC según OMS
    const classification = this.classifyIMC(imc, age)
    
    // Calcular requerimientos nutricionales estimados
    const energia = this.calculateEnergyRequirement(weight, height, age, rmlData.sexo_letra || 'M')
    
    return {
      id: rmlData.id_estudiante || rmlData.codigo_estudiante || rmlData.id.toString(),
      nombres: rmlData.nombres || '',
      apellidos: '', // No disponible en rml_datos
      name: rmlData.nombres || `Estudiante ${rmlData.id_estudiante || rmlData.codigo_estudiante || rmlData.id}`,
      age: age,
      weight: weight,
      height: height,
      imc: imc,
      classification: classification,
      energia: energia,
      carbohidratos: Math.round(energia * 0.6 / 4), // 60% de calorías de carbohidratos
      proteinas: Math.round(energia * 0.15 / 4), // 15% de calorías de proteínas
      actividad_fisica: this.estimateActivityLevel(rmlData),
      currentLevel: 1,
      totalPoints: 100,
      achievements: this.generateAchievements(rmlData),
      // Datos adicionales de RML
      grado: rmlData.grado,
      sexo: rmlData.sexo_letra,
      vo2max_pre: rmlData.vo2max_pre,
      vo2max_post: rmlData.vo2max_post,
      leger_pre: rmlData.leger_pre,
      leger_post: rmlData.leger_post,
      fuerza_pre: rmlData.fuerza_pre,
      fuerza_post: rmlData.fuerza_post,
      flex_pre: rmlData.flex_pre,
      flex_post: rmlData.flex_post
    }
  },


  // Calcular edad estimada basada en grado
  calculateAgeFromGrade(gradeNum: number | null): number {
    if (!gradeNum) return 14 // Edad por defecto
    
    // Estimación: grado 6 = 11 años, grado 11 = 16 años
    return Math.max(11, Math.min(17, 5 + gradeNum))
  },

  // Clasificar IMC según OMS para adolescentes
  classifyIMC(imc: number, age: number): string {
    if (imc === 0) return 'Sin datos'
    
    // Clasificación simplificada para adolescentes
    if (imc < 18.5) return 'Bajo peso'
    if (imc < 25) return 'Normal'
    if (imc < 30) return 'Sobrepeso'
    return 'Obesidad'
  },

  // Calcular requerimiento energético estimado
  calculateEnergyRequirement(weight: number, height: number, age: number, sex: string): number {
    if (weight === 0 || height === 0) return 2000 // Valor por defecto
    
    // Fórmula de Harris-Benedict para adolescentes
    let bmr: number
    if (sex === 'M') {
      bmr = 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age)
    } else {
      bmr = 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age)
    }

    return Math.round(bmr * 1.6)
  },

  estimateActivityLevel(rmlData: RMLData): number {
    // Basado en test de Leger y VO2max
    const vo2max = rmlData.vo2max_post || rmlData.vo2max_pre
    const leger = rmlData.leger_post || rmlData.leger_pre
    
    if (vo2max && vo2max > 45) return 5 // Muy activo
    if (vo2max && vo2max > 35) return 4 // Activo
    if (leger && leger > 8) return 3 // Moderadamente activo
    if (leger && leger > 5) return 2 // Poco activo
    return 1 // Sedentario
  },

  // Generar logros basados en datos RML
  generateAchievements(rmlData: RMLData): string[] {
    const achievements: string[] = []
    
    if (rmlData.peso_pre && rmlData.peso_post) {
      achievements.push('Seguimiento Antropométrico Completo')
    }
    
    if (rmlData.vo2max_pre && rmlData.vo2max_post) {
      achievements.push('Evaluación Cardiovascular Completa')
      
      const improvement = (rmlData.vo2max_post - rmlData.vo2max_pre) / rmlData.vo2max_pre * 100
      if (improvement > 5) {
        achievements.push('Mejora Cardiovascular Significativa')
      }
    }
    
    if (rmlData.fuerza_pre && rmlData.fuerza_post) {
      achievements.push('Test de Fuerza Completado')
      
      const improvement = (rmlData.fuerza_post - rmlData.fuerza_pre) / rmlData.fuerza_pre * 100
      if (improvement > 10) {
        achievements.push('Ganancia de Fuerza Notable')
      }
    }
    
    if (rmlData.flex_pre && rmlData.flex_post) {
      achievements.push('Evaluación de Flexibilidad')
    }
    
    const currentIMC = rmlData.imc_post || rmlData.imc_pre
    if (currentIMC && currentIMC >= 18.5 && currentIMC < 25) {
      achievements.push('IMC Saludable')
    }

    return achievements
  },

  // Actualizar datos del estudiante
  async updateStudent(studentId: string, updates: Partial<RMLData>): Promise<RMLData> {
    try {
      // Intentar actualizar por id_estudiante primero
      let { data, error } = await supabase
        .from('rml_datos')
        .update(updates)
        .eq('id_estudiante', studentId)
        .select()
        .maybeSingle()

      // Si no se actualizó, intentar por codigo_estudiante
      if (!data && !error) {
        const result = await supabase
          .from('rml_datos')
          .update(updates)
          .eq('codigo_estudiante', studentId)
          .select()
          .maybeSingle()

        data = result.data
        error = result.error
      }

      if (error) {
        console.error('Error updating student:', error)
        throw new Error('Error al actualizar datos del estudiante')
      }

      if (!data) {
        throw new Error('No se pudo actualizar el estudiante')
      }

      return data
    } catch (error) {
      console.error('Error in updateStudent:', error)
      throw error
    }
  },

  // Agregar nuevo estudiante
  async addStudent(studentData: Omit<RMLData, 'id'>): Promise<RMLData> {
    try {
      const { data, error } = await supabase
        .from('rml_datos')
        .insert(studentData)
        .select()
        .maybeSingle()

      if (error) {
        console.error('Error adding student:', error)
        throw new Error('Error al agregar nuevo estudiante')
      }

      if (!data) {
        throw new Error('No se pudo agregar el estudiante')
      }

      return data
    } catch (error) {
      console.error('Error in addStudent:', error)
      throw error
    }
  },

  // Eliminar estudiante
  async deleteStudent(studentId: string): Promise<void> {
    try {
      // Intentar eliminar por id_estudiante primero
      let { error } = await supabase
        .from('rml_datos')
        .delete()
        .eq('id_estudiante', studentId)

      // Si no se eliminó, intentar por codigo_estudiante
      if (error) {
        const result = await supabase
          .from('rml_datos')
          .delete()
          .eq('codigo_estudiante', studentId)

        error = result.error
      }

      if (error) {
        console.error('Error deleting student:', error)
        throw new Error('Error al eliminar estudiante')
      }
    } catch (error) {
      console.error('Error in deleteStudent:', error)
      throw error
    }
  },

  // Verificar conexión con Supabase
  async testConnection(): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('rml_datos')
        .select('count', { count: 'exact', head: true })

      return !error
    } catch (error) {
      console.error('Error testing connection:', error)
      return false
    }
  }
};
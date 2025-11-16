import { supabase } from '../lib/supabase';
import { UserData } from '../types/User';

export interface PublicUserProfile {
  id: string;
  nombre: string;
  email: string;
  edad_estimada: number;
  tipo_usuario: 'estudiante' | 'publico';
  fecha_registro: string;
}

export const publicUserService = {
  async getProfileByAuthId(authUserId: string): Promise<PublicUserProfile | null> {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', authUserId)
      .maybeSingle();

    if (error) {
      console.error('Error fetching public user profile:', error);
      return null;
    }

    return data;
  },

  async createPublicUserProfile(
    authUserId: string,
    nombre: string,
    email: string,
    edadEstimada: number = 15
  ): Promise<PublicUserProfile | null> {
    const { data, error } = await supabase
      .from('user_profiles')
      .insert({
        id: authUserId,
        nombre,
        email,
        edad_estimada: edadEstimada,
        tipo_usuario: 'publico',
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating public user profile:', error);
      return null;
    }

    return data;
  },

  async updatePublicUserProfile(
    authUserId: string,
    updates: Partial<PublicUserProfile>
  ): Promise<PublicUserProfile | null> {
    const { data, error } = await supabase
      .from('user_profiles')
      .update(updates)
      .eq('id', authUserId)
      .select()
      .single();

    if (error) {
      console.error('Error updating public user profile:', error);
      return null;
    }

    return data;
  },

  convertProfileToUserData(profile: PublicUserProfile): UserData {
    return {
      id: profile.id,
      nombres: profile.nombre,
      apellidos: '',
      name: profile.nombre,
      age: profile.edad_estimada,
      weight: 0,
      height: 0,
      imc: 0,
      classification: 'No evaluado',
      energia: 2000,
      carbohidratos: 300,
      proteinas: 75,
      actividad_fisica: 1,
      currentLevel: 1,
      totalPoints: 100,
      achievements: ['Usuario Nuevo'],
      grado: 'Usuario público',
      sexo: 'No especificado',
      vo2max_pre: null,
      vo2max_post: null,
      leger_pre: null,
      leger_post: null,
      fuerza_pre: null,
      fuerza_post: null,
      flex_pre: null,
      flex_post: null,
      tipo_usuario: 'publico',
    };
  },
};

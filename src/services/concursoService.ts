import { supabase } from '../lib/supabase';

export interface ConcursoProject {
  id?: string;
  estudiante_id: string;
  estudiante_nombre: string;
  institucion: string;
  nombre_proyecto: string;
  categoria: string;
  descripcion_corta: string;
  impacto_esperado: string;
  contacto: string;
  created_at?: string;
}

export const ConcursoService = {
  submitProject: async (project: ConcursoProject): Promise<ConcursoProject | null> => {
    try {
      const { data, error } = await supabase
        .from('concurso_projects')
        .insert([project])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error submitting project:', error);
      return null;
    }
  },

  getUserProjects: async (userId: string): Promise<ConcursoProject[]> => {
    try {
      const { data, error } = await supabase
        .from('concurso_projects')
        .select('*')
        .eq('estudiante_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error loading user projects:', error);
      return [];
    }
  },

  getAllProjects: async (): Promise<ConcursoProject[]> => {
    try {
      const { data, error } = await supabase
        .from('concurso_projects')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error loading projects:', error);
      return [];
    }
  }
};

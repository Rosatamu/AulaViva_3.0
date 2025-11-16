import { UserData } from '../types/User';
import { supabaseService } from './supabaseService';

export class UserService {
  static async getAvailableUserIds(): Promise<string[]> {
    try {
      // Obtener IDs disponibles desde Supabase
      const ids = await supabaseService.getAvailableStudentIds();
      return ids;
    } catch (error) {
      console.error('Error getting available users:', error);
      throw error;
    }
  }

  static async getUserData(userId: string): Promise<UserData> {
    try {
      const rmlData = await supabaseService.getStudentById(userId);
      
      if (!rmlData) {
        throw new Error(`Estudiante con ID "${userId}" no encontrado en Supabase`);
      }

      // Convertir datos RML a formato UserData
      const userData = supabaseService.convertRMLToUserData(rmlData);
      console.log('User data loaded successfully:', userData);
      return userData;
    } catch (error) {
      throw new Error('Error al cargar datos del estudiante desde Supabase');
    }
  }

  static async testConnection(): Promise<boolean> {
    try { 
      await supabaseService.testConnection();
      return true;
    } catch (error) {
      return false;
    }
  }
}
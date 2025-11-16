import { UserData } from '../types/User';
import { supabaseService } from './supabaseService';
import { publicUserService } from './publicUserService';

export const unifiedUserService = {
  async getUserByStudentId(studentId: string): Promise<UserData | null> {
    try {
      const rmlData = await supabaseService.getStudentById(studentId);
      if (rmlData) {
        const userData = supabaseService.convertRMLToUserData(rmlData);
        return { ...userData, tipo_usuario: 'estudiante' };
      }
      return null;
    } catch (error) {
      console.error('Error fetching student by ID:', error);
      return null;
    }
  },

  async getUserByAuthId(authUserId: string): Promise<UserData | null> {
    try {
      const rmlData = await supabaseService.getStudentById(authUserId);
      if (rmlData) {
        const userData = supabaseService.convertRMLToUserData(rmlData);
        return { ...userData, tipo_usuario: 'estudiante' };
      }
    } catch (error) {
      console.log('User not found in rml_datos, checking user_profiles...');
    }

    const profile = await publicUserService.getProfileByAuthId(authUserId);
    if (profile) {
      return publicUserService.convertProfileToUserData(profile);
    }

    return null;
  },

  async createPublicUser(
    authUserId: string,
    nombre: string,
    email: string,
    edadEstimada?: number
  ): Promise<UserData | null> {
    const profile = await publicUserService.createPublicUserProfile(
      authUserId,
      nombre,
      email,
      edadEstimada
    );

    if (!profile) {
      return null;
    }

    return publicUserService.convertProfileToUserData(profile);
  },

  async ensureUserProfile(authUserId: string, email: string, displayName?: string): Promise<UserData | null> {
    let user = await this.getUserByAuthId(authUserId);

    if (!user) {
      const nombre = displayName || email.split('@')[0];
      user = await this.createPublicUser(authUserId, nombre, email);
    }

    return user;
  },
};

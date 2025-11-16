import { supabase } from '../lib/supabase';

export interface UserRole {
  id: string;
  user_id: string;
  role: 'admin' | 'student';
  email: string | null;
  full_name: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export class RoleService {
  static async getUserRole(userId: string): Promise<UserRole | null> {
    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (error) {
        console.error('Error fetching user role:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error in getUserRole:', error);
      return null;
    }
  }

  static async isAdmin(userId: string): Promise<boolean> {
    const role = await this.getUserRole(userId);
    return role?.role === 'admin';
  }

  static async createUserRole(
    userId: string,
    role: 'admin' | 'student',
    email?: string,
    fullName?: string
  ): Promise<UserRole | null> {
    try {
      const { data, error } = await supabase
        .from('user_roles')
        .insert({
          user_id: userId,
          role: role,
          email: email,
          full_name: fullName
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating user role:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error in createUserRole:', error);
      return null;
    }
  }

  static async updateUserRole(userId: string, role: 'admin' | 'student'): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('user_roles')
        .update({ role: role })
        .eq('user_id', userId);

      if (error) {
        console.error('Error updating user role:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in updateUserRole:', error);
      return false;
    }
  }

  static async getAllUsers(): Promise<UserRole[]> {
    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching all users:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error in getAllUsers:', error);
      return [];
    }
  }

  static async getOrCreateUserRole(userId: string, email?: string, fullName?: string): Promise<UserRole | null> {
    let role = await this.getUserRole(userId);

    if (!role) {
      role = await this.createUserRole(userId, 'student', email, fullName);
    }

    return role;
  }
}

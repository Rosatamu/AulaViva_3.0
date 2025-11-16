import { supabase } from '../lib/supabase';

export interface MarketListing {
  id: string;
  seller_id: string;
  seller_name: string;
  titulo: string;
  descripcion: string;
  precio: number;
  categoria: string;
  imagen_url?: string;
  ubicacion?: string;
  telefono_contacto?: string;
  email_contacto?: string;
  activo: boolean;
  destacado: boolean;
  created_at: string;
  updated_at?: string;

  // Campos legacy que pueden venir de datos antiguos
  institucion?: string;
  vendedor_id?: string;
  vendedor_nombre?: string;
  rating?: number;
  ventas?: number;
  vistas?: number;
  impacto_social?: string;
  badge_emprendimiento?: boolean;
  tipo_productor?: string;
  equipo_info?: any[];
}

export interface OrderItem {
  listing_id: string;
  cantidad: number;
  precio_unitario: number;
}

export interface Order {
  id: string;
  comprador_id: string;
  items: OrderItem[];
  total: number;
  estado: string;
  created_at: string;
}

export const MarketService = {
  getAllListings: async (): Promise<MarketListing[]> => {
    try {
      const { data, error } = await supabase
        .from('market_listings')
        .select('*')
        .eq('activo', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error loading listings:', error);
      return [];
    }
  },

  getUserListings: async (userId: string): Promise<MarketListing[]> => {
    try {
      const { data, error } = await supabase
        .from('market_listings')
        .select('*')
        .eq('vendedor_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error loading user listings:', error);
      return [];
    }
  },

  createListing: async (listing: Partial<MarketListing>): Promise<MarketListing | null> => {
    try {
      const { data, error } = await supabase
        .from('market_listings')
        .insert([listing])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating listing:', error);
      return null;
    }
  },

  deleteListing: async (listingId: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('market_listings')
        .delete()
        .eq('id', listingId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error deleting listing:', error);
      return false;
    }
  },

  createOrder: async (order: Partial<Order>): Promise<Order | null> => {
    try {
      const { data, error } = await supabase
        .from('market_orders')
        .insert([order])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating order:', error);
      return null;
    }
  }
};

// Servicio para leer datos desde Google Drive CSV
export class DriveService {
  private static DRIVE_CSV_URL = ''; // Se actualizará con el enlace proporcionado
  
  // Convertir enlace de Google Drive a formato CSV directo
  private static convertDriveUrl(shareUrl: string): string {
    // Extraer el ID del archivo desde el enlace compartido
    const fileIdMatch = shareUrl.match(/\/d\/([a-zA-Z0-9-_]+)/);
    if (fileIdMatch) {
      const fileId = fileIdMatch[1];
      return `https://docs.google.com/spreadsheets/d/${fileId}/export?format=csv`;
    }
    return shareUrl;
  }

  // Parsear CSV a objetos JavaScript
  private static parseCSV(csvText: string): any[] {
    const lines = csvText.trim().split('\n');
    const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
    
    return lines.slice(1).map(line => {
      const values = line.split(',').map(v => v.trim().replace(/"/g, ''));
      const obj: any = {};
      
      headers.forEach((header, index) => {
        const value = values[index] || '';
        // Convertir números automáticamente
        if (!isNaN(Number(value)) && value !== '') {
          obj[header] = Number(value);
        } else {
          obj[header] = value;
        }
      });
      
      return obj;
    });
  }

  // Cargar todos los usuarios desde el CSV
  static async loadAllUsers(): Promise<any[]> {
    try {
      if (!this.DRIVE_CSV_URL) {
        throw new Error('URL del archivo CSV no configurada');
      }

      const csvUrl = this.convertDriveUrl(this.DRIVE_CSV_URL);
      const response = await fetch(csvUrl, {
        method: 'GET',
        headers: {
          'Accept': 'text/csv,text/plain,*/*'
        }
      });

      if (!response.ok) {
        throw new Error(`Error al cargar datos: ${response.status} ${response.statusText}`);
      }

      const csvText = await response.text();
      const users = this.parseCSV(csvText);
      
      console.log('Usuarios cargados desde Drive:', users.length);
      return users;
    } catch (error) {
      console.error('Error cargando datos desde Google Drive:', error);
      throw new Error('No se pudieron cargar los datos desde Google Drive. Verifica la conexión.');
    }
  }

  // Buscar usuario específico por ID
  static async getUserById(userId: string): Promise<any | null> {
    try {
      const users = await this.loadAllUsers();
      const user = users.find(u => 
        String(u.id || u.ID || u.Id).toLowerCase() === userId.toLowerCase() ||
        String(u.usuario || u.Usuario).toLowerCase() === userId.toLowerCase()
      );
      
      if (!user) {
        throw new Error(`Usuario con ID "${userId}" no encontrado`);
      }

      return user;
    } catch (error) {
      console.error('Error buscando usuario:', error);
      throw error;
    }
  }

  // Obtener lista de IDs disponibles
  static async getAvailableUserIds(): Promise<string[]> {
    try {
      const users = await this.loadAllUsers();
      return users.map(u => String(u.id || u.ID || u.Id || u.usuario || u.Usuario))
                  .filter(id => id && id !== 'undefined');
    } catch (error) {
      console.error('Error obteniendo IDs de usuarios:', error);
      return [];
    }
  }

  // Configurar URL del archivo CSV
  static setDriveUrl(url: string) {
    this.DRIVE_CSV_URL = url;
  }

  // Verificar conectividad con Google Drive
  static async testConnection(): Promise<boolean> {
    try {
      if (!this.DRIVE_CSV_URL) return false;
      
      const csvUrl = this.convertDriveUrl(this.DRIVE_CSV_URL);
      const response = await fetch(csvUrl, { method: 'HEAD' });
      return response.ok;
    } catch {
      return false;
    }
  }
}
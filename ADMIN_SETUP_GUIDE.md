# Guía de Configuración del Administrador - Aula Viva

## Configuración Inicial del Usuario Administrador

Después de implementar el sistema de roles, sigue estos pasos para configurar tu cuenta de administrador:

### Paso 1: Crear tu Cuenta de Usuario

1. Accede a la aplicación Aula Viva
2. Haz clic en "¿No tienes cuenta? Regístrate"
3. Completa el formulario con:
   - **Nombre de usuario**: Tu nombre completo
   - **Email**: Usa un email real y válido (ejemplo: tu-email@dominio.com)
   - **Contraseña**: Mínimo 6 caracteres
4. Haz clic en "Crear Cuenta"
5. Una vez creada, inicia sesión con tus credenciales

### Paso 2: Obtener tu User ID

1. Una vez dentro de la aplicación, haz clic en tu nombre en la esquina superior derecha
2. Verás tu **User ID** mostrado junto a tu nombre
3. **Copia este ID** - lo necesitarás en el siguiente paso
4. También puedes encontrarlo en el menú de usuario → "Ver Perfil Completo"

### Paso 3: Actualizar tu Rol a Administrador

Tienes dos opciones para actualizar tu rol:

#### Opción A: Usar la Consola de Supabase (Recomendado)

1. Ve a tu proyecto en Supabase Dashboard: https://supabase.com/dashboard
2. Navega a **Table Editor** → **user_roles**
3. Encuentra o crea una nueva fila con:
   - **user_id**: Pega tu User ID copiado del Paso 2
   - **role**: Cambia de `student` a `admin`
   - **email**: Tu email
   - **full_name**: Tu nombre completo
   - **is_active**: `true`
4. Guarda los cambios

#### Opción B: Usar SQL Editor

1. Ve a tu proyecto en Supabase Dashboard
2. Navega a **SQL Editor**
3. Ejecuta el siguiente comando (reemplaza `TU_USER_ID_AQUI` con tu User ID real):

```sql
-- Actualizar usuario existente a admin
UPDATE user_roles
SET role = 'admin'
WHERE user_id = 'TU_USER_ID_AQUI';

-- O insertar nuevo admin si no existe
INSERT INTO user_roles (user_id, role, email, full_name, is_active)
VALUES (
  'TU_USER_ID_AQUI',
  'admin',
  'tu-email@dominio.com',
  'Tu Nombre Completo',
  true
)
ON CONFLICT (user_id)
DO UPDATE SET role = 'admin';
```

### Paso 4: Verificar tu Acceso de Administrador

1. **Cierra sesión** en la aplicación
2. **Vuelve a iniciar sesión** con tus credenciales
3. Haz clic en tu nombre en la esquina superior derecha
4. Deberías ver la nueva opción: **"🛡️ Panel Administrador"** en el menú desplegable
5. Haz clic en "Panel Administrador" para acceder al panel completo

### Paso 5: Explorar el Panel de Administrador

Como administrador, ahora tienes acceso a:

- **Vista General**: Estadísticas del sistema completo
  - Total de estudiantes registrados
  - Actividades completadas
  - Puntos totales acumulados
  - Nivel promedio de todos los estudiantes
  - Usuarios activos con racha
  - Métricas de participación

- **Vista de Usuarios**: Gestión completa de usuarios
  - Lista de todos los usuarios del sistema
  - Roles (admin/estudiante)
  - Estado de activación
  - Fechas de registro

- **Vista de Datos**: Acceso a herramientas de gestión
  - Gestión de tabla rml_datos
  - Exportación de reportes (próximamente)

## Características del Panel de Administrador

### Estadísticas en Tiempo Real

El panel muestra:
- 📊 Total de estudiantes registrados
- ✅ Actividades completadas por todos
- 🏆 Puntos totales del sistema
- 📈 Nivel promedio general
- 🔥 Usuarios con racha activa
- 📋 Encuestas completadas

### Gestión de Datos

Acceso completo a:
- **DataManagement**: Gestión de estudiantes en tabla rml_datos
- **Importación CSV**: Herramienta para importar datos masivos
- **Exportación**: Descargar reportes del sistema

### Seguridad

- Solo los usuarios con rol `admin` pueden ver el panel
- Los estudiantes no tienen acceso a funciones administrativas
- Las políticas RLS de Supabase protegen los datos sensibles

## Crear Más Administradores

Para crear más usuarios administradores, repite el proceso:

1. El nuevo usuario debe registrarse normalmente
2. Obtener su User ID
3. Un administrador existente actualiza su rol en Supabase
4. El usuario cierra sesión y vuelve a iniciar sesión

## Solución de Problemas

### No veo la opción "Panel Administrador"

1. Verifica que tu rol sea `admin` en la tabla `user_roles`
2. Cierra sesión completamente
3. Vuelve a iniciar sesión
4. Revisa que el user_id en la tabla coincida exactamente con tu User ID

### El panel dice "Acceso Denegado"

1. Tu rol aún es `student`
2. Sigue los pasos del Paso 3 nuevamente
3. Asegúrate de cerrar sesión y volver a iniciar después del cambio

### No puedo ver datos de otros estudiantes

1. Verifica las políticas RLS en Supabase
2. Asegúrate de que las políticas "Admins can read all roles" estén activas
3. Contacta al desarrollador si el problema persiste

## Notas de Seguridad

- **Nunca compartas tu cuenta de administrador**
- Usa contraseñas seguras (mínimo 12 caracteres recomendado)
- Solo otorga acceso de administrador a personal de confianza
- Revisa regularmente la lista de administradores en el panel

## Contacto

Para soporte adicional, contacta al equipo de desarrollo de Aula Viva.

---

**Última actualización**: 2025-10-25
**Versión del sistema**: 1.0.0 con Sistema de Roles

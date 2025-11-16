# EmprendeQuindío 2025 - Guía de Implementación

## Descripción del Proyecto

Marketplace escolar digital para el Festival EmprendeQuindío 2025 de la IE Ramón Messa Londoño, Quimbaya, Quindío. Plataforma que integra productos y servicios de estudiantes, familias y aprendices SENA, promoviendo innovación, tradición local y cultivos sostenibles.

## Equipo del Proyecto

**Aprendices SENA - IE Ramón Messa Londoño:**
- Jesús Alberto Nare Aponte (PPT 4526136) - Coordinador General
- Diego Alberto Ríos Flores (T.I 1096671181) - Líder de Producción
- Salomé Moncada Villa (T.I 1183963061) - Marketing Digital
- Brayan Esteven Méndez Tobar - Logística y Distribución
- César Augusto Mosquera (C.C. 1095178828) - Control de Calidad

## Características Implementadas

### 1. Base de Datos Supabase

#### Tablas Creadas

**`market_listings`** - Catálogo de productos y servicios
- Campos: id, titulo, descripcion, precio, categoria, institucion, vendedor_id, vendedor_nombre, imagen_url, rating, ventas, vistas, impacto_social, badge_emprendimiento, tipo_productor, equipo_info, activo
- Categorías: Panadería, Postres, Innovadores, Cultivos
- Soporta productos SENA, Familiares y Escolares

**`market_orders`** - Gestión de pedidos
- Campos: id, comprador_id, items, total, subtotal, iva, estado, metodo_pago, notas
- Estados: pendiente, confirmado, completado, cancelado
- Calcula IVA 19% automáticamente

#### Seguridad RLS (Row Level Security)

- Listings públicos visibles para todos
- Solo usuarios autenticados pueden crear/editar sus propios productos
- Usuarios solo ven sus propios pedidos

### 2. Productos Seed (14 Productos)

Los productos iniciales están en:
- `/src/data/emprendeProductsData.ts` (formato TypeScript)
- `/supabase/seed_emprende_products.sql` (para inserción directa)

**Categorías:**
1. **Innovadores**: Pan de Leche con Relleno (producto estrella SENA)
2. **Panadería**: Pan Tradicional, Donas, Galletas, Pandebono, Empanadas
3. **Postres**: Tortas de Chocolate
4. **Cultivos**: Plátano, Lulo, Lechuga, Repollo, Frijol, Tomate, Piña

### 3. Diseño Visual - Colores del Quindío

**Paleta de Colores:**
- Verde Quindío: `#228B22` (bg-quindio-green)
- Amarillo Innovación: `#FFD700` (bg-quindio-yellow)

Implementado en:
- `tailwind.config.js` - Colores personalizados
- Hero del marketplace - Gradiente verde a amarillo
- Badges y botones - Colores representativos
- Cards de productos - Bordes y acentos temáticos

### 4. Componentes Mejorados

#### `MarketListingCard.tsx`
- Badge "Emprendimiento Escolar" en amarillo
- Lazy loading de imágenes con `loading="lazy"`
- Colores por categoría personalizados
- Indicador de tipo de productor (SENA/Familiar/Escolar)
- Impacto social destacado

#### `EmprendeQuindio.tsx`
- Hero mejorado con información del equipo SENA
- Descripción completa del proyecto
- Navegación por pills con colores Quindío
- Información del municipio de Quimbaya

#### `FeaturedProducts.tsx`
- Productos destacados por rating, ventas y fecha
- Estadísticas en tiempo real
- Banner motivacional

### 5. Funcionalidades del Marketplace

**Para Visitantes:**
- Explorar productos por categoría
- Filtrar por institución y categoría
- Búsqueda global de productos
- Ver productos destacados
- Ver casos de éxito e impacto social

**Para Usuarios Autenticados:**
- Crear publicaciones de productos
- Gestionar sus propios productos
- Agregar productos al carrito
- Realizar pedidos simulados (educativo)
- Registrar proyectos para el festival

## Instalación y Configuración

### 1. Clonar el Proyecto

```bash
cd /ruta/a/aula-viva
```

### 2. Instalar Dependencias

```bash
npm install
```

### 3. Configurar Supabase

Las variables de entorno ya deben estar en `.env`:
```
VITE_SUPABASE_URL=tu_url_de_supabase
VITE_SUPABASE_ANON_KEY=tu_clave_anonima
```

### 4. Crear Tablas en Supabase

La migración ya está aplicada:
- `supabase/migrations/create_emprende_quindio_marketplace.sql`

### 5. Insertar Productos de Ejemplo

**Opción A - Usando SQL directo:**
1. Ir al Dashboard de Supabase
2. SQL Editor
3. Copiar contenido de `supabase/seed_emprende_products.sql`
4. Ejecutar

**Opción B - Usando la interfaz:**
Los productos se pueden crear desde la aplicación usando el botón "Vender"

### 6. Ejecutar en Desarrollo

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`

### 7. Construir para Producción

```bash
npm run build
```

## Navegación del Marketplace

### Acceso al Módulo

1. Iniciar sesión en Aula Viva
2. Desde el Dashboard, buscar "EmprendeQuindío"
3. Click para acceder al marketplace

### Secciones Disponibles

- **Inicio**: Productos destacados y hero con información
- **Impacto**: Dashboard de impacto social y estadísticas
- **Explorar**: Catálogo completo con filtros
- **Casos de Éxito**: Historias inspiradoras
- **Vender**: Crear nueva publicación
- **Registrar Proyecto**: Formulario para Festival 2025
- **Mis Productos**: Gestión de publicaciones propias
- **Carrito**: Revisar y finalizar pedido

## Características Técnicas

### Stack Tecnológico
- **Frontend**: React 18 + TypeScript
- **Estilos**: Tailwind CSS con colores personalizados
- **Base de Datos**: Supabase (PostgreSQL)
- **Autenticación**: Supabase Auth
- **Iconos**: Lucide React
- **Build**: Vite

### Responsive Design
- Mobile-first approach
- Grid adaptativo: 1 columna (móvil) → 3 columnas (desktop)
- Navegación optimizada para touch
- Imágenes con lazy loading

### Optimizaciones
- Lazy loading de imágenes
- Índices en base de datos para búsquedas rápidas
- Caché de productos destacados
- Paginación preparada (actualmente muestra todos)

## Personalización

### Agregar Nuevas Categorías

1. Editar `src/services/mockEmprendeData.ts`:
```typescript
export const CATEGORIAS_MARKETPLACE = [
  'Panadería',
  'Postres',
  'Innovadores',
  'Cultivos',
  'NuevaCategoria', // Agregar aquí
  ...
];
```

2. Actualizar colores en `MarketListingCard.tsx`:
```typescript
const colors: Record<string, string> = {
  'NuevaCategoria': 'bg-color-personalizado',
  ...
};
```

3. Actualizar restricción en base de datos si es necesario

### Modificar Colores del Tema

Editar `tailwind.config.js`:
```javascript
extend: {
  colors: {
    'quindio-green': '#228B22',
    'quindio-yellow': '#FFD700',
    'tu-color-custom': '#HEXCODE',
  },
}
```

### Agregar Instituciones

Editar `src/services/mockEmprendeData.ts`:
```typescript
export const INSTITUCIONES_QUINDIO = [
  'IE Ramón Messa Londoño',
  'Nueva Institución',
  ...
];
```

## Soporte y Mantenimiento

### Verificar Estado de la Base de Datos

```sql
-- Ver todas las listings activas
SELECT * FROM market_listings WHERE activo = true;

-- Ver estadísticas por categoría
SELECT categoria, COUNT(*), AVG(rating), SUM(ventas)
FROM market_listings
GROUP BY categoria;

-- Ver pedidos recientes
SELECT * FROM market_orders
ORDER BY created_at DESC
LIMIT 10;
```

### Logs y Debugging

La aplicación registra errores en la consola del navegador:
- Errores de carga de productos
- Problemas de autenticación
- Fallos en creación de listings/orders

## Próximas Mejoras Sugeridas

1. **Sistema de Pagos Real** (actualmente es simulado)
2. **Notificaciones** push para nuevos pedidos
3. **Chat** entre compradores y vendedores
4. **Sistema de Reviews** detallado
5. **Panel de Administración** para gestión del festival
6. **Exportar Reportes** de ventas e impacto
7. **Galería Multimedia** mejorada por producto
8. **Geolocalización** de puntos de venta

## Contacto del Proyecto

**Institución**: IE Ramón Messa Londoño
**Municipio**: Quimbaya, Quindío
**Festival**: EmprendeQuindío 2025
**Coordinador SENA**: Jesús Alberto Nare Aponte (PPT 4526136)

---

**Desarrollado con el apoyo del SENA y la comunidad educativa de la IE Ramón Messa Londoño**

¡Del café al emprendimiento: tradición e innovación quindiana!

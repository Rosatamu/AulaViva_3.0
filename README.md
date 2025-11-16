# Aula Viva - Aplicación Gamificada de Nutrición y Actividad Física

## Descripción
Aplicación educativa gamificada desarrollada para la investigación en la IE Ramón Messa Londoño - Quimbaya, liderada por el Docente Antony Tabima Murillo, Magíster Investigador en Actividad Física y Deporte.

## Arquitectura de Datos
La aplicación consume datos directamente desde Google Drive:
- **Archivo fuente**: `usuarios_bolt.csv`
- **Actualización**: Desde Google Colab (automática)
- **Acceso**: Solo lectura, siempre disponible
- **Sin dependencias**: No requiere APIs externas ni sesiones activas

## Funcionalidades Principales

### 🎮 Sistema Gamificado
- **Niveles 1-5**: Hábitos de Actividad Física
- **Niveles 6-10**: Nutrición Consciente
- **AulaMonedas**: Sistema de recompensas virtual
- **Side Quests**: Actividades opcionales con bonificaciones

### 🤖 NutriBot - Mentor GPT
- Chatbot educativo y motivacional
- Lenguaje empático adaptado para adolescentes
- Retroalimentación positiva y constructiva

### 📊 Visualizaciones
- Dashboard personalizado con datos reales
- Progreso por niveles con barras visuales
- Estado nutricional (IMC, clasificación OMS)
- Métricas antropométricas y nutricionales

### 🎨 Diseño
- Modo oscuro optimizado para adolescentes
- Reloj digital integrado
- Animaciones suaves y transiciones
- Interfaz responsive para todos los dispositivos

## Estructura de Datos CSV
El archivo `usuarios_bolt.csv` debe contener las siguientes columnas:
- `id` o `ID`: Identificador único del usuario
- `nombres`: Nombre del estudiante
- `apellidos`: Apellidos del estudiante
- `edad`: Edad en años
- `peso`: Peso en kilogramos
- `talla`: Altura en centímetros
- `imc`: Índice de Masa Corporal
- `clasificacion`: Clasificación OMS del IMC
- `energia`: Energía diaria recomendada (kcal)
- `carbohidratos`: Carbohidratos recomendados (g)
- `proteinas`: Proteínas recomendadas (g)
- `actividad_fisica`: Nivel de actividad física

## Configuración
Para configurar el enlace al archivo CSV de Google Drive:
1. Compartir el archivo con acceso de "Cualquier persona con el enlace puede ver"
2. Actualizar la variable `DRIVE_CSV_URL` en `src/services/api.ts`
3. El sistema convertirá automáticamente el enlace al formato CSV

## Tecnologías
- **Frontend**: React + TypeScript + Tailwind CSS
- **Iconos**: Lucide React
- **Despliegue**: Netlify (100% en la nube)
- **Datos**: Google Drive + Google Sheets CSV

## Enfoque Científico
- Basado en guías OMS, FAO y expertos en salud infantil
- Evaluación del progreso con estándares de crecimiento
- Actividades validadas desde pedagogía y psicología educativa
- Datos exportables para análisis académico

## Instalación y Uso
La aplicación funciona completamente en la nube sin instalación:
1. Acceder a la URL de despliegue
2. Ingresar ID de usuario
3. Los datos se cargan automáticamente desde Google Drive
4. Navegar por los módulos gamificados

## Investigación
Proyecto desarrollado como herramienta educativa para promover hábitos saludables en adolescentes, con enfoque en:
- Actividad física regular
- Alimentación consciente y balanceada
- Educación nutricional gamificada
- Seguimiento del crecimiento saludable
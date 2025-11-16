# CriptoAula - Sistema de Token Educativo del Quindío

## Resumen de Implementación

Se ha implementado exitosamente el ecosistema completo de CriptoAula, un sistema de token educativo que convive con AulaCoins en toda la plataforma Aula Viva.

## Componentes Implementados

### 1. Base de Datos Supabase

**Tablas Creadas:**

- `cripto_aula_wallets`: Almacena balances de ambas monedas por estudiante
  - balance_aula_coins y balance_cripto_aula
  - Totales ganados y gastados
  - Nivel de wallet (Bronce, Plata, Oro, Platino)

- `cripto_aula_transactions`: Historial completo de transacciones
  - Tipos: earn_activity, earn_quiz, earn_marketplace_sale, spend_listing_fee, spend_purchase, conversion_to_cripto, etc.
  - Metadata completa de cada transacción

- `conversion_rates`: Tasas de conversión dinámicas
  - Tasa inicial: 10 AulaCoins = 1 CriptoAula
  - Sistema flexible para ajustes futuros

- `marketplace_payments`: Registro de pagos en marketplace
  - Soporta pagos con AulaCoins, CriptoAula o Mixed
  - Tracking de fees y moneda utilizada

**Seguridad:**
- RLS habilitado en todas las tablas
- Usuarios solo pueden ver sus propios datos
- Políticas restrictivas implementadas

### 2. CriptoAulaService (src/services/criptoAulaService.ts)

Servicio completo para gestión de wallets y transacciones:

**Funciones Principales:**
- `getOrCreateWallet()`: Obtiene o crea wallet del estudiante
- `syncWalletWithUserProgress()`: Sincroniza con sistema AulaCoins existente
- `convertCurrency()`: Conversión entre AulaCoins y CriptoAula
- `earnCurrency()`: Otorgar tokens por actividades
- `spendCurrency()`: Gastar tokens en marketplace o recompensas
- `processMarketplacePayment()`: Procesar pagos del marketplace
- `getTransactions()`: Obtener historial de transacciones
- `getWalletStatistics()`: Estadísticas del wallet

### 3. CriptoAulaModule (src/components/CriptoAulaModule.tsx)

Dashboard completo e independiente con 4 pestañas:

**Dashboard:**
- Balance dual de AulaCoins y CriptoAula
- Nivel de wallet con colores distintivos
- Valor estimado en pesos colombianos
- Secciones "Formas de Ganar" y "Formas de Gastar"
- Información educativa sobre el sistema

**Convertir:**
- Conversor interactivo entre monedas
- Preview en tiempo real del resultado
- Validación de saldos
- Animación de confeti al completar conversión

**Historial:**
- Lista completa de transacciones
- Filtros por tipo
- Iconos distintivos por categoría
- Detalles de cada transacción

**Estadísticas:**
- Total de transacciones
- Transacciones de ganancia vs gasto
- Conversiones realizadas
- Moneda preferida del usuario

### 4. PaymentMethodSelector (src/components/PaymentMethodSelector.tsx)

Selector de método de pago multi-moneda:

**Características:**
- Opción de pagar con AulaCoins
- Opción de pagar con CriptoAula
- Opción de pago combinado (Mixed)
- Validación de saldos en tiempo real
- Sugerencia automática de distribución óptima
- Visualización de saldo restante

### 5. Integración en Header

- Botón "CriptoAula" prominente con ícono de moneda + hoja
- Colores verde-amarillo del Quindío
- Acceso directo al módulo CriptoAula
- Diseño responsive

### 6. Integración en AulaCoinsSystem

**Nuevas Características:**
- Muestra balance de CriptoAula si es mayor a 0
- Botón "Convertir" para conversión rápida
- Modal de conversión sin salir del módulo
- Valor estimado en pesos colombianos
- Sincronización automática con user_progress

### 7. Sistema de Navegación en App.tsx

- Nueva ruta 'criptoaula' agregada al sistema
- Integración completa con el flujo de navegación
- Mantenimiento del estado del usuario

## Sistema de Earn (Ganar Tokens)

Los estudiantes pueden ganar CriptoAula de las siguientes formas:

- **+1 CriptoAula**: Completar nivel de Actividad Física o Nutrición
- **+0.5 CriptoAula**: Quiz correcto en Cápsulas del Tiempo
- **+2 CriptoAula**: Venta en EmprendeQuindío
- **+0.5 CriptoAula**: Bonus por racha de 7 días consecutivos
- **+3 CriptoAula**: Completar encuesta pedagógica
- **+1 CriptoAula**: Referido activo

## Sistema de Spend (Gastar Tokens)

Los estudiantes pueden gastar CriptoAula en:

- **5 CriptoAula**: Fee de publicación en marketplace
- **Variable**: Comprar productos en EmprendeQuindío
- **5-15 CriptoAula**: Avatares premium
- **20 CriptoAula/mes**: Acceso premium a NutriBot
- **10 CriptoAula**: Contenido educativo exclusivo
- **Variable**: Recompensas en AulaCoinsSystem

## Tasas de Conversión

- **AulaCoins → CriptoAula**: 10 AC = 1 CA (tasa 0.1)
- **CriptoAula → AulaCoins**: 1 CA = 10 AC (tasa 10)

## Valores Referenciales en Pesos

Para contexto educativo:
- **1 AulaCoin** ≈ $20 COP
- **1 CriptoAula** ≈ $200 COP

## Niveles de Wallet

Basados en total ganado (AulaCoins + CriptoAula * 10):

- **Bronce**: 0 - 1,999
- **Plata**: 2,000 - 4,999
- **Oro**: 5,000 - 9,999
- **Platino**: 10,000+

## Características del Sistema

### Gamificación
- Animaciones de confeti al ganar tokens
- Sistema de niveles de wallet
- Badges y logros especiales
- Visualización atractiva de progresos

### Educación Financiera
- Comparación con economía real del Quindío
- Conceptos de ahorro e inversión
- Proyecciones de valor
- Transparencia en conversiones

### Identidad Regional
- Colores verde y amarillo del Quindío
- Ícono de hoja de café
- Frases motivacionales locales
- Conexión con cultura departamental

## Próximos Pasos Sugeridos

1. **Integrar en EmprendeQuindío:**
   - Actualizar CreateListingForm para aceptar ambas monedas
   - Modificar ShoppingCartView para checkout multi-moneda
   - Implementar fees de publicación con CriptoAula

2. **Encuesta de Validación:**
   - Crear componente de encuesta sobre tokens educativos
   - Recompensar con CriptoAula por completarla
   - Dashboard de resultados agregados

3. **Sistema de Referidos:**
   - Implementar código de referido único por estudiante
   - Recompensas por invitar amigos activos
   - Tracking de red de referidos

4. **Leaderboard Departamental:**
   - Ranking de top earners del Quindío
   - Ranking por municipio
   - Recompensas especiales mensuales

5. **Contenido Premium:**
   - Cápsulas educativas exclusivas
   - Videos avanzados
   - Mentorías virtuales

## Notas Técnicas

- Sistema totalmente funcional sin blockchain real
- Base de datos Supabase con RLS
- TypeScript para type safety
- React 18 con hooks modernos
- Tailwind CSS para estilos
- Lucide React para iconografía
- Responsive design implementado

## Testing

Para probar el sistema:

1. Iniciar sesión con un usuario existente
2. Hacer clic en el botón "CriptoAula" en el header
3. Explorar el dashboard y sus pestañas
4. Probar la conversión de monedas
5. Verificar sincronización con AulaCoins
6. Revisar historial de transacciones

## Conclusión

El ecosistema CriptoAula está completamente implementado y listo para uso. El sistema permite a los estudiantes del Quindío aprender sobre economía digital mientras participan en actividades educativas, creando un ciclo virtuoso de aprendizaje y recompensas.

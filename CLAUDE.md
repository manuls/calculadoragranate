# Calculadora Granate - Notas para Claude

## Descripción del Proyecto
Calculadora de clasificación para Primera Federación Grupo 1 (temporada 2026/27). Permite simular resultados de partidos y ver cómo afectan a la clasificación.

## Stack Técnico
- **Framework**: Next.js 15.5.9 (App Router)
- **UI**: Tailwind CSS + shadcn/ui
- **Animaciones**: Framer Motion
- **Base de datos**: Redis (vía `redis` package TCP)
- **Hosting**: Vercel
- **Scraping**: BDFutbol (HTML estático)

## Archivos Importantes

### Datos
- `lib/data.ts` - Equipos, resultados jugados y fixtures pendientes (J2-J38)
- `lib/types.ts` - Tipos TypeScript
- `lib/team-mapping.ts` - Mapeo nombres BDFutbol → IDs app
- `lib/bdfutbol-scraper.ts` - Scraper de resultados

### APIs
- `app/api/official-results/route.ts` - CRUD de resultados oficiales (Redis)
- `app/api/cron/update-results/route.ts` - Cron job para scraping automático

### Componentes Principales
- `components/standings-calculator.tsx` - Lógica principal de la calculadora
- `components/standings-table.tsx` - Tabla de clasificación con flechas de posición
- `components/match-fixtures.tsx` - Partidos por jornada

## Errores Conocidos y Soluciones

### 1. Vercel Read-Only Filesystem
**Error**: `EROFS: read-only file system`
**Causa**: Vercel no permite escribir archivos en el filesystem.
**Solución**: Usar Redis para almacenamiento. NO usar `fs.writeFileSync()`.

### 2. Temporada Incorrecta en BDFutbol
**Error**: Scraping de datos incorrectos.
**Causa**: URL de temporada equivocada.
**Solución**:
- URL correcta: `https://www.bdfutbol.com/es/t/t2026-271rf1.html`
- Formato: `t{AÑO_INICIO}-{AÑO_FIN}1rf1.html`

### 3. Partidos Jugados Incorrectos
**Error**: Algunos equipos tenían 22 PJ cuando debían tener 21.
**Causa**: Datos iniciales mal introducidos.
**Solución**: Siempre verificar datos con BDFutbol antes de actualizar `lib/data.ts`.

### 4. Flechas de Posición No Funcionaban
**Error**: Las flechas de cambio de posición no aparecían.
**Causa**: `initialStandings` se actualizaba junto con `teams`.
**Solución**: `initialStandings` solo debe contener la clasificación BASE (antes de aplicar resultados oficiales). Solo `teams` se actualiza con los resultados.

### 5. API-Football Plan Gratuito
**Error**: `Free plans do not have access to this season`
**Causa**: El plan gratuito de API-Football solo permite temporadas 2022-2024.
**Solución**: Usar scraping de BDFutbol en su lugar.

## Variables de Entorno Requeridas

```env
REDIS_URL=redis://...          # URL de conexión a Redis
CRON_SECRET=...                # Token para autorizar cron jobs
```

## Cron Jobs

### Actualización Automática de Resultados
- **Ruta**: `/api/cron/update-results`
- **Schedule**: Martes 09:00 UTC (`0 9 * * 2`)
- **Configuración**: `vercel.json`

## Mapeo de Equipos (BDFutbol → App)

| ID | Nombre App | Nombres BDFutbol |
|----|------------|------------------|
| 1 | CD Mirandés | mirandes, cd mirandes |
| 2 | CyD Leonesa | cultural leonesa, cultural y deportiva leonesa |
| 3 | Pontevedra CF | pontevedra |
| 4 | Bilbao Athletic | bilbao athletic |
| 5 | Racing Club Ferrol | racing de ferrol, racing ferrol |
| 6 | RC Deportivo Fabril | deportivo fabril |
| 7 | CD Lugo | lugo |
| 8 | Zamora CF | zamora |
| 9 | Real Avilés Industrial | aviles industrial, aviles |
| 10 | Barakaldo CF | barakaldo |
| 11 | AD Mérida | merida ad, ad merida |
| 12 | Unionistas de Salamanca CF | unionistas de salamanca, unionistas |
| 13 | Arenas Club | arenas de getxo, arenas |
| 14 | SD Ponferradina | ponferradina |
| 15 | UD Ourense | ud ourense |
| 16 | Real Unión Club | real union |
| 17 | CP Cacereño | cacereno |
| 18 | CD Coria | cd coria |
| 19 | CD Extremadura | cd extremadura |
| 20 | UD Logroñés | ud logrones |

## Comandos Útiles

```bash
# Desarrollo
pnpm dev

# Build
pnpm build

# Regenerar calendario, resultados y clasificación base
pnpm run update:data

# Regenerar desde HTML descargado previamente
node scripts/update-season-data.mjs --main-file /tmp/bdfutbol-main.html --results-file /tmp/bdfutbol-rfef1.html

# Probar cron manualmente
curl "https://calculadora.pontevedracf.net/api/cron/update-results?matchday=2" \
  -H "Authorization: Bearer $CRON_SECRET"

# Scraping manual de BDFutbol
curl -s "https://www.bdfutbol.com/es/t/t2026-271rf1.html?tab=results" | \
  grep "data-jornada='2'" -A 150
```

## Notas Adicionales

- Los datos iniciales en `lib/data.ts` reflejan la clasificación tras la J1 de 2026/27
- BDFutbol actualiza resultados poco después de que terminen los partidos
- El cron se ejecuta los martes a las 09:00 UTC para capturar toda la jornada, incluidos los partidos del lunes

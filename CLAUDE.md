# Calculadora Granate - Notas para Claude

## Descripción del Proyecto
Calculadora de clasificación para Primera RFEF Grupo 1 (temporada 2025-26). Permite simular resultados de partidos y ver cómo afectan a la clasificación.

## Stack Técnico
- **Framework**: Next.js 15.5.9 (App Router)
- **UI**: Tailwind CSS + shadcn/ui
- **Animaciones**: Framer Motion
- **Base de datos**: Redis (vía `redis` package TCP)
- **Hosting**: Vercel
- **Scraping**: BDFutbol (HTML estático)

## Archivos Importantes

### Datos
- `lib/data.ts` - Equipos iniciales y fixtures (J22-J38)
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
**Causa**: URL de temporada equivocada (2024-25 vs 2025-26).
**Solución**:
- URL correcta: `https://www.bdfutbol.com/es/t/t2025-261rf1.html`
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
- **Schedule**: Lunes 8:00 UTC (`0 8 * * 1`)
- **Configuración**: `vercel.json`

## Mapeo de Equipos (BDFutbol → App)

| ID | Nombre App | Nombres BDFutbol |
|----|------------|------------------|
| 1 | CD Tenerife | tenerife |
| 2 | RC Celta Fortuna | celta fortuna |
| 3 | Pontevedra CF | pontevedra |
| 4 | Bilbao Athletic | bilbao athletic |
| 5 | Racing Ferrol | racing de ferrol, racing ferrol |
| 6 | Real Madrid Castilla | real madrid castilla |
| 7 | CD Lugo | lugo |
| 8 | Zamora CF | zamora |
| 9 | Real Avilés Industrial | aviles industrial, aviles |
| 10 | Barakaldo CF | barakaldo |
| 11 | Mérida AD | merida ad, merida |
| 12 | Unionistas CF | unionistas de salamanca, unionistas |
| 13 | Arenas Club | arenas de getxo, arenas |
| 14 | SD Ponferradina | ponferradina |
| 15 | Ourense CF | ourense cf, ourense |
| 16 | CF Talavera | talavera de la reina, talavera |
| 17 | CP Cacereño | cacereno |
| 18 | CD Arenteiro | arenteiro |
| 19 | CA Osasuna Promesas | osasuna b |
| 20 | CD Guadalajara | guadalajara |

## Comandos Útiles

```bash
# Desarrollo
npm run dev

# Build
npm run build

# Probar cron manualmente
curl "https://calculadoragranate.vercel.app/api/cron/update-results?matchday=22" \
  -H "Authorization: Bearer $CRON_SECRET"

# Scraping manual de BDFutbol
curl -s "https://www.bdfutbol.com/es/t/t2025-261rf1.html?tab=results" | \
  grep "data-jornada='22'" -A 150
```

## Notas Adicionales

- La jornada actual es la **22** (a partir de febrero 2026)
- Los datos iniciales en `lib/data.ts` reflejan la clasificación tras la J21
- BDFutbol actualiza resultados poco después de que terminen los partidos
- El cron se ejecuta los lunes para capturar todos los resultados del fin de semana

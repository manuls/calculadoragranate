# Directorio de datos

Este directorio contiene los archivos JSON utilizados por la aplicación para almacenar datos persistentes.

Archivos:
- `official-results.json`: Volcado auxiliar de resultados oficiales.
- `official-results-data.json`: Copia auxiliar del mismo formato para importaciones o respaldos manuales.

Estado actual:
- La clasificación base de la app ya incorpora los resultados oficiales hasta la jornada 33.
- Por eso, ambos JSON deben mantenerse vacíos hasta que se quieran registrar jornadas posteriores a la 33.
- Si se cargaran aquí jornadas ya incluidas en `lib/data.ts`, la app las volvería a aplicar y se producirían dobles conteos.

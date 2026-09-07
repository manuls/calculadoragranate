# Pronósticos integrados

La portada de Calculadora Granate y `/pronosticos` usan `getForecastReport`, que obtiene la competición desde una única caché de datos. AS es la primera fuente y BDFutbol la alternativa; Redis completa resultados oficiales todavía ausentes en esas fuentes. `lib/data.ts` sigue siendo la copia inicial común.

La tarjeta de portada recalcula 10.000 escenarios en un Web Worker al completar marcadores. «Ver análisis» traslada el escenario mediante sessionStorage del mismo dominio. «Usar este escenario en la calculadora» permite el camino inverso. Se comprueban temporada y emparejamientos al cargar; los partidos que ya son oficiales se descartan del escenario. Restablecer conserva resultados oficiales. Las simulaciones de visitantes no se archivan en el servidor.

El archivo de Vercel Blob conserva las predicciones ya generadas por Pronósticos Granates. La versión `granate-poisson-1.3` aumenta el peso inicial de 8 a 16 partidos equivalentes, conserva el 98 % del peso por jornada de antigüedad y aumenta la incertidumbre inicial a 0,30 con histórico comparable y 0,40 sin él. La incertidumbre disminuye con los partidos ponderados, usando una escala de 12 partidos. Son parámetros prudentes sin calibración retrospectiva. El cambio de versión inicia una serie nueva y conserva los pronósticos anteriores sin mezclarlos. Se pueden trasladar temporadas completas desde la calculadora.

El cron `/api/cron/update-results` actualiza la competición compartida y archiva el pronóstico los domingos a las 20:30 en horario de Madrid. Vercel lanza dos horarios UTC y la ruta descarta el que no corresponda, para respetar los cambios de hora de verano e invierno. Requiere `CRON_SECRET`; `BLOB_READ_WRITE_TOKEN` permite conservar el historial. El formulario administrativo de resultados continúa guardando en Redis e invalida las cachés comunes.

La metodología vive en `/pronosticos/metodologia`. El modelo sigue siendo experimental y no está calibrado retrospectivamente.

Para regenerar los históricos: `node scripts/forecasts/import-history.mjs --refresh`.

# Evaluación retrospectiva del modelo

Ejecutar desde la raíz del proyecto: `node scripts/backtest-model.mjs 3000`.

El análisis utiliza las temporadas 2022/23 a 2025/26 de Primera Federación cuyos resultados y puntuaciones finales no tienen incidencias administrativas. En cada temporada se reconstruye la información que había tras las jornadas 2, 5, 10, 20 y 30. El modelo solo ve los marcadores anteriores a cada corte; conoce el calendario pendiente y las temporadas anteriores, como en producción.

Se usan cinco competiciones (grupos y temporadas) anteriores a 2025/26 para comparar pesos iniciales de 8, 16 y 24 partidos equivalentes. Los dos grupos de 2025/26 se reservan para comprobar la alternativa elegida. Se calculan 3.000 finales de temporada por corte en este análisis; la web calcula 10.000. Se excluyen las competiciones con ajustes administrativos porque no se conoce la fecha exacta en que se aplicaron.

## Resultado

La puntuación Brier penaliza la distancia entre probabilidad y resultado; **menor es mejor**. La media relativa siguiente promedia permanencia, playoff y campeonato, dividiendo cada error por el de una predicción fija basada en el número de plazas de cada zona. Esa referencia vale 1.

| Peso inicial | Comparación previa | Temporada reservada |
| --- | ---: | ---: |
| 8 partidos | 0,7574 | No evaluado como finalista |
| 16 partidos, ajuste actual | 0,7495 | **0,7192** |
| 24 partidos | **0,7485** | 0,7226 |

La ventaja de 24 en las temporadas de ajuste era muy pequeña y desapareció en la temporada reservada. Se conserva el peso de **16 partidos**. También se compararon transformaciones que acercan las probabilidades a la frecuencia histórica o las alejan de ella: la probabilidad original obtuvo el menor error tanto antes como en la temporada reservada.

La comprobación reservada comprende 10 cortes y 200 pronósticos de equipos por cada objetivo, pero los cortes de una misma temporada no son independientes. Es evidencia limitada, no una garantía de calibración perfecta ni una estimación de precisión futura.

Para el 1-X-2 de los partidos se evaluaron los diez encuentros de la jornada siguiente a cada corte. La temporada reservada contiene 100 partidos. El modelo común obtuvo Brier 0,224; una referencia fija con las frecuencias 1-X-2 de las temporadas de ajuste obtuvo 0,221. Por ahora **no hay evidencia de que las probabilidades de partido superen esa referencia simple**. Se muestran para mantener la coherencia con los escenarios y se identifican como orientativas. Una muestra histórica más amplia y datos de otras categorías serían necesarios antes de afirmar mayor precisión.

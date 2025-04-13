/**
 * Este archivo proporciona un mapeo entre los IDs de los partidos y los equipos que participan en ellos.
 * Útil para identificar qué partido corresponde a cada ID en el sistema.
 */

export interface MatchInfo {
  id: number
  matchday: number
  homeTeam: string
  awayTeam: string
}

export const matchIdMapping: MatchInfo[] = [
  // Jornada 20
  { id: 73, matchday: 20, homeTeam: "Pontevedra CF", awayTeam: "CD Numancia" },
  { id: 74, matchday: 20, homeTeam: "SD Compostela", awayTeam: "Deportivo Fabril" },

  // Jornada 27
  { id: 1, matchday: 27, homeTeam: "Rayo Cantabria", awayTeam: "UP Langreo" },
  { id: 2, matchday: 27, homeTeam: "Escobedo", awayTeam: "Marino de Luanco" },
  { id: 3, matchday: 27, homeTeam: "CD Numancia", awayTeam: "Laredo" },
  { id: 4, matchday: 27, homeTeam: "Bergantiños FC", awayTeam: "Real Valladolid Promesas" },
  { id: 5, matchday: 27, homeTeam: "UD Llanera", awayTeam: "Real Avila" },
  { id: 6, matchday: 27, homeTeam: "Salamanca CF UDS", awayTeam: "Gimnastica de Torrelavega" },
  { id: 7, matchday: 27, homeTeam: "Coruxo FC", awayTeam: "SD Compostela" },
  { id: 8, matchday: 27, homeTeam: "CD Guijuelo", awayTeam: "Deportivo Fabril" },
  { id: 9, matchday: 27, homeTeam: "Real Aviles", awayTeam: "Pontevedra CF" },

  // Jornada 28
  { id: 10, matchday: 28, homeTeam: "Real Valladolid Promesas", awayTeam: "UD Llanera" },
  { id: 11, matchday: 28, homeTeam: "Deportivo Fabril", awayTeam: "Real Aviles" },
  { id: 12, matchday: 28, homeTeam: "Escobedo", awayTeam: "CD Numancia" },
  { id: 13, matchday: 28, homeTeam: "SD Compostela", awayTeam: "Bergantiños FC" },
  { id: 14, matchday: 28, homeTeam: "Gimnastica de Torrelavega", awayTeam: "Laredo" },
  { id: 15, matchday: 28, homeTeam: "UP Langreo", awayTeam: "CD Guijuelo" },
  { id: 16, matchday: 28, homeTeam: "Pontevedra CF", awayTeam: "Coruxo FC" },
  { id: 17, matchday: 28, homeTeam: "Real Avila", awayTeam: "Salamanca CF UDS" },
  { id: 18, matchday: 28, homeTeam: "Marino de Luanco", awayTeam: "Rayo Cantabria" },

  // Jornada 29
  { id: 19, matchday: 29, homeTeam: "Bergantiños FC", awayTeam: "Pontevedra CF" },
  { id: 20, matchday: 29, homeTeam: "CD Numancia", awayTeam: "Gimnastica de Torrelavega" },
  { id: 21, matchday: 29, homeTeam: "Coruxo FC", awayTeam: "Deportivo Fabril" },
  { id: 22, matchday: 29, homeTeam: "CD Guijuelo", awayTeam: "Marino de Luanco" },
  { id: 23, matchday: 29, homeTeam: "Laredo", awayTeam: "Real Avila" },
  { id: 24, matchday: 29, homeTeam: "UD Llanera", awayTeam: "SD Compostela" },
  { id: 25, matchday: 29, homeTeam: "Rayo Cantabria", awayTeam: "Escobedo" },
  { id: 26, matchday: 29, homeTeam: "Salamanca CF UDS", awayTeam: "Real Valladolid Promesas" },
  { id: 27, matchday: 29, homeTeam: "Real Aviles", awayTeam: "UP Langreo" },

  // Jornada 30
  { id: 28, matchday: 30, homeTeam: "SD Compostela", awayTeam: "Salamanca CF UDS" },
  { id: 29, matchday: 30, homeTeam: "Deportivo Fabril", awayTeam: "Bergantiños FC" },
  { id: 30, matchday: 30, homeTeam: "Escobedo", awayTeam: "CD Guijuelo" },
  { id: 31, matchday: 30, homeTeam: "Gimnastica de Torrelavega", awayTeam: "Laredo" },
  { id: 32, matchday: 30, homeTeam: "Marino de Luanco", awayTeam: "Real Aviles" },
  { id: 33, matchday: 30, homeTeam: "Pontevedra CF", awayTeam: "UD Llanera" },
  { id: 34, matchday: 30, homeTeam: "Real Valladolid Promesas", awayTeam: "Real Avila" },
  { id: 35, matchday: 30, homeTeam: "UP Langreo", awayTeam: "Coruxo FC" },
  { id: 36, matchday: 30, homeTeam: "Rayo Cantabria", awayTeam: "CD Numancia" },

  // Jornada 31
  { id: 37, matchday: 31, homeTeam: "Bergantiños FC", awayTeam: "UP Langreo" },
  { id: 38, matchday: 31, homeTeam: "Coruxo FC", awayTeam: "Marino de Luanco" },
  { id: 39, matchday: 31, homeTeam: "Gimnastica de Torrelavega", awayTeam: "Real Avila" },
  { id: 40, matchday: 31, homeTeam: "CD Guijuelo", awayTeam: "Rayo Cantabria" },
  { id: 41, matchday: 31, homeTeam: "Laredo", awayTeam: "Real Valladolid Promesas" },
  { id: 42, matchday: 31, homeTeam: "UD Llanera", awayTeam: "Deportivo Fabril" },
  { id: 43, matchday: 31, homeTeam: "CD Numancia", awayTeam: "Escobedo" },
  { id: 44, matchday: 31, homeTeam: "Real Aviles", awayTeam: "SD Compostela" },
  { id: 45, matchday: 31, homeTeam: "Salamanca CF UDS", awayTeam: "Pontevedra CF" },

  // Jornada 32
  { id: 46, matchday: 32, homeTeam: "SD Compostela", awayTeam: "Laredo" },
  { id: 47, matchday: 32, homeTeam: "Deportivo Fabril", awayTeam: "Salamanca CF UDS" },
  { id: 48, matchday: 32, homeTeam: "Escobedo", awayTeam: "CD Guijuelo" },
  { id: 49, matchday: 32, homeTeam: "Marino de Luanco", awayTeam: "Coruxo FC" },
  { id: 50, matchday: 32, homeTeam: "Pontevedra CF", awayTeam: "Real Avila" },
  { id: 51, matchday: 32, homeTeam: "Rayo Cantabria", awayTeam: "Bergantiños FC" },
  { id: 52, matchday: 32, homeTeam: "Real Valladolid Promesas", awayTeam: "Gimnastica de Torrelavega" },
  { id: 53, matchday: 32, homeTeam: "UP Langreo", awayTeam: "UD Llanera" },
  { id: 54, matchday: 32, homeTeam: "Real Aviles", awayTeam: "CD Numancia" },

  // Jornada 33
  { id: 55, matchday: 33, homeTeam: "Bergantiños FC", awayTeam: "Marino de Luanco" },
  { id: 56, matchday: 33, homeTeam: "Coruxo FC", awayTeam: "CD Numancia" },
  { id: 57, matchday: 33, homeTeam: "Gimnastica de Torrelavega", awayTeam: "SD Compostela" },
  { id: 58, matchday: 33, homeTeam: "CD Guijuelo", awayTeam: "Real Aviles" },
  { id: 59, matchday: 33, homeTeam: "Laredo", awayTeam: "Pontevedra CF" },
  { id: 60, matchday: 33, homeTeam: "UD Llanera", awayTeam: "Rayo Cantabria" },
  { id: 61, matchday: 33, homeTeam: "Real Avila", awayTeam: "Deportivo Fabril" },
  { id: 62, matchday: 33, homeTeam: "Real Valladolid Promesas", awayTeam: "UP Langreo" },
  { id: 63, matchday: 33, homeTeam: "Salamanca CF UDS", awayTeam: "Escobedo" },

  // Jornada 34
  { id: 64, matchday: 34, homeTeam: "SD Compostela", awayTeam: "Real Valladolid Promesas" },
  { id: 65, matchday: 34, homeTeam: "Deportivo Fabril", awayTeam: "Laredo" },
  { id: 66, matchday: 34, homeTeam: "Escobedo", awayTeam: "Bergantiños FC" },
  { id: 67, matchday: 34, homeTeam: "CD Guijuelo", awayTeam: "UD Llanera" },
  { id: 68, matchday: 34, homeTeam: "Marino de Luanco", awayTeam: "Salamanca CF UDS" },
  { id: 69, matchday: 34, homeTeam: "CD Numancia", awayTeam: "Coruxo FC" },
  { id: 70, matchday: 34, homeTeam: "Pontevedra CF", awayTeam: "Gimnastica de Torrelavega" },
  { id: 71, matchday: 34, homeTeam: "Rayo Cantabria", awayTeam: "Real Avila" },
  { id: 72, matchday: 34, homeTeam: "UP Langreo", awayTeam: "Real Aviles" },
]

/**
 * Función para obtener la información de un partido por su ID
 */
export function getMatchInfoById(id: number): MatchInfo | undefined {
  return matchIdMapping.find((match) => match.id === id)
}

/**
 * Función para obtener todos los partidos de una jornada
 */
export function getMatchesByMatchday(matchday: number): MatchInfo[] {
  return matchIdMapping.filter((match) => match.matchday === matchday)
}

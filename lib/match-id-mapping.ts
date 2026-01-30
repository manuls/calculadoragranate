/**
 * Este archivo proporciona un mapeo entre los IDs de los partidos y los equipos que participan en ellos.
 * Útil para identificar qué partido corresponde a cada ID en el sistema.
 * Primera RFEF Grupo 1 - Temporada 2025-26
 */

export interface MatchInfo {
  id: number
  matchday: number
  homeTeam: string
  awayTeam: string
}

export const matchIdMapping: MatchInfo[] = [
  // Jornada 22
  { id: 1, matchday: 22, homeTeam: "RC Celta Fortuna", awayTeam: "Unionistas CF" },
  { id: 2, matchday: 22, homeTeam: "CF Talavera de la Reina", awayTeam: "Pontevedra CF" },
  { id: 3, matchday: 22, homeTeam: "CD Tenerife", awayTeam: "CD Guadalajara" },
  { id: 4, matchday: 22, homeTeam: "Zamora CF", awayTeam: "Racing Ferrol" },
  { id: 5, matchday: 22, homeTeam: "Real Avilés Industrial", awayTeam: "Mérida AD" },
  { id: 6, matchday: 22, homeTeam: "Arenas Club", awayTeam: "Ourense CF" },
  { id: 7, matchday: 22, homeTeam: "CP Cacereño", awayTeam: "Barakaldo CF" },
  { id: 8, matchday: 22, homeTeam: "CD Lugo", awayTeam: "SD Ponferradina" },
  { id: 9, matchday: 22, homeTeam: "Real Madrid Castilla", awayTeam: "CA Osasuna Promesas" },
  { id: 10, matchday: 22, homeTeam: "CD Arenteiro", awayTeam: "Bilbao Athletic" },

  // Jornada 23
  { id: 11, matchday: 23, homeTeam: "Barakaldo CF", awayTeam: "CF Talavera de la Reina" },
  { id: 12, matchday: 23, homeTeam: "Bilbao Athletic", awayTeam: "CD Tenerife" },
  { id: 13, matchday: 23, homeTeam: "CD Arenteiro", awayTeam: "Real Avilés Industrial" },
  { id: 14, matchday: 23, homeTeam: "Racing Ferrol", awayTeam: "CD Lugo" },
  { id: 15, matchday: 23, homeTeam: "Unionistas CF", awayTeam: "Ourense CF" },
  { id: 16, matchday: 23, homeTeam: "CA Osasuna Promesas", awayTeam: "CP Cacereño" },
  { id: 17, matchday: 23, homeTeam: "Pontevedra CF", awayTeam: "Real Madrid Castilla" },
  { id: 18, matchday: 23, homeTeam: "CD Guadalajara", awayTeam: "Arenas Club" },
  { id: 19, matchday: 23, homeTeam: "Mérida AD", awayTeam: "Zamora CF" },
  { id: 20, matchday: 23, homeTeam: "SD Ponferradina", awayTeam: "RC Celta Fortuna" },

  // Jornada 24
  { id: 21, matchday: 24, homeTeam: "CD Tenerife", awayTeam: "Racing Ferrol" },
  { id: 22, matchday: 24, homeTeam: "RC Celta Fortuna", awayTeam: "Bilbao Athletic" },
  { id: 23, matchday: 24, homeTeam: "Pontevedra CF", awayTeam: "Zamora CF" },
  { id: 24, matchday: 24, homeTeam: "Real Madrid Castilla", awayTeam: "Barakaldo CF" },
  { id: 25, matchday: 24, homeTeam: "CD Lugo", awayTeam: "Mérida AD" },
  { id: 26, matchday: 24, homeTeam: "Real Avilés Industrial", awayTeam: "Unionistas CF" },
  { id: 27, matchday: 24, homeTeam: "Arenas Club", awayTeam: "SD Ponferradina" },
  { id: 28, matchday: 24, homeTeam: "Ourense CF", awayTeam: "CF Talavera de la Reina" },
  { id: 29, matchday: 24, homeTeam: "CP Cacereño", awayTeam: "CD Arenteiro" },
  { id: 30, matchday: 24, homeTeam: "CA Osasuna Promesas", awayTeam: "CD Guadalajara" },

  // Jornada 25
  { id: 31, matchday: 25, homeTeam: "Bilbao Athletic", awayTeam: "Pontevedra CF" },
  { id: 32, matchday: 25, homeTeam: "Racing Ferrol", awayTeam: "RC Celta Fortuna" },
  { id: 33, matchday: 25, homeTeam: "Zamora CF", awayTeam: "CD Tenerife" },
  { id: 34, matchday: 25, homeTeam: "Barakaldo CF", awayTeam: "CD Lugo" },
  { id: 35, matchday: 25, homeTeam: "Mérida AD", awayTeam: "Real Madrid Castilla" },
  { id: 36, matchday: 25, homeTeam: "Unionistas CF", awayTeam: "Real Avilés Industrial" },
  { id: 37, matchday: 25, homeTeam: "SD Ponferradina", awayTeam: "Arenas Club" },
  { id: 38, matchday: 25, homeTeam: "CF Talavera de la Reina", awayTeam: "Ourense CF" },
  { id: 39, matchday: 25, homeTeam: "CD Arenteiro", awayTeam: "CP Cacereño" },
  { id: 40, matchday: 25, homeTeam: "CD Guadalajara", awayTeam: "CA Osasuna Promesas" },

  // Jornada 26
  { id: 41, matchday: 26, homeTeam: "CD Tenerife", awayTeam: "Real Madrid Castilla" },
  { id: 42, matchday: 26, homeTeam: "RC Celta Fortuna", awayTeam: "Zamora CF" },
  { id: 43, matchday: 26, homeTeam: "Pontevedra CF", awayTeam: "Barakaldo CF" },
  { id: 44, matchday: 26, homeTeam: "Bilbao Athletic", awayTeam: "Unionistas CF" },
  { id: 45, matchday: 26, homeTeam: "Racing Ferrol", awayTeam: "SD Ponferradina" },
  { id: 46, matchday: 26, homeTeam: "CD Lugo", awayTeam: "CF Talavera de la Reina" },
  { id: 47, matchday: 26, homeTeam: "Real Avilés Industrial", awayTeam: "CD Arenteiro" },
  { id: 48, matchday: 26, homeTeam: "Mérida AD", awayTeam: "CD Guadalajara" },
  { id: 49, matchday: 26, homeTeam: "Arenas Club", awayTeam: "CA Osasuna Promesas" },
  { id: 50, matchday: 26, homeTeam: "Ourense CF", awayTeam: "CP Cacereño" },

  // Jornada 27
  { id: 51, matchday: 27, homeTeam: "Real Madrid Castilla", awayTeam: "RC Celta Fortuna" },
  { id: 52, matchday: 27, homeTeam: "Zamora CF", awayTeam: "Bilbao Athletic" },
  { id: 53, matchday: 27, homeTeam: "Barakaldo CF", awayTeam: "CD Tenerife" },
  { id: 54, matchday: 27, homeTeam: "Unionistas CF", awayTeam: "Pontevedra CF" },
  { id: 55, matchday: 27, homeTeam: "SD Ponferradina", awayTeam: "CD Lugo" },
  { id: 56, matchday: 27, homeTeam: "CF Talavera de la Reina", awayTeam: "Real Avilés Industrial" },
  { id: 57, matchday: 27, homeTeam: "CD Arenteiro", awayTeam: "Mérida AD" },
  { id: 58, matchday: 27, homeTeam: "CD Guadalajara", awayTeam: "Racing Ferrol" },
  { id: 59, matchday: 27, homeTeam: "CP Cacereño", awayTeam: "Arenas Club" },
  { id: 60, matchday: 27, homeTeam: "CA Osasuna Promesas", awayTeam: "Ourense CF" },

  // Jornada 28
  { id: 61, matchday: 28, homeTeam: "CD Tenerife", awayTeam: "Unionistas CF" },
  { id: 62, matchday: 28, homeTeam: "RC Celta Fortuna", awayTeam: "Barakaldo CF" },
  { id: 63, matchday: 28, homeTeam: "Pontevedra CF", awayTeam: "SD Ponferradina" },
  { id: 64, matchday: 28, homeTeam: "Bilbao Athletic", awayTeam: "CF Talavera de la Reina" },
  { id: 65, matchday: 28, homeTeam: "Racing Ferrol", awayTeam: "CD Arenteiro" },
  { id: 66, matchday: 28, homeTeam: "CD Lugo", awayTeam: "CD Guadalajara" },
  { id: 67, matchday: 28, homeTeam: "Real Madrid Castilla", awayTeam: "Zamora CF" },
  { id: 68, matchday: 28, homeTeam: "Real Avilés Industrial", awayTeam: "CP Cacereño" },
  { id: 69, matchday: 28, homeTeam: "Mérida AD", awayTeam: "CA Osasuna Promesas" },
  { id: 70, matchday: 28, homeTeam: "Arenas Club", awayTeam: "Ourense CF" },

  // Jornada 29
  { id: 71, matchday: 29, homeTeam: "Barakaldo CF", awayTeam: "Bilbao Athletic" },
  { id: 72, matchday: 29, homeTeam: "Unionistas CF", awayTeam: "Real Madrid Castilla" },
  { id: 73, matchday: 29, homeTeam: "SD Ponferradina", awayTeam: "CD Tenerife" },
  { id: 74, matchday: 29, homeTeam: "CF Talavera de la Reina", awayTeam: "Pontevedra CF" },
  { id: 75, matchday: 29, homeTeam: "CD Arenteiro", awayTeam: "CD Lugo" },
  { id: 76, matchday: 29, homeTeam: "CD Guadalajara", awayTeam: "RC Celta Fortuna" },
  { id: 77, matchday: 29, homeTeam: "Zamora CF", awayTeam: "Racing Ferrol" },
  { id: 78, matchday: 29, homeTeam: "Ourense CF", awayTeam: "Mérida AD" },
  { id: 79, matchday: 29, homeTeam: "CP Cacereño", awayTeam: "Real Avilés Industrial" },
  { id: 80, matchday: 29, homeTeam: "CA Osasuna Promesas", awayTeam: "Arenas Club" },

  // Jornada 30
  { id: 81, matchday: 30, homeTeam: "CD Tenerife", awayTeam: "CF Talavera de la Reina" },
  { id: 82, matchday: 30, homeTeam: "RC Celta Fortuna", awayTeam: "SD Ponferradina" },
  { id: 83, matchday: 30, homeTeam: "Pontevedra CF", awayTeam: "CD Arenteiro" },
  { id: 84, matchday: 30, homeTeam: "Bilbao Athletic", awayTeam: "CD Guadalajara" },
  { id: 85, matchday: 30, homeTeam: "Racing Ferrol", awayTeam: "Barakaldo CF" },
  { id: 86, matchday: 30, homeTeam: "Real Madrid Castilla", awayTeam: "Unionistas CF" },
  { id: 87, matchday: 30, homeTeam: "CD Lugo", awayTeam: "Zamora CF" },
  { id: 88, matchday: 30, homeTeam: "Real Avilés Industrial", awayTeam: "Ourense CF" },
  { id: 89, matchday: 30, homeTeam: "Mérida AD", awayTeam: "CP Cacereño" },
  { id: 90, matchday: 30, homeTeam: "Arenas Club", awayTeam: "CA Osasuna Promesas" },

  // Jornada 31
  { id: 91, matchday: 31, homeTeam: "Zamora CF", awayTeam: "CD Tenerife" },
  { id: 92, matchday: 31, homeTeam: "Barakaldo CF", awayTeam: "Pontevedra CF" },
  { id: 93, matchday: 31, homeTeam: "Unionistas CF", awayTeam: "CD Lugo" },
  { id: 94, matchday: 31, homeTeam: "SD Ponferradina", awayTeam: "Bilbao Athletic" },
  { id: 95, matchday: 31, homeTeam: "CF Talavera de la Reina", awayTeam: "Real Madrid Castilla" },
  { id: 96, matchday: 31, homeTeam: "CD Arenteiro", awayTeam: "RC Celta Fortuna" },
  { id: 97, matchday: 31, homeTeam: "CD Guadalajara", awayTeam: "Real Avilés Industrial" },
  { id: 98, matchday: 31, homeTeam: "Ourense CF", awayTeam: "Racing Ferrol" },
  { id: 99, matchday: 31, homeTeam: "CP Cacereño", awayTeam: "Mérida AD" },
  { id: 100, matchday: 31, homeTeam: "CA Osasuna Promesas", awayTeam: "Arenas Club" },

  // Jornada 32
  { id: 101, matchday: 32, homeTeam: "CD Tenerife", awayTeam: "CD Guadalajara" },
  { id: 102, matchday: 32, homeTeam: "RC Celta Fortuna", awayTeam: "CF Talavera de la Reina" },
  { id: 103, matchday: 32, homeTeam: "Pontevedra CF", awayTeam: "Unionistas CF" },
  { id: 104, matchday: 32, homeTeam: "Bilbao Athletic", awayTeam: "CD Arenteiro" },
  { id: 105, matchday: 32, homeTeam: "Racing Ferrol", awayTeam: "Real Madrid Castilla" },
  { id: 106, matchday: 32, homeTeam: "CD Lugo", awayTeam: "Barakaldo CF" },
  { id: 107, matchday: 32, homeTeam: "Real Avilés Industrial", awayTeam: "SD Ponferradina" },
  { id: 108, matchday: 32, homeTeam: "Mérida AD", awayTeam: "Zamora CF" },
  { id: 109, matchday: 32, homeTeam: "Arenas Club", awayTeam: "CP Cacereño" },
  { id: 110, matchday: 32, homeTeam: "Ourense CF", awayTeam: "CA Osasuna Promesas" },

  // Jornada 33
  { id: 111, matchday: 33, homeTeam: "Real Madrid Castilla", awayTeam: "CD Tenerife" },
  { id: 112, matchday: 33, homeTeam: "Zamora CF", awayTeam: "Pontevedra CF" },
  { id: 113, matchday: 33, homeTeam: "Barakaldo CF", awayTeam: "Real Avilés Industrial" },
  { id: 114, matchday: 33, homeTeam: "Unionistas CF", awayTeam: "RC Celta Fortuna" },
  { id: 115, matchday: 33, homeTeam: "SD Ponferradina", awayTeam: "Mérida AD" },
  { id: 116, matchday: 33, homeTeam: "CF Talavera de la Reina", awayTeam: "Racing Ferrol" },
  { id: 117, matchday: 33, homeTeam: "CD Arenteiro", awayTeam: "CD Lugo" },
  { id: 118, matchday: 33, homeTeam: "CD Guadalajara", awayTeam: "Bilbao Athletic" },
  { id: 119, matchday: 33, homeTeam: "CP Cacereño", awayTeam: "Ourense CF" },
  { id: 120, matchday: 33, homeTeam: "CA Osasuna Promesas", awayTeam: "Arenas Club" },

  // Jornada 34
  { id: 121, matchday: 34, homeTeam: "CD Tenerife", awayTeam: "CD Arenteiro" },
  { id: 122, matchday: 34, homeTeam: "RC Celta Fortuna", awayTeam: "CD Guadalajara" },
  { id: 123, matchday: 34, homeTeam: "Pontevedra CF", awayTeam: "Real Madrid Castilla" },
  { id: 124, matchday: 34, homeTeam: "Bilbao Athletic", awayTeam: "Barakaldo CF" },
  { id: 125, matchday: 34, homeTeam: "Racing Ferrol", awayTeam: "Unionistas CF" },
  { id: 126, matchday: 34, homeTeam: "CD Lugo", awayTeam: "SD Ponferradina" },
  { id: 127, matchday: 34, homeTeam: "Real Avilés Industrial", awayTeam: "CF Talavera de la Reina" },
  { id: 128, matchday: 34, homeTeam: "Mérida AD", awayTeam: "Ourense CF" },
  { id: 129, matchday: 34, homeTeam: "Arenas Club", awayTeam: "CP Cacereño" },
  { id: 130, matchday: 34, homeTeam: "Zamora CF", awayTeam: "CA Osasuna Promesas" },

  // Jornada 35
  { id: 131, matchday: 35, homeTeam: "Real Madrid Castilla", awayTeam: "Bilbao Athletic" },
  { id: 132, matchday: 35, homeTeam: "Barakaldo CF", awayTeam: "RC Celta Fortuna" },
  { id: 133, matchday: 35, homeTeam: "Unionistas CF", awayTeam: "CD Tenerife" },
  { id: 134, matchday: 35, homeTeam: "SD Ponferradina", awayTeam: "Zamora CF" },
  { id: 135, matchday: 35, homeTeam: "CF Talavera de la Reina", awayTeam: "Mérida AD" },
  { id: 136, matchday: 35, homeTeam: "CD Arenteiro", awayTeam: "Racing Ferrol" },
  { id: 137, matchday: 35, homeTeam: "CD Guadalajara", awayTeam: "Pontevedra CF" },
  { id: 138, matchday: 35, homeTeam: "Ourense CF", awayTeam: "Real Avilés Industrial" },
  { id: 139, matchday: 35, homeTeam: "CP Cacereño", awayTeam: "CD Lugo" },
  { id: 140, matchday: 35, homeTeam: "CA Osasuna Promesas", awayTeam: "Arenas Club" },

  // Jornada 36
  { id: 141, matchday: 36, homeTeam: "CD Tenerife", awayTeam: "SD Ponferradina" },
  { id: 142, matchday: 36, homeTeam: "RC Celta Fortuna", awayTeam: "Real Madrid Castilla" },
  { id: 143, matchday: 36, homeTeam: "Pontevedra CF", awayTeam: "CF Talavera de la Reina" },
  { id: 144, matchday: 36, homeTeam: "Bilbao Athletic", awayTeam: "Unionistas CF" },
  { id: 145, matchday: 36, homeTeam: "Racing Ferrol", awayTeam: "CD Guadalajara" },
  { id: 146, matchday: 36, homeTeam: "CD Lugo", awayTeam: "CD Arenteiro" },
  { id: 147, matchday: 36, homeTeam: "Zamora CF", awayTeam: "Barakaldo CF" },
  { id: 148, matchday: 36, homeTeam: "Real Avilés Industrial", awayTeam: "CA Osasuna Promesas" },
  { id: 149, matchday: 36, homeTeam: "Mérida AD", awayTeam: "Arenas Club" },
  { id: 150, matchday: 36, homeTeam: "Ourense CF", awayTeam: "CP Cacereño" },

  // Jornada 37
  { id: 151, matchday: 37, homeTeam: "Real Madrid Castilla", awayTeam: "Zamora CF" },
  { id: 152, matchday: 37, homeTeam: "Barakaldo CF", awayTeam: "CD Tenerife" },
  { id: 153, matchday: 37, homeTeam: "Unionistas CF", awayTeam: "Pontevedra CF" },
  { id: 154, matchday: 37, homeTeam: "SD Ponferradina", awayTeam: "Racing Ferrol" },
  { id: 155, matchday: 37, homeTeam: "CF Talavera de la Reina", awayTeam: "CD Lugo" },
  { id: 156, matchday: 37, homeTeam: "CD Arenteiro", awayTeam: "Real Avilés Industrial" },
  { id: 157, matchday: 37, homeTeam: "CD Guadalajara", awayTeam: "Mérida AD" },
  { id: 158, matchday: 37, homeTeam: "Arenas Club", awayTeam: "RC Celta Fortuna" },
  { id: 159, matchday: 37, homeTeam: "CP Cacereño", awayTeam: "Bilbao Athletic" },
  { id: 160, matchday: 37, homeTeam: "CA Osasuna Promesas", awayTeam: "Ourense CF" },

  // Jornada 38
  { id: 161, matchday: 38, homeTeam: "CD Tenerife", awayTeam: "Barakaldo CF" },
  { id: 162, matchday: 38, homeTeam: "RC Celta Fortuna", awayTeam: "Arenas Club" },
  { id: 163, matchday: 38, homeTeam: "Pontevedra CF", awayTeam: "CD Guadalajara" },
  { id: 164, matchday: 38, homeTeam: "Bilbao Athletic", awayTeam: "CP Cacereño" },
  { id: 165, matchday: 38, homeTeam: "Racing Ferrol", awayTeam: "SD Ponferradina" },
  { id: 166, matchday: 38, homeTeam: "CD Lugo", awayTeam: "CF Talavera de la Reina" },
  { id: 167, matchday: 38, homeTeam: "Zamora CF", awayTeam: "Real Madrid Castilla" },
  { id: 168, matchday: 38, homeTeam: "Real Avilés Industrial", awayTeam: "CD Arenteiro" },
  { id: 169, matchday: 38, homeTeam: "Mérida AD", awayTeam: "Unionistas CF" },
  { id: 170, matchday: 38, homeTeam: "Ourense CF", awayTeam: "CA Osasuna Promesas" },
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

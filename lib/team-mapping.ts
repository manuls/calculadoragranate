/**
 * Mapeo de nombres de equipos de BDFutbol a IDs de nuestra app
 * Los nombres están normalizados (minúsculas, sin acentos)
 */
export const teamNameMapping: Record<string, number> = {
  // ID 1 - CD Tenerife
  "tenerife": 1,
  "cd tenerife": 1,

  // ID 2 - RC Celta Fortuna
  "celta fortuna": 2,
  "rc celta fortuna": 2,

  // ID 3 - Pontevedra CF
  "pontevedra": 3,
  "pontevedra cf": 3,

  // ID 4 - Bilbao Athletic
  "bilbao athletic": 4,

  // ID 5 - Racing Ferrol
  "racing de ferrol": 5,
  "racing ferrol": 5,

  // ID 6 - Real Madrid Castilla
  "real madrid castilla": 6,

  // ID 7 - CD Lugo
  "lugo": 7,
  "cd lugo": 7,

  // ID 8 - Zamora CF
  "zamora": 8,
  "zamora cf": 8,

  // ID 9 - Real Avilés Industrial
  "aviles industrial": 9,
  "real aviles industrial": 9,
  "aviles": 9,

  // ID 10 - Barakaldo CF
  "barakaldo": 10,
  "barakaldo cf": 10,

  // ID 11 - Mérida AD
  "merida ad": 11,
  "merida": 11,

  // ID 12 - Unionistas CF
  "unionistas de salamanca": 12,
  "unionistas cf": 12,
  "unionistas": 12,

  // ID 13 - Arenas Club
  "arenas de getxo": 13,
  "arenas club": 13,
  "arenas": 13,

  // ID 14 - SD Ponferradina
  "ponferradina": 14,
  "sd ponferradina": 14,

  // ID 15 - Ourense CF
  "ourense cf": 15,
  "ourense": 15,

  // ID 16 - CF Talavera de la Reina
  "talavera de la reina": 16,
  "cf talavera de la reina": 16,
  "talavera": 16,

  // ID 17 - CP Cacereño
  "cacereno": 17,
  "cp cacereno": 17,

  // ID 18 - CD Arenteiro
  "arenteiro": 18,
  "cd arenteiro": 18,

  // ID 19 - CA Osasuna Promesas
  "osasuna b": 19,
  "ca osasuna promesas": 19,
  "osasuna promesas": 19,

  // ID 20 - CD Guadalajara
  "guadalajara": 20,
  "cd guadalajara": 20,
}

/**
 * Mapeo inverso: de ID a nombre oficial en nuestra app
 */
export const teamIdToName: Record<number, string> = {
  1: "CD Tenerife",
  2: "RC Celta Fortuna",
  3: "Pontevedra CF",
  4: "Bilbao Athletic",
  5: "Racing Ferrol",
  6: "Real Madrid Castilla",
  7: "CD Lugo",
  8: "Zamora CF",
  9: "Real Avilés Industrial",
  10: "Barakaldo CF",
  11: "Mérida AD",
  12: "Unionistas CF",
  13: "Arenas Club",
  14: "SD Ponferradina",
  15: "Ourense CF",
  16: "CF Talavera de la Reina",
  17: "CP Cacereño",
  18: "CD Arenteiro",
  19: "CA Osasuna Promesas",
  20: "CD Guadalajara",
}

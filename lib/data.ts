import type { Team, Match } from "./types"

// Datos oficiales de BDFutbol / Primera RFEF Grupo 1.
// Generado automáticamente por scripts/update-season-data.mjs el 2026-09-04T16:39:48.760Z.
// Clasificación general tras la jornada 1.
export const initialTeams: Team[] = [
  {
    "id": 16,
    "name": "Real Unión Club",
    "played": 1,
    "won": 1,
    "drawn": 0,
    "lost": 0,
    "goalsFor": 4,
    "goalsAgainst": 1,
    "points": 3,
    "logoUrl": "https://www.bdfutbol.com/i/eg/88.png",
    "initialPosition": 1
  },
  {
    "id": 7,
    "name": "CD Lugo",
    "played": 1,
    "won": 1,
    "drawn": 0,
    "lost": 0,
    "goalsFor": 3,
    "goalsAgainst": 1,
    "points": 3,
    "logoUrl": "https://www.bdfutbol.com/i/eg/76.png",
    "initialPosition": 2
  },
  {
    "id": 20,
    "name": "UD Logroñés",
    "played": 1,
    "won": 1,
    "drawn": 0,
    "lost": 0,
    "goalsFor": 2,
    "goalsAgainst": 1,
    "points": 3,
    "logoUrl": "https://www.bdfutbol.com/i/eg/178.png",
    "initialPosition": 3
  },
  {
    "id": 11,
    "name": "AD Mérida",
    "played": 1,
    "won": 1,
    "drawn": 0,
    "lost": 0,
    "goalsFor": 1,
    "goalsAgainst": 0,
    "points": 3,
    "logoUrl": "https://www.bdfutbol.com/i/eg/359b.png",
    "initialPosition": 4
  },
  {
    "id": 17,
    "name": "CP Cacereño",
    "played": 1,
    "won": 1,
    "drawn": 0,
    "lost": 0,
    "goalsFor": 1,
    "goalsAgainst": 0,
    "points": 3,
    "logoUrl": "https://www.bdfutbol.com/i/eg/149.png",
    "initialPosition": 5
  },
  {
    "id": 14,
    "name": "SD Ponferradina",
    "played": 1,
    "won": 1,
    "drawn": 0,
    "lost": 0,
    "goalsFor": 1,
    "goalsAgainst": 0,
    "points": 3,
    "logoUrl": "https://www.bdfutbol.com/i/eg/62.png",
    "initialPosition": 6
  },
  {
    "id": 3,
    "name": "Pontevedra CF",
    "played": 1,
    "won": 1,
    "drawn": 0,
    "lost": 0,
    "goalsFor": 1,
    "goalsAgainst": 0,
    "points": 3,
    "logoUrl": "https://www.bdfutbol.com/i/eg/58.png",
    "initialPosition": 7
  },
  {
    "id": 5,
    "name": "Racing Club Ferrol",
    "played": 1,
    "won": 0,
    "drawn": 1,
    "lost": 0,
    "goalsFor": 1,
    "goalsAgainst": 1,
    "points": 1,
    "logoUrl": "https://www.bdfutbol.com/i/eg/48.png",
    "initialPosition": 8
  },
  {
    "id": 13,
    "name": "Arenas Club",
    "played": 1,
    "won": 0,
    "drawn": 1,
    "lost": 0,
    "goalsFor": 1,
    "goalsAgainst": 1,
    "points": 1,
    "logoUrl": "https://www.bdfutbol.com/i/eg/87.png",
    "initialPosition": 9
  },
  {
    "id": 4,
    "name": "Bilbao Athletic",
    "played": 1,
    "won": 0,
    "drawn": 1,
    "lost": 0,
    "goalsFor": 1,
    "goalsAgainst": 1,
    "points": 1,
    "logoUrl": "https://www.bdfutbol.com/i/eg/6b.png",
    "initialPosition": 10
  },
  {
    "id": 8,
    "name": "Zamora CF",
    "played": 1,
    "won": 0,
    "drawn": 1,
    "lost": 0,
    "goalsFor": 1,
    "goalsAgainst": 1,
    "points": 1,
    "logoUrl": "https://www.bdfutbol.com/i/eg/95.png",
    "initialPosition": 11
  },
  {
    "id": 10,
    "name": "Barakaldo CF",
    "played": 1,
    "won": 0,
    "drawn": 1,
    "lost": 0,
    "goalsFor": 0,
    "goalsAgainst": 0,
    "points": 1,
    "logoUrl": "https://www.bdfutbol.com/i/eg/99.png",
    "initialPosition": 12
  },
  {
    "id": 2,
    "name": "CyD Leonesa",
    "played": 1,
    "won": 0,
    "drawn": 1,
    "lost": 0,
    "goalsFor": 0,
    "goalsAgainst": 0,
    "points": 1,
    "logoUrl": "https://www.bdfutbol.com/i/eg/84.png",
    "initialPosition": 13
  },
  {
    "id": 19,
    "name": "CD Extremadura",
    "played": 1,
    "won": 0,
    "drawn": 0,
    "lost": 1,
    "goalsFor": 1,
    "goalsAgainst": 2,
    "points": 0,
    "logoUrl": "https://www.bdfutbol.com/i/eg/515.png",
    "initialPosition": 14
  },
  {
    "id": 15,
    "name": "UD Ourense",
    "played": 1,
    "won": 0,
    "drawn": 0,
    "lost": 1,
    "goalsFor": 0,
    "goalsAgainst": 1,
    "points": 0,
    "logoUrl": "https://www.bdfutbol.com/i/eg/510.png",
    "initialPosition": 15
  },
  {
    "id": 1,
    "name": "CD Mirandés",
    "played": 1,
    "won": 0,
    "drawn": 0,
    "lost": 1,
    "goalsFor": 0,
    "goalsAgainst": 1,
    "points": 0,
    "logoUrl": "https://www.bdfutbol.com/i/eg/145.png",
    "initialPosition": 16
  },
  {
    "id": 6,
    "name": "RC Deportivo Fabril",
    "played": 1,
    "won": 0,
    "drawn": 0,
    "lost": 1,
    "goalsFor": 0,
    "goalsAgainst": 1,
    "points": 0,
    "logoUrl": "https://www.bdfutbol.com/i/eg/13l.png",
    "initialPosition": 17
  },
  {
    "id": 9,
    "name": "Real Avilés Industrial",
    "played": 1,
    "won": 0,
    "drawn": 0,
    "lost": 1,
    "goalsFor": 0,
    "goalsAgainst": 1,
    "points": 0,
    "logoUrl": "https://www.bdfutbol.com/i/eg/81.png",
    "initialPosition": 18
  },
  {
    "id": 12,
    "name": "Unionistas de Salamanca CF",
    "played": 1,
    "won": 0,
    "drawn": 0,
    "lost": 1,
    "goalsFor": 1,
    "goalsAgainst": 3,
    "points": 0,
    "logoUrl": "https://www.bdfutbol.com/i/eg/411.png",
    "initialPosition": 19
  },
  {
    "id": 18,
    "name": "CD Coria",
    "played": 1,
    "won": 0,
    "drawn": 0,
    "lost": 1,
    "goalsFor": 1,
    "goalsAgainst": 4,
    "points": 0,
    "logoUrl": "https://www.bdfutbol.com/i/eg/473.png",
    "initialPosition": 20
  }
]

export const playedMatches: Match[] = [
  {
    "id": 269408,
    "matchday": 1,
    "homeTeamId": 9,
    "awayTeamId": 3,
    "result": {
      "homeGoals": 0,
      "awayGoals": 1,
      "isOfficial": true
    },
    "locked": true
  },
  {
    "id": 269409,
    "matchday": 1,
    "homeTeamId": 17,
    "awayTeamId": 1,
    "result": {
      "homeGoals": 1,
      "awayGoals": 0,
      "isOfficial": true
    },
    "locked": true
  },
  {
    "id": 269410,
    "matchday": 1,
    "homeTeamId": 15,
    "awayTeamId": 14,
    "result": {
      "homeGoals": 0,
      "awayGoals": 1,
      "isOfficial": true
    },
    "locked": true
  },
  {
    "id": 269411,
    "matchday": 1,
    "homeTeamId": 13,
    "awayTeamId": 5,
    "result": {
      "homeGoals": 1,
      "awayGoals": 1,
      "isOfficial": true
    },
    "locked": true
  },
  {
    "id": 269412,
    "matchday": 1,
    "homeTeamId": 11,
    "awayTeamId": 6,
    "result": {
      "homeGoals": 1,
      "awayGoals": 0,
      "isOfficial": true
    },
    "locked": true
  },
  {
    "id": 269413,
    "matchday": 1,
    "homeTeamId": 8,
    "awayTeamId": 4,
    "result": {
      "homeGoals": 1,
      "awayGoals": 1,
      "isOfficial": true
    },
    "locked": true
  },
  {
    "id": 269414,
    "matchday": 1,
    "homeTeamId": 10,
    "awayTeamId": 2,
    "result": {
      "homeGoals": 0,
      "awayGoals": 0,
      "isOfficial": true
    },
    "locked": true
  },
  {
    "id": 269415,
    "matchday": 1,
    "homeTeamId": 16,
    "awayTeamId": 18,
    "result": {
      "homeGoals": 4,
      "awayGoals": 1,
      "isOfficial": true
    },
    "locked": true
  },
  {
    "id": 269416,
    "matchday": 1,
    "homeTeamId": 12,
    "awayTeamId": 7,
    "result": {
      "homeGoals": 1,
      "awayGoals": 3,
      "isOfficial": true
    },
    "locked": true
  },
  {
    "id": 269417,
    "matchday": 1,
    "homeTeamId": 20,
    "awayTeamId": 19,
    "result": {
      "homeGoals": 2,
      "awayGoals": 1,
      "isOfficial": true
    },
    "locked": true
  }
]

export const initialFixtures: Match[] = [
  {
    "id": 269418,
    "matchday": 2,
    "homeTeamId": 14,
    "awayTeamId": 7,
    "result": null
  },
  {
    "id": 269419,
    "matchday": 2,
    "homeTeamId": 1,
    "awayTeamId": 15,
    "result": null
  },
  {
    "id": 269420,
    "matchday": 2,
    "homeTeamId": 18,
    "awayTeamId": 10,
    "result": null
  },
  {
    "id": 269421,
    "matchday": 2,
    "homeTeamId": 3,
    "awayTeamId": 13,
    "result": null
  },
  {
    "id": 269422,
    "matchday": 2,
    "homeTeamId": 12,
    "awayTeamId": 16,
    "result": null
  },
  {
    "id": 269423,
    "matchday": 2,
    "homeTeamId": 6,
    "awayTeamId": 17,
    "result": null
  },
  {
    "id": 269424,
    "matchday": 2,
    "homeTeamId": 2,
    "awayTeamId": 11,
    "result": null
  },
  {
    "id": 269425,
    "matchday": 2,
    "homeTeamId": 4,
    "awayTeamId": 9,
    "result": null
  },
  {
    "id": 269426,
    "matchday": 2,
    "homeTeamId": 19,
    "awayTeamId": 5,
    "result": null
  },
  {
    "id": 269427,
    "matchday": 2,
    "homeTeamId": 8,
    "awayTeamId": 20,
    "result": null
  },
  {
    "id": 269428,
    "matchday": 3,
    "homeTeamId": 13,
    "awayTeamId": 8,
    "result": null
  },
  {
    "id": 269429,
    "matchday": 3,
    "homeTeamId": 10,
    "awayTeamId": 19,
    "result": null
  },
  {
    "id": 269430,
    "matchday": 3,
    "homeTeamId": 17,
    "awayTeamId": 2,
    "result": null
  },
  {
    "id": 269431,
    "matchday": 3,
    "homeTeamId": 6,
    "awayTeamId": 14,
    "result": null
  },
  {
    "id": 269432,
    "matchday": 3,
    "homeTeamId": 5,
    "awayTeamId": 16,
    "result": null
  },
  {
    "id": 269433,
    "matchday": 3,
    "homeTeamId": 7,
    "awayTeamId": 18,
    "result": null
  },
  {
    "id": 269434,
    "matchday": 3,
    "homeTeamId": 11,
    "awayTeamId": 1,
    "result": null
  },
  {
    "id": 269435,
    "matchday": 3,
    "homeTeamId": 15,
    "awayTeamId": 20,
    "result": null
  },
  {
    "id": 269436,
    "matchday": 3,
    "homeTeamId": 3,
    "awayTeamId": 4,
    "result": null
  },
  {
    "id": 269437,
    "matchday": 3,
    "homeTeamId": 9,
    "awayTeamId": 12,
    "result": null
  },
  {
    "id": 269438,
    "matchday": 4,
    "homeTeamId": 4,
    "awayTeamId": 6,
    "result": null
  },
  {
    "id": 269439,
    "matchday": 4,
    "homeTeamId": 18,
    "awayTeamId": 9,
    "result": null
  },
  {
    "id": 269440,
    "matchday": 4,
    "homeTeamId": 17,
    "awayTeamId": 13,
    "result": null
  },
  {
    "id": 269441,
    "matchday": 4,
    "homeTeamId": 19,
    "awayTeamId": 2,
    "result": null
  },
  {
    "id": 269442,
    "matchday": 4,
    "homeTeamId": 5,
    "awayTeamId": 10,
    "result": null
  },
  {
    "id": 269443,
    "matchday": 4,
    "homeTeamId": 16,
    "awayTeamId": 1,
    "result": null
  },
  {
    "id": 269444,
    "matchday": 4,
    "homeTeamId": 14,
    "awayTeamId": 11,
    "result": null
  },
  {
    "id": 269445,
    "matchday": 4,
    "homeTeamId": 20,
    "awayTeamId": 3,
    "result": null
  },
  {
    "id": 269446,
    "matchday": 4,
    "homeTeamId": 12,
    "awayTeamId": 15,
    "result": null
  },
  {
    "id": 269447,
    "matchday": 4,
    "homeTeamId": 8,
    "awayTeamId": 7,
    "result": null
  },
  {
    "id": 269448,
    "matchday": 5,
    "homeTeamId": 13,
    "awayTeamId": 4,
    "result": null
  },
  {
    "id": 269449,
    "matchday": 5,
    "homeTeamId": 10,
    "awayTeamId": 9,
    "result": null
  },
  {
    "id": 269450,
    "matchday": 5,
    "homeTeamId": 2,
    "awayTeamId": 18,
    "result": null
  },
  {
    "id": 269451,
    "matchday": 5,
    "homeTeamId": 6,
    "awayTeamId": 16,
    "result": null
  },
  {
    "id": 269452,
    "matchday": 5,
    "homeTeamId": 19,
    "awayTeamId": 8,
    "result": null
  },
  {
    "id": 269453,
    "matchday": 5,
    "homeTeamId": 7,
    "awayTeamId": 5,
    "result": null
  },
  {
    "id": 269454,
    "matchday": 5,
    "homeTeamId": 11,
    "awayTeamId": 20,
    "result": null
  },
  {
    "id": 269455,
    "matchday": 5,
    "homeTeamId": 1,
    "awayTeamId": 12,
    "result": null
  },
  {
    "id": 269456,
    "matchday": 5,
    "homeTeamId": 15,
    "awayTeamId": 17,
    "result": null
  },
  {
    "id": 269457,
    "matchday": 5,
    "homeTeamId": 3,
    "awayTeamId": 14,
    "result": null
  },
  {
    "id": 269458,
    "matchday": 6,
    "homeTeamId": 4,
    "awayTeamId": 19,
    "result": null
  },
  {
    "id": 269459,
    "matchday": 6,
    "homeTeamId": 10,
    "awayTeamId": 13,
    "result": null
  },
  {
    "id": 269460,
    "matchday": 6,
    "homeTeamId": 5,
    "awayTeamId": 3,
    "result": null
  },
  {
    "id": 269461,
    "matchday": 6,
    "homeTeamId": 11,
    "awayTeamId": 17,
    "result": null
  },
  {
    "id": 269462,
    "matchday": 6,
    "homeTeamId": 9,
    "awayTeamId": 7,
    "result": null
  },
  {
    "id": 269463,
    "matchday": 6,
    "homeTeamId": 16,
    "awayTeamId": 15,
    "result": null
  },
  {
    "id": 269464,
    "matchday": 6,
    "homeTeamId": 14,
    "awayTeamId": 1,
    "result": null
  },
  {
    "id": 269465,
    "matchday": 6,
    "homeTeamId": 20,
    "awayTeamId": 6,
    "result": null
  },
  {
    "id": 269466,
    "matchday": 6,
    "homeTeamId": 12,
    "awayTeamId": 2,
    "result": null
  },
  {
    "id": 269467,
    "matchday": 6,
    "homeTeamId": 8,
    "awayTeamId": 18,
    "result": null
  },
  {
    "id": 269468,
    "matchday": 7,
    "homeTeamId": 4,
    "awayTeamId": 16,
    "result": null
  },
  {
    "id": 269469,
    "matchday": 7,
    "homeTeamId": 18,
    "awayTeamId": 19,
    "result": null
  },
  {
    "id": 269470,
    "matchday": 7,
    "homeTeamId": 17,
    "awayTeamId": 12,
    "result": null
  },
  {
    "id": 269471,
    "matchday": 7,
    "homeTeamId": 2,
    "awayTeamId": 13,
    "result": null
  },
  {
    "id": 269472,
    "matchday": 7,
    "homeTeamId": 6,
    "awayTeamId": 5,
    "result": null
  },
  {
    "id": 269473,
    "matchday": 7,
    "homeTeamId": 7,
    "awayTeamId": 20,
    "result": null
  },
  {
    "id": 269474,
    "matchday": 7,
    "homeTeamId": 1,
    "awayTeamId": 8,
    "result": null
  },
  {
    "id": 269475,
    "matchday": 7,
    "homeTeamId": 15,
    "awayTeamId": 10,
    "result": null
  },
  {
    "id": 269476,
    "matchday": 7,
    "homeTeamId": 3,
    "awayTeamId": 11,
    "result": null
  },
  {
    "id": 269477,
    "matchday": 7,
    "homeTeamId": 14,
    "awayTeamId": 9,
    "result": null
  },
  {
    "id": 269478,
    "matchday": 8,
    "homeTeamId": 13,
    "awayTeamId": 11,
    "result": null
  },
  {
    "id": 269479,
    "matchday": 8,
    "homeTeamId": 10,
    "awayTeamId": 1,
    "result": null
  },
  {
    "id": 269480,
    "matchday": 8,
    "homeTeamId": 18,
    "awayTeamId": 4,
    "result": null
  },
  {
    "id": 269481,
    "matchday": 8,
    "homeTeamId": 19,
    "awayTeamId": 16,
    "result": null
  },
  {
    "id": 269482,
    "matchday": 8,
    "homeTeamId": 5,
    "awayTeamId": 12,
    "result": null
  },
  {
    "id": 269483,
    "matchday": 8,
    "homeTeamId": 7,
    "awayTeamId": 6,
    "result": null
  },
  {
    "id": 269484,
    "matchday": 8,
    "homeTeamId": 3,
    "awayTeamId": 17,
    "result": null
  },
  {
    "id": 269485,
    "matchday": 8,
    "homeTeamId": 9,
    "awayTeamId": 15,
    "result": null
  },
  {
    "id": 269486,
    "matchday": 8,
    "homeTeamId": 20,
    "awayTeamId": 2,
    "result": null
  },
  {
    "id": 269487,
    "matchday": 8,
    "homeTeamId": 8,
    "awayTeamId": 14,
    "result": null
  },
  {
    "id": 269488,
    "matchday": 9,
    "homeTeamId": 13,
    "awayTeamId": 15,
    "result": null
  },
  {
    "id": 269489,
    "matchday": 9,
    "homeTeamId": 17,
    "awayTeamId": 8,
    "result": null
  },
  {
    "id": 269490,
    "matchday": 9,
    "homeTeamId": 2,
    "awayTeamId": 3,
    "result": null
  },
  {
    "id": 269491,
    "matchday": 9,
    "homeTeamId": 6,
    "awayTeamId": 19,
    "result": null
  },
  {
    "id": 269492,
    "matchday": 9,
    "homeTeamId": 11,
    "awayTeamId": 18,
    "result": null
  },
  {
    "id": 269493,
    "matchday": 9,
    "homeTeamId": 1,
    "awayTeamId": 5,
    "result": null
  },
  {
    "id": 269494,
    "matchday": 9,
    "homeTeamId": 9,
    "awayTeamId": 20,
    "result": null
  },
  {
    "id": 269495,
    "matchday": 9,
    "homeTeamId": 16,
    "awayTeamId": 7,
    "result": null
  },
  {
    "id": 269496,
    "matchday": 9,
    "homeTeamId": 14,
    "awayTeamId": 10,
    "result": null
  },
  {
    "id": 269497,
    "matchday": 9,
    "homeTeamId": 12,
    "awayTeamId": 4,
    "result": null
  },
  {
    "id": 269498,
    "matchday": 10,
    "homeTeamId": 4,
    "awayTeamId": 17,
    "result": null
  },
  {
    "id": 269499,
    "matchday": 10,
    "homeTeamId": 10,
    "awayTeamId": 3,
    "result": null
  },
  {
    "id": 269500,
    "matchday": 10,
    "homeTeamId": 18,
    "awayTeamId": 13,
    "result": null
  },
  {
    "id": 269501,
    "matchday": 10,
    "homeTeamId": 19,
    "awayTeamId": 12,
    "result": null
  },
  {
    "id": 269502,
    "matchday": 10,
    "homeTeamId": 5,
    "awayTeamId": 14,
    "result": null
  },
  {
    "id": 269503,
    "matchday": 10,
    "homeTeamId": 7,
    "awayTeamId": 11,
    "result": null
  },
  {
    "id": 269504,
    "matchday": 10,
    "homeTeamId": 15,
    "awayTeamId": 2,
    "result": null
  },
  {
    "id": 269505,
    "matchday": 10,
    "homeTeamId": 16,
    "awayTeamId": 9,
    "result": null
  },
  {
    "id": 269506,
    "matchday": 10,
    "homeTeamId": 20,
    "awayTeamId": 1,
    "result": null
  },
  {
    "id": 269507,
    "matchday": 10,
    "homeTeamId": 8,
    "awayTeamId": 6,
    "result": null
  },
  {
    "id": 269508,
    "matchday": 11,
    "homeTeamId": 13,
    "awayTeamId": 6,
    "result": null
  },
  {
    "id": 269509,
    "matchday": 11,
    "homeTeamId": 10,
    "awayTeamId": 16,
    "result": null
  },
  {
    "id": 269510,
    "matchday": 11,
    "homeTeamId": 17,
    "awayTeamId": 7,
    "result": null
  },
  {
    "id": 269511,
    "matchday": 11,
    "homeTeamId": 2,
    "awayTeamId": 14,
    "result": null
  },
  {
    "id": 269512,
    "matchday": 11,
    "homeTeamId": 5,
    "awayTeamId": 20,
    "result": null
  },
  {
    "id": 269513,
    "matchday": 11,
    "homeTeamId": 11,
    "awayTeamId": 4,
    "result": null
  },
  {
    "id": 269514,
    "matchday": 11,
    "homeTeamId": 1,
    "awayTeamId": 18,
    "result": null
  },
  {
    "id": 269515,
    "matchday": 11,
    "homeTeamId": 3,
    "awayTeamId": 15,
    "result": null
  },
  {
    "id": 269516,
    "matchday": 11,
    "homeTeamId": 9,
    "awayTeamId": 19,
    "result": null
  },
  {
    "id": 269517,
    "matchday": 11,
    "homeTeamId": 12,
    "awayTeamId": 8,
    "result": null
  },
  {
    "id": 269518,
    "matchday": 12,
    "homeTeamId": 4,
    "awayTeamId": 5,
    "result": null
  },
  {
    "id": 269519,
    "matchday": 12,
    "homeTeamId": 18,
    "awayTeamId": 12,
    "result": null
  },
  {
    "id": 269520,
    "matchday": 12,
    "homeTeamId": 6,
    "awayTeamId": 10,
    "result": null
  },
  {
    "id": 269521,
    "matchday": 12,
    "homeTeamId": 19,
    "awayTeamId": 3,
    "result": null
  },
  {
    "id": 269522,
    "matchday": 12,
    "homeTeamId": 7,
    "awayTeamId": 1,
    "result": null
  },
  {
    "id": 269523,
    "matchday": 12,
    "homeTeamId": 15,
    "awayTeamId": 11,
    "result": null
  },
  {
    "id": 269524,
    "matchday": 12,
    "homeTeamId": 16,
    "awayTeamId": 2,
    "result": null
  },
  {
    "id": 269525,
    "matchday": 12,
    "homeTeamId": 14,
    "awayTeamId": 17,
    "result": null
  },
  {
    "id": 269526,
    "matchday": 12,
    "homeTeamId": 20,
    "awayTeamId": 13,
    "result": null
  },
  {
    "id": 269527,
    "matchday": 12,
    "homeTeamId": 8,
    "awayTeamId": 9,
    "result": null
  },
  {
    "id": 269528,
    "matchday": 13,
    "homeTeamId": 13,
    "awayTeamId": 9,
    "result": null
  },
  {
    "id": 269529,
    "matchday": 13,
    "homeTeamId": 10,
    "awayTeamId": 12,
    "result": null
  },
  {
    "id": 269530,
    "matchday": 13,
    "homeTeamId": 17,
    "awayTeamId": 20,
    "result": null
  },
  {
    "id": 269531,
    "matchday": 13,
    "homeTeamId": 2,
    "awayTeamId": 8,
    "result": null
  },
  {
    "id": 269532,
    "matchday": 13,
    "homeTeamId": 6,
    "awayTeamId": 18,
    "result": null
  },
  {
    "id": 269533,
    "matchday": 13,
    "homeTeamId": 11,
    "awayTeamId": 16,
    "result": null
  },
  {
    "id": 269534,
    "matchday": 13,
    "homeTeamId": 1,
    "awayTeamId": 4,
    "result": null
  },
  {
    "id": 269535,
    "matchday": 13,
    "homeTeamId": 15,
    "awayTeamId": 5,
    "result": null
  },
  {
    "id": 269536,
    "matchday": 13,
    "homeTeamId": 3,
    "awayTeamId": 7,
    "result": null
  },
  {
    "id": 269537,
    "matchday": 13,
    "homeTeamId": 14,
    "awayTeamId": 19,
    "result": null
  },
  {
    "id": 269538,
    "matchday": 14,
    "homeTeamId": 4,
    "awayTeamId": 2,
    "result": null
  },
  {
    "id": 269539,
    "matchday": 14,
    "homeTeamId": 18,
    "awayTeamId": 14,
    "result": null
  },
  {
    "id": 269540,
    "matchday": 14,
    "homeTeamId": 19,
    "awayTeamId": 17,
    "result": null
  },
  {
    "id": 269541,
    "matchday": 14,
    "homeTeamId": 5,
    "awayTeamId": 11,
    "result": null
  },
  {
    "id": 269542,
    "matchday": 14,
    "homeTeamId": 7,
    "awayTeamId": 15,
    "result": null
  },
  {
    "id": 269543,
    "matchday": 14,
    "homeTeamId": 9,
    "awayTeamId": 1,
    "result": null
  },
  {
    "id": 269544,
    "matchday": 14,
    "homeTeamId": 16,
    "awayTeamId": 13,
    "result": null
  },
  {
    "id": 269545,
    "matchday": 14,
    "homeTeamId": 20,
    "awayTeamId": 10,
    "result": null
  },
  {
    "id": 269546,
    "matchday": 14,
    "homeTeamId": 12,
    "awayTeamId": 6,
    "result": null
  },
  {
    "id": 269547,
    "matchday": 14,
    "homeTeamId": 8,
    "awayTeamId": 3,
    "result": null
  },
  {
    "id": 269548,
    "matchday": 15,
    "homeTeamId": 13,
    "awayTeamId": 7,
    "result": null
  },
  {
    "id": 269549,
    "matchday": 15,
    "homeTeamId": 10,
    "awayTeamId": 4,
    "result": null
  },
  {
    "id": 269550,
    "matchday": 15,
    "homeTeamId": 17,
    "awayTeamId": 16,
    "result": null
  },
  {
    "id": 269551,
    "matchday": 15,
    "homeTeamId": 2,
    "awayTeamId": 5,
    "result": null
  },
  {
    "id": 269552,
    "matchday": 15,
    "homeTeamId": 6,
    "awayTeamId": 9,
    "result": null
  },
  {
    "id": 269553,
    "matchday": 15,
    "homeTeamId": 11,
    "awayTeamId": 8,
    "result": null
  },
  {
    "id": 269554,
    "matchday": 15,
    "homeTeamId": 1,
    "awayTeamId": 19,
    "result": null
  },
  {
    "id": 269555,
    "matchday": 15,
    "homeTeamId": 15,
    "awayTeamId": 18,
    "result": null
  },
  {
    "id": 269556,
    "matchday": 15,
    "homeTeamId": 3,
    "awayTeamId": 12,
    "result": null
  },
  {
    "id": 269557,
    "matchday": 15,
    "homeTeamId": 14,
    "awayTeamId": 20,
    "result": null
  },
  {
    "id": 269558,
    "matchday": 16,
    "homeTeamId": 4,
    "awayTeamId": 15,
    "result": null
  },
  {
    "id": 269559,
    "matchday": 16,
    "homeTeamId": 18,
    "awayTeamId": 20,
    "result": null
  },
  {
    "id": 269560,
    "matchday": 16,
    "homeTeamId": 19,
    "awayTeamId": 13,
    "result": null
  },
  {
    "id": 269561,
    "matchday": 16,
    "homeTeamId": 5,
    "awayTeamId": 17,
    "result": null
  },
  {
    "id": 269562,
    "matchday": 16,
    "homeTeamId": 7,
    "awayTeamId": 2,
    "result": null
  },
  {
    "id": 269563,
    "matchday": 16,
    "homeTeamId": 1,
    "awayTeamId": 6,
    "result": null
  },
  {
    "id": 269564,
    "matchday": 16,
    "homeTeamId": 9,
    "awayTeamId": 11,
    "result": null
  },
  {
    "id": 269565,
    "matchday": 16,
    "homeTeamId": 16,
    "awayTeamId": 3,
    "result": null
  },
  {
    "id": 269566,
    "matchday": 16,
    "homeTeamId": 12,
    "awayTeamId": 14,
    "result": null
  },
  {
    "id": 269567,
    "matchday": 16,
    "homeTeamId": 8,
    "awayTeamId": 10,
    "result": null
  },
  {
    "id": 269568,
    "matchday": 17,
    "homeTeamId": 13,
    "awayTeamId": 12,
    "result": null
  },
  {
    "id": 269569,
    "matchday": 17,
    "homeTeamId": 17,
    "awayTeamId": 18,
    "result": null
  },
  {
    "id": 269570,
    "matchday": 17,
    "homeTeamId": 2,
    "awayTeamId": 9,
    "result": null
  },
  {
    "id": 269571,
    "matchday": 17,
    "homeTeamId": 5,
    "awayTeamId": 8,
    "result": null
  },
  {
    "id": 269572,
    "matchday": 17,
    "homeTeamId": 7,
    "awayTeamId": 10,
    "result": null
  },
  {
    "id": 269573,
    "matchday": 17,
    "homeTeamId": 11,
    "awayTeamId": 19,
    "result": null
  },
  {
    "id": 269574,
    "matchday": 17,
    "homeTeamId": 15,
    "awayTeamId": 6,
    "result": null
  },
  {
    "id": 269575,
    "matchday": 17,
    "homeTeamId": 3,
    "awayTeamId": 1,
    "result": null
  },
  {
    "id": 269576,
    "matchday": 17,
    "homeTeamId": 14,
    "awayTeamId": 4,
    "result": null
  },
  {
    "id": 269577,
    "matchday": 17,
    "homeTeamId": 20,
    "awayTeamId": 16,
    "result": null
  },
  {
    "id": 269578,
    "matchday": 18,
    "homeTeamId": 4,
    "awayTeamId": 7,
    "result": null
  },
  {
    "id": 269579,
    "matchday": 18,
    "homeTeamId": 10,
    "awayTeamId": 11,
    "result": null
  },
  {
    "id": 269580,
    "matchday": 18,
    "homeTeamId": 18,
    "awayTeamId": 5,
    "result": null
  },
  {
    "id": 269581,
    "matchday": 18,
    "homeTeamId": 6,
    "awayTeamId": 3,
    "result": null
  },
  {
    "id": 269582,
    "matchday": 18,
    "homeTeamId": 19,
    "awayTeamId": 15,
    "result": null
  },
  {
    "id": 269583,
    "matchday": 18,
    "homeTeamId": 1,
    "awayTeamId": 2,
    "result": null
  },
  {
    "id": 269584,
    "matchday": 18,
    "homeTeamId": 9,
    "awayTeamId": 17,
    "result": null
  },
  {
    "id": 269585,
    "matchday": 18,
    "homeTeamId": 14,
    "awayTeamId": 13,
    "result": null
  },
  {
    "id": 269586,
    "matchday": 18,
    "homeTeamId": 12,
    "awayTeamId": 20,
    "result": null
  },
  {
    "id": 269587,
    "matchday": 18,
    "homeTeamId": 8,
    "awayTeamId": 16,
    "result": null
  },
  {
    "id": 269588,
    "matchday": 19,
    "homeTeamId": 13,
    "awayTeamId": 1,
    "result": null
  },
  {
    "id": 269589,
    "matchday": 19,
    "homeTeamId": 17,
    "awayTeamId": 10,
    "result": null
  },
  {
    "id": 269590,
    "matchday": 19,
    "homeTeamId": 2,
    "awayTeamId": 6,
    "result": null
  },
  {
    "id": 269591,
    "matchday": 19,
    "homeTeamId": 5,
    "awayTeamId": 9,
    "result": null
  },
  {
    "id": 269592,
    "matchday": 19,
    "homeTeamId": 7,
    "awayTeamId": 19,
    "result": null
  },
  {
    "id": 269593,
    "matchday": 19,
    "homeTeamId": 11,
    "awayTeamId": 12,
    "result": null
  },
  {
    "id": 269594,
    "matchday": 19,
    "homeTeamId": 15,
    "awayTeamId": 8,
    "result": null
  },
  {
    "id": 269595,
    "matchday": 19,
    "homeTeamId": 3,
    "awayTeamId": 18,
    "result": null
  },
  {
    "id": 269596,
    "matchday": 19,
    "homeTeamId": 16,
    "awayTeamId": 14,
    "result": null
  },
  {
    "id": 269597,
    "matchday": 19,
    "homeTeamId": 20,
    "awayTeamId": 4,
    "result": null
  },
  {
    "id": 269598,
    "matchday": 20,
    "homeTeamId": 4,
    "awayTeamId": 13,
    "result": null
  },
  {
    "id": 269599,
    "matchday": 20,
    "homeTeamId": 10,
    "awayTeamId": 5,
    "result": null
  },
  {
    "id": 269600,
    "matchday": 20,
    "homeTeamId": 18,
    "awayTeamId": 7,
    "result": null
  },
  {
    "id": 269601,
    "matchday": 20,
    "homeTeamId": 6,
    "awayTeamId": 11,
    "result": null
  },
  {
    "id": 269602,
    "matchday": 20,
    "homeTeamId": 19,
    "awayTeamId": 20,
    "result": null
  },
  {
    "id": 269603,
    "matchday": 20,
    "homeTeamId": 3,
    "awayTeamId": 2,
    "result": null
  },
  {
    "id": 269604,
    "matchday": 20,
    "homeTeamId": 9,
    "awayTeamId": 16,
    "result": null
  },
  {
    "id": 269605,
    "matchday": 20,
    "homeTeamId": 14,
    "awayTeamId": 15,
    "result": null
  },
  {
    "id": 269606,
    "matchday": 20,
    "homeTeamId": 12,
    "awayTeamId": 1,
    "result": null
  },
  {
    "id": 269607,
    "matchday": 20,
    "homeTeamId": 8,
    "awayTeamId": 17,
    "result": null
  },
  {
    "id": 269608,
    "matchday": 21,
    "homeTeamId": 13,
    "awayTeamId": 18,
    "result": null
  },
  {
    "id": 269609,
    "matchday": 21,
    "homeTeamId": 17,
    "awayTeamId": 4,
    "result": null
  },
  {
    "id": 269610,
    "matchday": 21,
    "homeTeamId": 2,
    "awayTeamId": 10,
    "result": null
  },
  {
    "id": 269611,
    "matchday": 21,
    "homeTeamId": 5,
    "awayTeamId": 6,
    "result": null
  },
  {
    "id": 269612,
    "matchday": 21,
    "homeTeamId": 7,
    "awayTeamId": 9,
    "result": null
  },
  {
    "id": 269613,
    "matchday": 21,
    "homeTeamId": 11,
    "awayTeamId": 3,
    "result": null
  },
  {
    "id": 269614,
    "matchday": 21,
    "homeTeamId": 1,
    "awayTeamId": 14,
    "result": null
  },
  {
    "id": 269615,
    "matchday": 21,
    "homeTeamId": 15,
    "awayTeamId": 12,
    "result": null
  },
  {
    "id": 269616,
    "matchday": 21,
    "homeTeamId": 16,
    "awayTeamId": 19,
    "result": null
  },
  {
    "id": 269617,
    "matchday": 21,
    "homeTeamId": 20,
    "awayTeamId": 8,
    "result": null
  },
  {
    "id": 269618,
    "matchday": 22,
    "homeTeamId": 4,
    "awayTeamId": 11,
    "result": null
  },
  {
    "id": 269619,
    "matchday": 22,
    "homeTeamId": 18,
    "awayTeamId": 2,
    "result": null
  },
  {
    "id": 269620,
    "matchday": 22,
    "homeTeamId": 6,
    "awayTeamId": 13,
    "result": null
  },
  {
    "id": 269621,
    "matchday": 22,
    "homeTeamId": 19,
    "awayTeamId": 9,
    "result": null
  },
  {
    "id": 269622,
    "matchday": 22,
    "homeTeamId": 15,
    "awayTeamId": 16,
    "result": null
  },
  {
    "id": 269623,
    "matchday": 22,
    "homeTeamId": 3,
    "awayTeamId": 10,
    "result": null
  },
  {
    "id": 269624,
    "matchday": 22,
    "homeTeamId": 14,
    "awayTeamId": 5,
    "result": null
  },
  {
    "id": 269625,
    "matchday": 22,
    "homeTeamId": 20,
    "awayTeamId": 7,
    "result": null
  },
  {
    "id": 269626,
    "matchday": 22,
    "homeTeamId": 12,
    "awayTeamId": 17,
    "result": null
  },
  {
    "id": 269627,
    "matchday": 22,
    "homeTeamId": 8,
    "awayTeamId": 1,
    "result": null
  },
  {
    "id": 269628,
    "matchday": 23,
    "homeTeamId": 4,
    "awayTeamId": 18,
    "result": null
  },
  {
    "id": 269629,
    "matchday": 23,
    "homeTeamId": 10,
    "awayTeamId": 6,
    "result": null
  },
  {
    "id": 269630,
    "matchday": 23,
    "homeTeamId": 17,
    "awayTeamId": 3,
    "result": null
  },
  {
    "id": 269631,
    "matchday": 23,
    "homeTeamId": 2,
    "awayTeamId": 19,
    "result": null
  },
  {
    "id": 269632,
    "matchday": 23,
    "homeTeamId": 5,
    "awayTeamId": 15,
    "result": null
  },
  {
    "id": 269633,
    "matchday": 23,
    "homeTeamId": 7,
    "awayTeamId": 8,
    "result": null
  },
  {
    "id": 269634,
    "matchday": 23,
    "homeTeamId": 11,
    "awayTeamId": 14,
    "result": null
  },
  {
    "id": 269635,
    "matchday": 23,
    "homeTeamId": 1,
    "awayTeamId": 20,
    "result": null
  },
  {
    "id": 269636,
    "matchday": 23,
    "homeTeamId": 9,
    "awayTeamId": 13,
    "result": null
  },
  {
    "id": 269637,
    "matchday": 23,
    "homeTeamId": 16,
    "awayTeamId": 12,
    "result": null
  },
  {
    "id": 269638,
    "matchday": 24,
    "homeTeamId": 13,
    "awayTeamId": 2,
    "result": null
  },
  {
    "id": 269639,
    "matchday": 24,
    "homeTeamId": 18,
    "awayTeamId": 16,
    "result": null
  },
  {
    "id": 269640,
    "matchday": 24,
    "homeTeamId": 6,
    "awayTeamId": 4,
    "result": null
  },
  {
    "id": 269641,
    "matchday": 24,
    "homeTeamId": 19,
    "awayTeamId": 10,
    "result": null
  },
  {
    "id": 269642,
    "matchday": 24,
    "homeTeamId": 1,
    "awayTeamId": 17,
    "result": null
  },
  {
    "id": 269643,
    "matchday": 24,
    "homeTeamId": 15,
    "awayTeamId": 7,
    "result": null
  },
  {
    "id": 269644,
    "matchday": 24,
    "homeTeamId": 3,
    "awayTeamId": 5,
    "result": null
  },
  {
    "id": 269645,
    "matchday": 24,
    "homeTeamId": 14,
    "awayTeamId": 8,
    "result": null
  },
  {
    "id": 269646,
    "matchday": 24,
    "homeTeamId": 20,
    "awayTeamId": 11,
    "result": null
  },
  {
    "id": 269647,
    "matchday": 24,
    "homeTeamId": 12,
    "awayTeamId": 9,
    "result": null
  },
  {
    "id": 269648,
    "matchday": 25,
    "homeTeamId": 4,
    "awayTeamId": 1,
    "result": null
  },
  {
    "id": 269649,
    "matchday": 25,
    "homeTeamId": 10,
    "awayTeamId": 20,
    "result": null
  },
  {
    "id": 269650,
    "matchday": 25,
    "homeTeamId": 17,
    "awayTeamId": 14,
    "result": null
  },
  {
    "id": 269651,
    "matchday": 25,
    "homeTeamId": 2,
    "awayTeamId": 12,
    "result": null
  },
  {
    "id": 269652,
    "matchday": 25,
    "homeTeamId": 5,
    "awayTeamId": 13,
    "result": null
  },
  {
    "id": 269653,
    "matchday": 25,
    "homeTeamId": 7,
    "awayTeamId": 3,
    "result": null
  },
  {
    "id": 269654,
    "matchday": 25,
    "homeTeamId": 11,
    "awayTeamId": 15,
    "result": null
  },
  {
    "id": 269655,
    "matchday": 25,
    "homeTeamId": 9,
    "awayTeamId": 18,
    "result": null
  },
  {
    "id": 269656,
    "matchday": 25,
    "homeTeamId": 16,
    "awayTeamId": 6,
    "result": null
  },
  {
    "id": 269657,
    "matchday": 25,
    "homeTeamId": 8,
    "awayTeamId": 19,
    "result": null
  },
  {
    "id": 269658,
    "matchday": 26,
    "homeTeamId": 13,
    "awayTeamId": 16,
    "result": null
  },
  {
    "id": 269659,
    "matchday": 26,
    "homeTeamId": 17,
    "awayTeamId": 5,
    "result": null
  },
  {
    "id": 269660,
    "matchday": 26,
    "homeTeamId": 6,
    "awayTeamId": 7,
    "result": null
  },
  {
    "id": 269661,
    "matchday": 26,
    "homeTeamId": 19,
    "awayTeamId": 18,
    "result": null
  },
  {
    "id": 269662,
    "matchday": 26,
    "homeTeamId": 1,
    "awayTeamId": 11,
    "result": null
  },
  {
    "id": 269663,
    "matchday": 26,
    "homeTeamId": 15,
    "awayTeamId": 4,
    "result": null
  },
  {
    "id": 269664,
    "matchday": 26,
    "homeTeamId": 14,
    "awayTeamId": 3,
    "result": null
  },
  {
    "id": 269665,
    "matchday": 26,
    "homeTeamId": 20,
    "awayTeamId": 9,
    "result": null
  },
  {
    "id": 269666,
    "matchday": 26,
    "homeTeamId": 12,
    "awayTeamId": 10,
    "result": null
  },
  {
    "id": 269667,
    "matchday": 26,
    "homeTeamId": 8,
    "awayTeamId": 2,
    "result": null
  },
  {
    "id": 269668,
    "matchday": 27,
    "homeTeamId": 4,
    "awayTeamId": 14,
    "result": null
  },
  {
    "id": 269669,
    "matchday": 27,
    "homeTeamId": 10,
    "awayTeamId": 15,
    "result": null
  },
  {
    "id": 269670,
    "matchday": 27,
    "homeTeamId": 18,
    "awayTeamId": 6,
    "result": null
  },
  {
    "id": 269671,
    "matchday": 27,
    "homeTeamId": 2,
    "awayTeamId": 20,
    "result": null
  },
  {
    "id": 269672,
    "matchday": 27,
    "homeTeamId": 5,
    "awayTeamId": 1,
    "result": null
  },
  {
    "id": 269673,
    "matchday": 27,
    "homeTeamId": 7,
    "awayTeamId": 12,
    "result": null
  },
  {
    "id": 269674,
    "matchday": 27,
    "homeTeamId": 11,
    "awayTeamId": 13,
    "result": null
  },
  {
    "id": 269675,
    "matchday": 27,
    "homeTeamId": 3,
    "awayTeamId": 19,
    "result": null
  },
  {
    "id": 269676,
    "matchday": 27,
    "homeTeamId": 9,
    "awayTeamId": 8,
    "result": null
  },
  {
    "id": 269677,
    "matchday": 27,
    "homeTeamId": 16,
    "awayTeamId": 17,
    "result": null
  },
  {
    "id": 269678,
    "matchday": 28,
    "homeTeamId": 13,
    "awayTeamId": 10,
    "result": null
  },
  {
    "id": 269679,
    "matchday": 28,
    "homeTeamId": 18,
    "awayTeamId": 17,
    "result": null
  },
  {
    "id": 269680,
    "matchday": 28,
    "homeTeamId": 2,
    "awayTeamId": 7,
    "result": null
  },
  {
    "id": 269681,
    "matchday": 28,
    "homeTeamId": 6,
    "awayTeamId": 12,
    "result": null
  },
  {
    "id": 269682,
    "matchday": 28,
    "homeTeamId": 19,
    "awayTeamId": 14,
    "result": null
  },
  {
    "id": 269683,
    "matchday": 28,
    "homeTeamId": 1,
    "awayTeamId": 3,
    "result": null
  },
  {
    "id": 269684,
    "matchday": 28,
    "homeTeamId": 15,
    "awayTeamId": 9,
    "result": null
  },
  {
    "id": 269685,
    "matchday": 28,
    "homeTeamId": 16,
    "awayTeamId": 4,
    "result": null
  },
  {
    "id": 269686,
    "matchday": 28,
    "homeTeamId": 20,
    "awayTeamId": 5,
    "result": null
  },
  {
    "id": 269687,
    "matchday": 28,
    "homeTeamId": 8,
    "awayTeamId": 11,
    "result": null
  },
  {
    "id": 269688,
    "matchday": 29,
    "homeTeamId": 13,
    "awayTeamId": 19,
    "result": null
  },
  {
    "id": 269689,
    "matchday": 29,
    "homeTeamId": 10,
    "awayTeamId": 8,
    "result": null
  },
  {
    "id": 269690,
    "matchday": 29,
    "homeTeamId": 17,
    "awayTeamId": 15,
    "result": null
  },
  {
    "id": 269691,
    "matchday": 29,
    "homeTeamId": 5,
    "awayTeamId": 4,
    "result": null
  },
  {
    "id": 269692,
    "matchday": 29,
    "homeTeamId": 11,
    "awayTeamId": 7,
    "result": null
  },
  {
    "id": 269693,
    "matchday": 29,
    "homeTeamId": 1,
    "awayTeamId": 16,
    "result": null
  },
  {
    "id": 269694,
    "matchday": 29,
    "homeTeamId": 3,
    "awayTeamId": 20,
    "result": null
  },
  {
    "id": 269695,
    "matchday": 29,
    "homeTeamId": 9,
    "awayTeamId": 6,
    "result": null
  },
  {
    "id": 269696,
    "matchday": 29,
    "homeTeamId": 14,
    "awayTeamId": 2,
    "result": null
  },
  {
    "id": 269697,
    "matchday": 29,
    "homeTeamId": 12,
    "awayTeamId": 18,
    "result": null
  },
  {
    "id": 269698,
    "matchday": 30,
    "homeTeamId": 4,
    "awayTeamId": 3,
    "result": null
  },
  {
    "id": 269699,
    "matchday": 30,
    "homeTeamId": 18,
    "awayTeamId": 8,
    "result": null
  },
  {
    "id": 269700,
    "matchday": 30,
    "homeTeamId": 6,
    "awayTeamId": 2,
    "result": null
  },
  {
    "id": 269701,
    "matchday": 30,
    "homeTeamId": 19,
    "awayTeamId": 11,
    "result": null
  },
  {
    "id": 269702,
    "matchday": 30,
    "homeTeamId": 7,
    "awayTeamId": 14,
    "result": null
  },
  {
    "id": 269703,
    "matchday": 30,
    "homeTeamId": 15,
    "awayTeamId": 1,
    "result": null
  },
  {
    "id": 269704,
    "matchday": 30,
    "homeTeamId": 9,
    "awayTeamId": 10,
    "result": null
  },
  {
    "id": 269705,
    "matchday": 30,
    "homeTeamId": 16,
    "awayTeamId": 5,
    "result": null
  },
  {
    "id": 269706,
    "matchday": 30,
    "homeTeamId": 20,
    "awayTeamId": 17,
    "result": null
  },
  {
    "id": 269707,
    "matchday": 30,
    "homeTeamId": 12,
    "awayTeamId": 13,
    "result": null
  },
  {
    "id": 269708,
    "matchday": 31,
    "homeTeamId": 4,
    "awayTeamId": 20,
    "result": null
  },
  {
    "id": 269709,
    "matchday": 31,
    "homeTeamId": 10,
    "awayTeamId": 18,
    "result": null
  },
  {
    "id": 269710,
    "matchday": 31,
    "homeTeamId": 17,
    "awayTeamId": 19,
    "result": null
  },
  {
    "id": 269711,
    "matchday": 31,
    "homeTeamId": 2,
    "awayTeamId": 15,
    "result": null
  },
  {
    "id": 269712,
    "matchday": 31,
    "homeTeamId": 5,
    "awayTeamId": 7,
    "result": null
  },
  {
    "id": 269713,
    "matchday": 31,
    "homeTeamId": 11,
    "awayTeamId": 9,
    "result": null
  },
  {
    "id": 269714,
    "matchday": 31,
    "homeTeamId": 1,
    "awayTeamId": 13,
    "result": null
  },
  {
    "id": 269715,
    "matchday": 31,
    "homeTeamId": 3,
    "awayTeamId": 6,
    "result": null
  },
  {
    "id": 269716,
    "matchday": 31,
    "homeTeamId": 14,
    "awayTeamId": 16,
    "result": null
  },
  {
    "id": 269717,
    "matchday": 31,
    "homeTeamId": 8,
    "awayTeamId": 12,
    "result": null
  },
  {
    "id": 269718,
    "matchday": 32,
    "homeTeamId": 13,
    "awayTeamId": 17,
    "result": null
  },
  {
    "id": 269719,
    "matchday": 32,
    "homeTeamId": 18,
    "awayTeamId": 11,
    "result": null
  },
  {
    "id": 269720,
    "matchday": 32,
    "homeTeamId": 6,
    "awayTeamId": 8,
    "result": null
  },
  {
    "id": 269721,
    "matchday": 32,
    "homeTeamId": 19,
    "awayTeamId": 1,
    "result": null
  },
  {
    "id": 269722,
    "matchday": 32,
    "homeTeamId": 7,
    "awayTeamId": 4,
    "result": null
  },
  {
    "id": 269723,
    "matchday": 32,
    "homeTeamId": 15,
    "awayTeamId": 3,
    "result": null
  },
  {
    "id": 269724,
    "matchday": 32,
    "homeTeamId": 9,
    "awayTeamId": 2,
    "result": null
  },
  {
    "id": 269725,
    "matchday": 32,
    "homeTeamId": 16,
    "awayTeamId": 10,
    "result": null
  },
  {
    "id": 269726,
    "matchday": 32,
    "homeTeamId": 20,
    "awayTeamId": 14,
    "result": null
  },
  {
    "id": 269727,
    "matchday": 32,
    "homeTeamId": 12,
    "awayTeamId": 5,
    "result": null
  },
  {
    "id": 269728,
    "matchday": 33,
    "homeTeamId": 4,
    "awayTeamId": 10,
    "result": null
  },
  {
    "id": 269729,
    "matchday": 33,
    "homeTeamId": 17,
    "awayTeamId": 11,
    "result": null
  },
  {
    "id": 269730,
    "matchday": 33,
    "homeTeamId": 2,
    "awayTeamId": 16,
    "result": null
  },
  {
    "id": 269731,
    "matchday": 33,
    "homeTeamId": 19,
    "awayTeamId": 6,
    "result": null
  },
  {
    "id": 269732,
    "matchday": 33,
    "homeTeamId": 5,
    "awayTeamId": 18,
    "result": null
  },
  {
    "id": 269733,
    "matchday": 33,
    "homeTeamId": 1,
    "awayTeamId": 7,
    "result": null
  },
  {
    "id": 269734,
    "matchday": 33,
    "homeTeamId": 3,
    "awayTeamId": 9,
    "result": null
  },
  {
    "id": 269735,
    "matchday": 33,
    "homeTeamId": 14,
    "awayTeamId": 12,
    "result": null
  },
  {
    "id": 269736,
    "matchday": 33,
    "homeTeamId": 20,
    "awayTeamId": 15,
    "result": null
  },
  {
    "id": 269737,
    "matchday": 33,
    "homeTeamId": 8,
    "awayTeamId": 13,
    "result": null
  },
  {
    "id": 269738,
    "matchday": 34,
    "homeTeamId": 13,
    "awayTeamId": 20,
    "result": null
  },
  {
    "id": 269739,
    "matchday": 34,
    "homeTeamId": 10,
    "awayTeamId": 14,
    "result": null
  },
  {
    "id": 269740,
    "matchday": 34,
    "homeTeamId": 18,
    "awayTeamId": 3,
    "result": null
  },
  {
    "id": 269741,
    "matchday": 34,
    "homeTeamId": 2,
    "awayTeamId": 1,
    "result": null
  },
  {
    "id": 269742,
    "matchday": 34,
    "homeTeamId": 6,
    "awayTeamId": 15,
    "result": null
  },
  {
    "id": 269743,
    "matchday": 34,
    "homeTeamId": 7,
    "awayTeamId": 17,
    "result": null
  },
  {
    "id": 269744,
    "matchday": 34,
    "homeTeamId": 11,
    "awayTeamId": 5,
    "result": null
  },
  {
    "id": 269745,
    "matchday": 34,
    "homeTeamId": 9,
    "awayTeamId": 4,
    "result": null
  },
  {
    "id": 269746,
    "matchday": 34,
    "homeTeamId": 16,
    "awayTeamId": 8,
    "result": null
  },
  {
    "id": 269747,
    "matchday": 34,
    "homeTeamId": 12,
    "awayTeamId": 19,
    "result": null
  },
  {
    "id": 269748,
    "matchday": 35,
    "homeTeamId": 4,
    "awayTeamId": 12,
    "result": null
  },
  {
    "id": 269749,
    "matchday": 35,
    "homeTeamId": 17,
    "awayTeamId": 9,
    "result": null
  },
  {
    "id": 269750,
    "matchday": 35,
    "homeTeamId": 5,
    "awayTeamId": 19,
    "result": null
  },
  {
    "id": 269751,
    "matchday": 35,
    "homeTeamId": 7,
    "awayTeamId": 16,
    "result": null
  },
  {
    "id": 269752,
    "matchday": 35,
    "homeTeamId": 11,
    "awayTeamId": 2,
    "result": null
  },
  {
    "id": 269753,
    "matchday": 35,
    "homeTeamId": 1,
    "awayTeamId": 10,
    "result": null
  },
  {
    "id": 269754,
    "matchday": 35,
    "homeTeamId": 15,
    "awayTeamId": 13,
    "result": null
  },
  {
    "id": 269755,
    "matchday": 35,
    "homeTeamId": 3,
    "awayTeamId": 8,
    "result": null
  },
  {
    "id": 269756,
    "matchday": 35,
    "homeTeamId": 14,
    "awayTeamId": 6,
    "result": null
  },
  {
    "id": 269757,
    "matchday": 35,
    "homeTeamId": 20,
    "awayTeamId": 18,
    "result": null
  },
  {
    "id": 269758,
    "matchday": 36,
    "homeTeamId": 13,
    "awayTeamId": 14,
    "result": null
  },
  {
    "id": 269759,
    "matchday": 36,
    "homeTeamId": 10,
    "awayTeamId": 7,
    "result": null
  },
  {
    "id": 269760,
    "matchday": 36,
    "homeTeamId": 18,
    "awayTeamId": 1,
    "result": null
  },
  {
    "id": 269761,
    "matchday": 36,
    "homeTeamId": 2,
    "awayTeamId": 17,
    "result": null
  },
  {
    "id": 269762,
    "matchday": 36,
    "homeTeamId": 6,
    "awayTeamId": 20,
    "result": null
  },
  {
    "id": 269763,
    "matchday": 36,
    "homeTeamId": 19,
    "awayTeamId": 4,
    "result": null
  },
  {
    "id": 269764,
    "matchday": 36,
    "homeTeamId": 9,
    "awayTeamId": 5,
    "result": null
  },
  {
    "id": 269765,
    "matchday": 36,
    "homeTeamId": 16,
    "awayTeamId": 11,
    "result": null
  },
  {
    "id": 269766,
    "matchday": 36,
    "homeTeamId": 12,
    "awayTeamId": 3,
    "result": null
  },
  {
    "id": 269767,
    "matchday": 36,
    "homeTeamId": 8,
    "awayTeamId": 15,
    "result": null
  },
  {
    "id": 269768,
    "matchday": 37,
    "homeTeamId": 4,
    "awayTeamId": 8,
    "result": null
  },
  {
    "id": 269769,
    "matchday": 37,
    "homeTeamId": 17,
    "awayTeamId": 6,
    "result": null
  },
  {
    "id": 269770,
    "matchday": 37,
    "homeTeamId": 5,
    "awayTeamId": 2,
    "result": null
  },
  {
    "id": 269771,
    "matchday": 37,
    "homeTeamId": 7,
    "awayTeamId": 13,
    "result": null
  },
  {
    "id": 269772,
    "matchday": 37,
    "homeTeamId": 11,
    "awayTeamId": 10,
    "result": null
  },
  {
    "id": 269773,
    "matchday": 37,
    "homeTeamId": 1,
    "awayTeamId": 9,
    "result": null
  },
  {
    "id": 269774,
    "matchday": 37,
    "homeTeamId": 15,
    "awayTeamId": 19,
    "result": null
  },
  {
    "id": 269775,
    "matchday": 37,
    "homeTeamId": 3,
    "awayTeamId": 16,
    "result": null
  },
  {
    "id": 269776,
    "matchday": 37,
    "homeTeamId": 14,
    "awayTeamId": 18,
    "result": null
  },
  {
    "id": 269777,
    "matchday": 37,
    "homeTeamId": 20,
    "awayTeamId": 12,
    "result": null
  },
  {
    "id": 269778,
    "matchday": 38,
    "homeTeamId": 13,
    "awayTeamId": 3,
    "result": null
  },
  {
    "id": 269779,
    "matchday": 38,
    "homeTeamId": 10,
    "awayTeamId": 17,
    "result": null
  },
  {
    "id": 269780,
    "matchday": 38,
    "homeTeamId": 18,
    "awayTeamId": 15,
    "result": null
  },
  {
    "id": 269781,
    "matchday": 38,
    "homeTeamId": 2,
    "awayTeamId": 4,
    "result": null
  },
  {
    "id": 269782,
    "matchday": 38,
    "homeTeamId": 6,
    "awayTeamId": 1,
    "result": null
  },
  {
    "id": 269783,
    "matchday": 38,
    "homeTeamId": 19,
    "awayTeamId": 7,
    "result": null
  },
  {
    "id": 269784,
    "matchday": 38,
    "homeTeamId": 9,
    "awayTeamId": 14,
    "result": null
  },
  {
    "id": 269785,
    "matchday": 38,
    "homeTeamId": 16,
    "awayTeamId": 20,
    "result": null
  },
  {
    "id": 269786,
    "matchday": 38,
    "homeTeamId": 12,
    "awayTeamId": 11,
    "result": null
  },
  {
    "id": 269787,
    "matchday": 38,
    "homeTeamId": 8,
    "awayTeamId": 5,
    "result": null
  }
]

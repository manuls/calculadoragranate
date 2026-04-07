import type { Team, Match } from "./types"

// Datos oficiales de BDFutbol / Primera RFEF Grupo 1.
// Generado automáticamente por scripts/update-season-data.mjs el 2026-04-07T15:28:50.244Z.
// Clasificación general tras la jornada 31.
export const initialTeams: Team[] = [
  {
    "id": 1,
    "name": "CD Tenerife",
    "played": 31,
    "won": 19,
    "drawn": 8,
    "lost": 4,
    "goalsFor": 51,
    "goalsAgainst": 18,
    "points": 65,
    "logoUrl": "https://tmssl.akamaized.net/images/wappen/medium/648.png?lm=1578091884",
    "initialPosition": 1
  },
  {
    "id": 2,
    "name": "RC Celta Fortuna",
    "played": 31,
    "won": 15,
    "drawn": 9,
    "lost": 7,
    "goalsFor": 47,
    "goalsAgainst": 42,
    "points": 54,
    "logoUrl": "https://tmssl.akamaized.net/images/wappen/medium/8733.png?lm=1406966406",
    "initialPosition": 2
  },
  {
    "id": 14,
    "name": "SD Ponferradina",
    "played": 31,
    "won": 13,
    "drawn": 8,
    "lost": 10,
    "goalsFor": 35,
    "goalsAgainst": 25,
    "points": 47,
    "logoUrl": "https://tmssl.akamaized.net/images/wappen/medium/4032.png?lm=1625561266",
    "initialPosition": 3
  },
  {
    "id": 10,
    "name": "Barakaldo CF",
    "played": 31,
    "won": 12,
    "drawn": 11,
    "lost": 8,
    "goalsFor": 40,
    "goalsAgainst": 32,
    "points": 47,
    "logoUrl": "https://tmssl.akamaized.net/images/wappen/medium/3708.png?lm=1422971751",
    "initialPosition": 4
  },
  {
    "id": 3,
    "name": "Pontevedra CF",
    "played": 30,
    "won": 11,
    "drawn": 13,
    "lost": 6,
    "goalsFor": 35,
    "goalsAgainst": 22,
    "points": 46,
    "logoUrl": "https://tmssl.akamaized.net/images/wappen/medium/5650.png?lm=1732278110",
    "initialPosition": 5
  },
  {
    "id": 6,
    "name": "Real Madrid Castilla",
    "played": 31,
    "won": 13,
    "drawn": 7,
    "lost": 11,
    "goalsFor": 46,
    "goalsAgainst": 41,
    "points": 46,
    "logoUrl": "https://tmssl.akamaized.net/images/wappen/medium/6767.png?lm=1729684474",
    "initialPosition": 6
  },
  {
    "id": 8,
    "name": "Zamora CF",
    "played": 31,
    "won": 12,
    "drawn": 10,
    "lost": 9,
    "goalsFor": 42,
    "goalsAgainst": 37,
    "points": 46,
    "logoUrl": "https://tmssl.akamaized.net/images/wappen/medium/10907.png?lm=1422972812",
    "initialPosition": 7
  },
  {
    "id": 7,
    "name": "CD Lugo",
    "played": 31,
    "won": 11,
    "drawn": 12,
    "lost": 8,
    "goalsFor": 30,
    "goalsAgainst": 30,
    "points": 45,
    "logoUrl": "https://tmssl.akamaized.net/images/wappen/medium/11000.png?lm=1405933427",
    "initialPosition": 8
  },
  {
    "id": 12,
    "name": "Unionistas CF",
    "played": 31,
    "won": 12,
    "drawn": 8,
    "lost": 11,
    "goalsFor": 44,
    "goalsAgainst": 42,
    "points": 44,
    "logoUrl": "https://tmssl.akamaized.net/images/wappen/medium/52397.png?lm=1468618498",
    "initialPosition": 9
  },
  {
    "id": 4,
    "name": "Bilbao Athletic",
    "played": 31,
    "won": 12,
    "drawn": 8,
    "lost": 11,
    "goalsFor": 33,
    "goalsAgainst": 35,
    "points": 44,
    "logoUrl": "https://tmssl.akamaized.net/images/wappen/medium/6688.png?lm=1695069038",
    "initialPosition": 10
  },
  {
    "id": 11,
    "name": "Mérida AD",
    "played": 31,
    "won": 12,
    "drawn": 8,
    "lost": 11,
    "goalsFor": 41,
    "goalsAgainst": 44,
    "points": 44,
    "logoUrl": "https://tmssl.akamaized.net/images/wappen/medium/46854.png?lm=1718102950",
    "initialPosition": 11
  },
  {
    "id": 5,
    "name": "Racing Ferrol",
    "played": 31,
    "won": 12,
    "drawn": 6,
    "lost": 13,
    "goalsFor": 35,
    "goalsAgainst": 36,
    "points": 42,
    "logoUrl": "https://tmssl.akamaized.net/images/wappen/medium/1176.png?lm=1702049971",
    "initialPosition": 12
  },
  {
    "id": 13,
    "name": "Arenas Club",
    "played": 30,
    "won": 12,
    "drawn": 5,
    "lost": 13,
    "goalsFor": 37,
    "goalsAgainst": 42,
    "points": 41,
    "logoUrl": "https://tmssl.akamaized.net/images/wappen/medium/16122.png?lm=1706197149",
    "initialPosition": 13
  },
  {
    "id": 9,
    "name": "Real Avilés Industrial",
    "played": 31,
    "won": 10,
    "drawn": 7,
    "lost": 14,
    "goalsFor": 45,
    "goalsAgainst": 53,
    "points": 37,
    "logoUrl": "https://tmssl.akamaized.net/images/wappen/medium/20844.png?lm=1705039777",
    "initialPosition": 14
  },
  {
    "id": 16,
    "name": "CF Talavera de la Reina",
    "played": 31,
    "won": 9,
    "drawn": 8,
    "lost": 14,
    "goalsFor": 32,
    "goalsAgainst": 40,
    "points": 35,
    "logoUrl": "https://tmssl.akamaized.net/images/wappen/medium/47421.png?lm=1468166961",
    "initialPosition": 15
  },
  {
    "id": 20,
    "name": "CD Guadalajara",
    "played": 31,
    "won": 9,
    "drawn": 8,
    "lost": 14,
    "goalsFor": 35,
    "goalsAgainst": 46,
    "points": 35,
    "logoUrl": "https://tmssl.akamaized.net/images/wappen/medium/16576.png?lm=1754924420",
    "initialPosition": 16
  },
  {
    "id": 15,
    "name": "Ourense CF",
    "played": 31,
    "won": 8,
    "drawn": 10,
    "lost": 13,
    "goalsFor": 32,
    "goalsAgainst": 35,
    "points": 34,
    "logoUrl": "https://tmssl.akamaized.net/images/wappen/medium/55398.png?lm=1472936726",
    "initialPosition": 17
  },
  {
    "id": 17,
    "name": "CP Cacereño",
    "played": 31,
    "won": 6,
    "drawn": 13,
    "lost": 12,
    "goalsFor": 29,
    "goalsAgainst": 41,
    "points": 31,
    "logoUrl": "https://tmssl.akamaized.net/images/wappen/medium/11602.png?lm=1637151598",
    "initialPosition": 18
  },
  {
    "id": 19,
    "name": "CA Osasuna Promesas",
    "played": 31,
    "won": 7,
    "drawn": 9,
    "lost": 15,
    "goalsFor": 23,
    "goalsAgainst": 37,
    "points": 30,
    "logoUrl": "https://tmssl.akamaized.net/images/wappen/medium/8516.png?lm=1686070938",
    "initialPosition": 19
  },
  {
    "id": 18,
    "name": "CD Arenteiro",
    "played": 31,
    "won": 6,
    "drawn": 8,
    "lost": 17,
    "goalsFor": 28,
    "goalsAgainst": 42,
    "points": 26,
    "logoUrl": "https://tmssl.akamaized.net/images/wappen/medium/58946.png?lm=1688843561",
    "initialPosition": 20
  }
]

export const playedMatches: Match[] = [
  {
    "id": 267118,
    "matchday": 1,
    "homeTeamId": 5,
    "awayTeamId": 16,
    "result": {
      "homeGoals": 2,
      "awayGoals": 1,
      "isOfficial": true
    },
    "locked": true
  },
  {
    "id": 267119,
    "matchday": 1,
    "homeTeamId": 13,
    "awayTeamId": 18,
    "result": {
      "homeGoals": 2,
      "awayGoals": 1,
      "isOfficial": true
    },
    "locked": true
  },
  {
    "id": 267120,
    "matchday": 1,
    "homeTeamId": 9,
    "awayTeamId": 14,
    "result": {
      "homeGoals": 0,
      "awayGoals": 3,
      "isOfficial": true
    },
    "locked": true
  },
  {
    "id": 267121,
    "matchday": 1,
    "homeTeamId": 20,
    "awayTeamId": 1,
    "result": {
      "homeGoals": 0,
      "awayGoals": 2,
      "isOfficial": true
    },
    "locked": true
  },
  {
    "id": 267122,
    "matchday": 1,
    "homeTeamId": 6,
    "awayTeamId": 7,
    "result": {
      "homeGoals": 2,
      "awayGoals": 1,
      "isOfficial": true
    },
    "locked": true
  },
  {
    "id": 267123,
    "matchday": 1,
    "homeTeamId": 8,
    "awayTeamId": 2,
    "result": {
      "homeGoals": 0,
      "awayGoals": 0,
      "isOfficial": true
    },
    "locked": true
  },
  {
    "id": 267124,
    "matchday": 1,
    "homeTeamId": 15,
    "awayTeamId": 4,
    "result": {
      "homeGoals": 0,
      "awayGoals": 0,
      "isOfficial": true
    },
    "locked": true
  },
  {
    "id": 267125,
    "matchday": 1,
    "homeTeamId": 11,
    "awayTeamId": 10,
    "result": {
      "homeGoals": 1,
      "awayGoals": 0,
      "isOfficial": true
    },
    "locked": true
  },
  {
    "id": 267126,
    "matchday": 1,
    "homeTeamId": 12,
    "awayTeamId": 19,
    "result": {
      "homeGoals": 0,
      "awayGoals": 1,
      "isOfficial": true
    },
    "locked": true
  },
  {
    "id": 267127,
    "matchday": 1,
    "homeTeamId": 3,
    "awayTeamId": 17,
    "result": {
      "homeGoals": 1,
      "awayGoals": 1,
      "isOfficial": true
    },
    "locked": true
  },
  {
    "id": 267128,
    "matchday": 2,
    "homeTeamId": 18,
    "awayTeamId": 12,
    "result": {
      "homeGoals": 1,
      "awayGoals": 0,
      "isOfficial": true
    },
    "locked": true
  },
  {
    "id": 267129,
    "matchday": 2,
    "homeTeamId": 2,
    "awayTeamId": 20,
    "result": {
      "homeGoals": 0,
      "awayGoals": 1,
      "isOfficial": true
    },
    "locked": true
  },
  {
    "id": 267130,
    "matchday": 2,
    "homeTeamId": 14,
    "awayTeamId": 3,
    "result": {
      "homeGoals": 0,
      "awayGoals": 1,
      "isOfficial": true
    },
    "locked": true
  },
  {
    "id": 267131,
    "matchday": 2,
    "homeTeamId": 10,
    "awayTeamId": 8,
    "result": {
      "homeGoals": 1,
      "awayGoals": 1,
      "isOfficial": true
    },
    "locked": true
  },
  {
    "id": 267132,
    "matchday": 2,
    "homeTeamId": 13,
    "awayTeamId": 17,
    "result": {
      "homeGoals": 2,
      "awayGoals": 2,
      "isOfficial": true
    },
    "locked": true
  },
  {
    "id": 267133,
    "matchday": 2,
    "homeTeamId": 19,
    "awayTeamId": 15,
    "result": {
      "homeGoals": 1,
      "awayGoals": 1,
      "isOfficial": true
    },
    "locked": true
  },
  {
    "id": 267134,
    "matchday": 2,
    "homeTeamId": 6,
    "awayTeamId": 5,
    "result": {
      "homeGoals": 0,
      "awayGoals": 1,
      "isOfficial": true
    },
    "locked": true
  },
  {
    "id": 267135,
    "matchday": 2,
    "homeTeamId": 16,
    "awayTeamId": 4,
    "result": {
      "homeGoals": 1,
      "awayGoals": 1,
      "isOfficial": true
    },
    "locked": true
  },
  {
    "id": 267136,
    "matchday": 2,
    "homeTeamId": 7,
    "awayTeamId": 9,
    "result": {
      "homeGoals": 0,
      "awayGoals": 0,
      "isOfficial": true
    },
    "locked": true
  },
  {
    "id": 267137,
    "matchday": 2,
    "homeTeamId": 1,
    "awayTeamId": 11,
    "result": {
      "homeGoals": 3,
      "awayGoals": 0,
      "isOfficial": true
    },
    "locked": true
  },
  {
    "id": 267138,
    "matchday": 3,
    "homeTeamId": 15,
    "awayTeamId": 16,
    "result": {
      "homeGoals": 1,
      "awayGoals": 2,
      "isOfficial": true
    },
    "locked": true
  },
  {
    "id": 267139,
    "matchday": 3,
    "homeTeamId": 5,
    "awayTeamId": 14,
    "result": {
      "homeGoals": 2,
      "awayGoals": 1,
      "isOfficial": true
    },
    "locked": true
  },
  {
    "id": 267140,
    "matchday": 3,
    "homeTeamId": 3,
    "awayTeamId": 1,
    "result": {
      "homeGoals": 0,
      "awayGoals": 2,
      "isOfficial": true
    },
    "locked": true
  },
  {
    "id": 267141,
    "matchday": 3,
    "homeTeamId": 4,
    "awayTeamId": 6,
    "result": {
      "homeGoals": 1,
      "awayGoals": 0,
      "isOfficial": true
    },
    "locked": true
  },
  {
    "id": 267142,
    "matchday": 3,
    "homeTeamId": 9,
    "awayTeamId": 19,
    "result": {
      "homeGoals": 2,
      "awayGoals": 0,
      "isOfficial": true
    },
    "locked": true
  },
  {
    "id": 267143,
    "matchday": 3,
    "homeTeamId": 20,
    "awayTeamId": 12,
    "result": {
      "homeGoals": 2,
      "awayGoals": 0,
      "isOfficial": true
    },
    "locked": true
  },
  {
    "id": 267144,
    "matchday": 3,
    "homeTeamId": 17,
    "awayTeamId": 18,
    "result": {
      "homeGoals": 0,
      "awayGoals": 2,
      "isOfficial": true
    },
    "locked": true
  },
  {
    "id": 267145,
    "matchday": 3,
    "homeTeamId": 11,
    "awayTeamId": 2,
    "result": {
      "homeGoals": 2,
      "awayGoals": 4,
      "isOfficial": true
    },
    "locked": true
  },
  {
    "id": 267146,
    "matchday": 3,
    "homeTeamId": 8,
    "awayTeamId": 7,
    "result": {
      "homeGoals": 1,
      "awayGoals": 0,
      "isOfficial": true
    },
    "locked": true
  },
  {
    "id": 267147,
    "matchday": 3,
    "homeTeamId": 10,
    "awayTeamId": 13,
    "result": {
      "homeGoals": 2,
      "awayGoals": 1,
      "isOfficial": true
    },
    "locked": true
  },
  {
    "id": 267148,
    "matchday": 4,
    "homeTeamId": 18,
    "awayTeamId": 8,
    "result": {
      "homeGoals": 0,
      "awayGoals": 0,
      "isOfficial": true
    },
    "locked": true
  },
  {
    "id": 267149,
    "matchday": 4,
    "homeTeamId": 4,
    "awayTeamId": 3,
    "result": {
      "homeGoals": 1,
      "awayGoals": 0,
      "isOfficial": true
    },
    "locked": true
  },
  {
    "id": 267150,
    "matchday": 4,
    "homeTeamId": 17,
    "awayTeamId": 11,
    "result": {
      "homeGoals": 2,
      "awayGoals": 1,
      "isOfficial": true
    },
    "locked": true
  },
  {
    "id": 267151,
    "matchday": 4,
    "homeTeamId": 1,
    "awayTeamId": 15,
    "result": {
      "homeGoals": 3,
      "awayGoals": 0,
      "isOfficial": true
    },
    "locked": true
  },
  {
    "id": 267152,
    "matchday": 4,
    "homeTeamId": 7,
    "awayTeamId": 5,
    "result": {
      "homeGoals": 2,
      "awayGoals": 1,
      "isOfficial": true
    },
    "locked": true
  },
  {
    "id": 267153,
    "matchday": 4,
    "homeTeamId": 16,
    "awayTeamId": 10,
    "result": {
      "homeGoals": 1,
      "awayGoals": 1,
      "isOfficial": true
    },
    "locked": true
  },
  {
    "id": 267154,
    "matchday": 4,
    "homeTeamId": 2,
    "awayTeamId": 13,
    "result": {
      "homeGoals": 2,
      "awayGoals": 0,
      "isOfficial": true
    },
    "locked": true
  },
  {
    "id": 267155,
    "matchday": 4,
    "homeTeamId": 12,
    "awayTeamId": 9,
    "result": {
      "homeGoals": 3,
      "awayGoals": 2,
      "isOfficial": true
    },
    "locked": true
  },
  {
    "id": 267156,
    "matchday": 4,
    "homeTeamId": 14,
    "awayTeamId": 20,
    "result": {
      "homeGoals": 1,
      "awayGoals": 3,
      "isOfficial": true
    },
    "locked": true
  },
  {
    "id": 267157,
    "matchday": 4,
    "homeTeamId": 19,
    "awayTeamId": 6,
    "result": {
      "homeGoals": 1,
      "awayGoals": 0,
      "isOfficial": true
    },
    "locked": true
  },
  {
    "id": 267158,
    "matchday": 5,
    "homeTeamId": 15,
    "awayTeamId": 3,
    "result": {
      "homeGoals": 1,
      "awayGoals": 2,
      "isOfficial": true
    },
    "locked": true
  },
  {
    "id": 267159,
    "matchday": 5,
    "homeTeamId": 5,
    "awayTeamId": 20,
    "result": {
      "homeGoals": 0,
      "awayGoals": 0,
      "isOfficial": true
    },
    "locked": true
  },
  {
    "id": 267160,
    "matchday": 5,
    "homeTeamId": 10,
    "awayTeamId": 17,
    "result": {
      "homeGoals": 1,
      "awayGoals": 1,
      "isOfficial": true
    },
    "locked": true
  },
  {
    "id": 267161,
    "matchday": 5,
    "homeTeamId": 13,
    "awayTeamId": 12,
    "result": {
      "homeGoals": 2,
      "awayGoals": 1,
      "isOfficial": true
    },
    "locked": true
  },
  {
    "id": 267162,
    "matchday": 5,
    "homeTeamId": 19,
    "awayTeamId": 14,
    "result": {
      "homeGoals": 0,
      "awayGoals": 0,
      "isOfficial": true
    },
    "locked": true
  },
  {
    "id": 267163,
    "matchday": 5,
    "homeTeamId": 6,
    "awayTeamId": 1,
    "result": {
      "homeGoals": 1,
      "awayGoals": 3,
      "isOfficial": true
    },
    "locked": true
  },
  {
    "id": 267164,
    "matchday": 5,
    "homeTeamId": 2,
    "awayTeamId": 18,
    "result": {
      "homeGoals": 2,
      "awayGoals": 1,
      "isOfficial": true
    },
    "locked": true
  },
  {
    "id": 267165,
    "matchday": 5,
    "homeTeamId": 16,
    "awayTeamId": 7,
    "result": {
      "homeGoals": 1,
      "awayGoals": 0,
      "isOfficial": true
    },
    "locked": true
  },
  {
    "id": 267166,
    "matchday": 5,
    "homeTeamId": 9,
    "awayTeamId": 4,
    "result": {
      "homeGoals": 3,
      "awayGoals": 2,
      "isOfficial": true
    },
    "locked": true
  },
  {
    "id": 267167,
    "matchday": 5,
    "homeTeamId": 8,
    "awayTeamId": 11,
    "result": {
      "homeGoals": 3,
      "awayGoals": 0,
      "isOfficial": true
    },
    "locked": true
  },
  {
    "id": 267168,
    "matchday": 6,
    "homeTeamId": 18,
    "awayTeamId": 10,
    "result": {
      "homeGoals": 1,
      "awayGoals": 1,
      "isOfficial": true
    },
    "locked": true
  },
  {
    "id": 267169,
    "matchday": 6,
    "homeTeamId": 5,
    "awayTeamId": 15,
    "result": {
      "homeGoals": 1,
      "awayGoals": 1,
      "isOfficial": true
    },
    "locked": true
  },
  {
    "id": 267170,
    "matchday": 6,
    "homeTeamId": 3,
    "awayTeamId": 16,
    "result": {
      "homeGoals": 2,
      "awayGoals": 1,
      "isOfficial": true
    },
    "locked": true
  },
  {
    "id": 267171,
    "matchday": 6,
    "homeTeamId": 4,
    "awayTeamId": 19,
    "result": {
      "homeGoals": 0,
      "awayGoals": 0,
      "isOfficial": true
    },
    "locked": true
  },
  {
    "id": 267172,
    "matchday": 6,
    "homeTeamId": 1,
    "awayTeamId": 8,
    "result": {
      "homeGoals": 3,
      "awayGoals": 1,
      "isOfficial": true
    },
    "locked": true
  },
  {
    "id": 267173,
    "matchday": 6,
    "homeTeamId": 12,
    "awayTeamId": 2,
    "result": {
      "homeGoals": 0,
      "awayGoals": 2,
      "isOfficial": true
    },
    "locked": true
  },
  {
    "id": 267174,
    "matchday": 6,
    "homeTeamId": 11,
    "awayTeamId": 13,
    "result": {
      "homeGoals": 3,
      "awayGoals": 0,
      "isOfficial": true
    },
    "locked": true
  },
  {
    "id": 267175,
    "matchday": 6,
    "homeTeamId": 20,
    "awayTeamId": 9,
    "result": {
      "homeGoals": 3,
      "awayGoals": 4,
      "isOfficial": true
    },
    "locked": true
  },
  {
    "id": 267176,
    "matchday": 6,
    "homeTeamId": 7,
    "awayTeamId": 17,
    "result": {
      "homeGoals": 1,
      "awayGoals": 0,
      "isOfficial": true
    },
    "locked": true
  },
  {
    "id": 267177,
    "matchday": 6,
    "homeTeamId": 14,
    "awayTeamId": 6,
    "result": {
      "homeGoals": 2,
      "awayGoals": 3,
      "isOfficial": true
    },
    "locked": true
  },
  {
    "id": 267178,
    "matchday": 7,
    "homeTeamId": 18,
    "awayTeamId": 20,
    "result": {
      "homeGoals": 0,
      "awayGoals": 0,
      "isOfficial": true
    },
    "locked": true
  },
  {
    "id": 267179,
    "matchday": 7,
    "homeTeamId": 2,
    "awayTeamId": 15,
    "result": {
      "homeGoals": 0,
      "awayGoals": 0,
      "isOfficial": true
    },
    "locked": true
  },
  {
    "id": 267180,
    "matchday": 7,
    "homeTeamId": 13,
    "awayTeamId": 7,
    "result": {
      "homeGoals": 0,
      "awayGoals": 0,
      "isOfficial": true
    },
    "locked": true
  },
  {
    "id": 267181,
    "matchday": 7,
    "homeTeamId": 17,
    "awayTeamId": 1,
    "result": {
      "homeGoals": 0,
      "awayGoals": 0,
      "isOfficial": true
    },
    "locked": true
  },
  {
    "id": 267182,
    "matchday": 7,
    "homeTeamId": 6,
    "awayTeamId": 3,
    "result": {
      "homeGoals": 1,
      "awayGoals": 0,
      "isOfficial": true
    },
    "locked": true
  },
  {
    "id": 267183,
    "matchday": 7,
    "homeTeamId": 19,
    "awayTeamId": 5,
    "result": {
      "homeGoals": 1,
      "awayGoals": 2,
      "isOfficial": true
    },
    "locked": true
  },
  {
    "id": 267184,
    "matchday": 7,
    "homeTeamId": 16,
    "awayTeamId": 14,
    "result": {
      "homeGoals": 0,
      "awayGoals": 1,
      "isOfficial": true
    },
    "locked": true
  },
  {
    "id": 267185,
    "matchday": 7,
    "homeTeamId": 10,
    "awayTeamId": 4,
    "result": {
      "homeGoals": 2,
      "awayGoals": 1,
      "isOfficial": true
    },
    "locked": true
  },
  {
    "id": 267186,
    "matchday": 7,
    "homeTeamId": 8,
    "awayTeamId": 9,
    "result": {
      "homeGoals": 2,
      "awayGoals": 3,
      "isOfficial": true
    },
    "locked": true
  },
  {
    "id": 267187,
    "matchday": 7,
    "homeTeamId": 12,
    "awayTeamId": 11,
    "result": {
      "homeGoals": 2,
      "awayGoals": 0,
      "isOfficial": true
    },
    "locked": true
  },
  {
    "id": 267188,
    "matchday": 8,
    "homeTeamId": 14,
    "awayTeamId": 8,
    "result": {
      "homeGoals": 2,
      "awayGoals": 0,
      "isOfficial": true
    },
    "locked": true
  },
  {
    "id": 267189,
    "matchday": 8,
    "homeTeamId": 4,
    "awayTeamId": 17,
    "result": {
      "homeGoals": 1,
      "awayGoals": 3,
      "isOfficial": true
    },
    "locked": true
  },
  {
    "id": 267190,
    "matchday": 8,
    "homeTeamId": 9,
    "awayTeamId": 16,
    "result": {
      "homeGoals": 1,
      "awayGoals": 1,
      "isOfficial": true
    },
    "locked": true
  },
  {
    "id": 267191,
    "matchday": 8,
    "homeTeamId": 11,
    "awayTeamId": 18,
    "result": {
      "homeGoals": 3,
      "awayGoals": 1,
      "isOfficial": true
    },
    "locked": true
  },
  {
    "id": 267192,
    "matchday": 8,
    "homeTeamId": 7,
    "awayTeamId": 2,
    "result": {
      "homeGoals": 2,
      "awayGoals": 0,
      "isOfficial": true
    },
    "locked": true
  },
  {
    "id": 267193,
    "matchday": 8,
    "homeTeamId": 20,
    "awayTeamId": 10,
    "result": {
      "homeGoals": 1,
      "awayGoals": 1,
      "isOfficial": true
    },
    "locked": true
  },
  {
    "id": 267194,
    "matchday": 8,
    "homeTeamId": 5,
    "awayTeamId": 13,
    "result": {
      "homeGoals": 3,
      "awayGoals": 1,
      "isOfficial": true
    },
    "locked": true
  },
  {
    "id": 267195,
    "matchday": 8,
    "homeTeamId": 3,
    "awayTeamId": 19,
    "result": {
      "homeGoals": 2,
      "awayGoals": 2,
      "isOfficial": true
    },
    "locked": true
  },
  {
    "id": 267196,
    "matchday": 8,
    "homeTeamId": 1,
    "awayTeamId": 12,
    "result": {
      "homeGoals": 0,
      "awayGoals": 2,
      "isOfficial": true
    },
    "locked": true
  },
  {
    "id": 267197,
    "matchday": 8,
    "homeTeamId": 15,
    "awayTeamId": 6,
    "result": {
      "homeGoals": 1,
      "awayGoals": 3,
      "isOfficial": true
    },
    "locked": true
  },
  {
    "id": 267198,
    "matchday": 9,
    "homeTeamId": 18,
    "awayTeamId": 3,
    "result": {
      "homeGoals": 0,
      "awayGoals": 0,
      "isOfficial": true
    },
    "locked": true
  },
  {
    "id": 267199,
    "matchday": 9,
    "homeTeamId": 2,
    "awayTeamId": 5,
    "result": {
      "homeGoals": 2,
      "awayGoals": 1,
      "isOfficial": true
    },
    "locked": true
  },
  {
    "id": 267200,
    "matchday": 9,
    "homeTeamId": 10,
    "awayTeamId": 1,
    "result": {
      "homeGoals": 2,
      "awayGoals": 0,
      "isOfficial": true
    },
    "locked": true
  },
  {
    "id": 267201,
    "matchday": 9,
    "homeTeamId": 13,
    "awayTeamId": 20,
    "result": {
      "homeGoals": 3,
      "awayGoals": 0,
      "isOfficial": true
    },
    "locked": true
  },
  {
    "id": 267202,
    "matchday": 9,
    "homeTeamId": 11,
    "awayTeamId": 14,
    "result": {
      "homeGoals": 0,
      "awayGoals": 0,
      "isOfficial": true
    },
    "locked": true
  },
  {
    "id": 267203,
    "matchday": 9,
    "homeTeamId": 17,
    "awayTeamId": 15,
    "result": {
      "homeGoals": 0,
      "awayGoals": 0,
      "isOfficial": true
    },
    "locked": true
  },
  {
    "id": 267204,
    "matchday": 9,
    "homeTeamId": 12,
    "awayTeamId": 7,
    "result": {
      "homeGoals": 0,
      "awayGoals": 0,
      "isOfficial": true
    },
    "locked": true
  },
  {
    "id": 267205,
    "matchday": 9,
    "homeTeamId": 8,
    "awayTeamId": 4,
    "result": {
      "homeGoals": 4,
      "awayGoals": 1,
      "isOfficial": true
    },
    "locked": true
  },
  {
    "id": 267206,
    "matchday": 9,
    "homeTeamId": 16,
    "awayTeamId": 19,
    "result": {
      "homeGoals": 2,
      "awayGoals": 0,
      "isOfficial": true
    },
    "locked": true
  },
  {
    "id": 267207,
    "matchday": 9,
    "homeTeamId": 6,
    "awayTeamId": 9,
    "result": {
      "homeGoals": 2,
      "awayGoals": 0,
      "isOfficial": true
    },
    "locked": true
  },
  {
    "id": 267208,
    "matchday": 10,
    "homeTeamId": 5,
    "awayTeamId": 1,
    "result": {
      "homeGoals": 0,
      "awayGoals": 2,
      "isOfficial": true
    },
    "locked": true
  },
  {
    "id": 267209,
    "matchday": 10,
    "homeTeamId": 3,
    "awayTeamId": 8,
    "result": {
      "homeGoals": 4,
      "awayGoals": 1,
      "isOfficial": true
    },
    "locked": true
  },
  {
    "id": 267210,
    "matchday": 10,
    "homeTeamId": 4,
    "awayTeamId": 12,
    "result": {
      "homeGoals": 0,
      "awayGoals": 0,
      "isOfficial": true
    },
    "locked": true
  },
  {
    "id": 267211,
    "matchday": 10,
    "homeTeamId": 20,
    "awayTeamId": 11,
    "result": {
      "homeGoals": 0,
      "awayGoals": 2,
      "isOfficial": true
    },
    "locked": true
  },
  {
    "id": 267212,
    "matchday": 10,
    "homeTeamId": 6,
    "awayTeamId": 16,
    "result": {
      "homeGoals": 1,
      "awayGoals": 0,
      "isOfficial": true
    },
    "locked": true
  },
  {
    "id": 267213,
    "matchday": 10,
    "homeTeamId": 9,
    "awayTeamId": 18,
    "result": {
      "homeGoals": 1,
      "awayGoals": 0,
      "isOfficial": true
    },
    "locked": true
  },
  {
    "id": 267214,
    "matchday": 10,
    "homeTeamId": 19,
    "awayTeamId": 2,
    "result": {
      "homeGoals": 1,
      "awayGoals": 1,
      "isOfficial": true
    },
    "locked": true
  },
  {
    "id": 267215,
    "matchday": 10,
    "homeTeamId": 7,
    "awayTeamId": 10,
    "result": {
      "homeGoals": 2,
      "awayGoals": 2,
      "isOfficial": true
    },
    "locked": true
  },
  {
    "id": 267216,
    "matchday": 10,
    "homeTeamId": 15,
    "awayTeamId": 13,
    "result": {
      "homeGoals": 1,
      "awayGoals": 0,
      "isOfficial": true
    },
    "locked": true
  },
  {
    "id": 267217,
    "matchday": 10,
    "homeTeamId": 14,
    "awayTeamId": 17,
    "result": {
      "homeGoals": 2,
      "awayGoals": 0,
      "isOfficial": true
    },
    "locked": true
  },
  {
    "id": 267218,
    "matchday": 11,
    "homeTeamId": 18,
    "awayTeamId": 5,
    "result": {
      "homeGoals": 0,
      "awayGoals": 2,
      "isOfficial": true
    },
    "locked": true
  },
  {
    "id": 267219,
    "matchday": 11,
    "homeTeamId": 2,
    "awayTeamId": 16,
    "result": {
      "homeGoals": 4,
      "awayGoals": 3,
      "isOfficial": true
    },
    "locked": true
  },
  {
    "id": 267220,
    "matchday": 11,
    "homeTeamId": 10,
    "awayTeamId": 14,
    "result": {
      "homeGoals": 0,
      "awayGoals": 0,
      "isOfficial": true
    },
    "locked": true
  },
  {
    "id": 267221,
    "matchday": 11,
    "homeTeamId": 13,
    "awayTeamId": 19,
    "result": {
      "homeGoals": 1,
      "awayGoals": 0,
      "isOfficial": true
    },
    "locked": true
  },
  {
    "id": 267222,
    "matchday": 11,
    "homeTeamId": 20,
    "awayTeamId": 7,
    "result": {
      "homeGoals": 1,
      "awayGoals": 1,
      "isOfficial": true
    },
    "locked": true
  },
  {
    "id": 267223,
    "matchday": 11,
    "homeTeamId": 8,
    "awayTeamId": 15,
    "result": {
      "homeGoals": 0,
      "awayGoals": 0,
      "isOfficial": true
    },
    "locked": true
  },
  {
    "id": 267224,
    "matchday": 11,
    "homeTeamId": 12,
    "awayTeamId": 3,
    "result": {
      "homeGoals": 1,
      "awayGoals": 1,
      "isOfficial": true
    },
    "locked": true
  },
  {
    "id": 267225,
    "matchday": 11,
    "homeTeamId": 1,
    "awayTeamId": 4,
    "result": {
      "homeGoals": 0,
      "awayGoals": 1,
      "isOfficial": true
    },
    "locked": true
  },
  {
    "id": 267226,
    "matchday": 11,
    "homeTeamId": 17,
    "awayTeamId": 9,
    "result": {
      "homeGoals": 0,
      "awayGoals": 4,
      "isOfficial": true
    },
    "locked": true
  },
  {
    "id": 267227,
    "matchday": 11,
    "homeTeamId": 11,
    "awayTeamId": 6,
    "result": {
      "homeGoals": 3,
      "awayGoals": 0,
      "isOfficial": true
    },
    "locked": true
  },
  {
    "id": 267228,
    "matchday": 12,
    "homeTeamId": 5,
    "awayTeamId": 8,
    "result": {
      "homeGoals": 1,
      "awayGoals": 0,
      "isOfficial": true
    },
    "locked": true
  },
  {
    "id": 267229,
    "matchday": 12,
    "homeTeamId": 4,
    "awayTeamId": 18,
    "result": {
      "homeGoals": 2,
      "awayGoals": 1,
      "isOfficial": true
    },
    "locked": true
  },
  {
    "id": 267230,
    "matchday": 12,
    "homeTeamId": 1,
    "awayTeamId": 2,
    "result": {
      "homeGoals": 4,
      "awayGoals": 0,
      "isOfficial": true
    },
    "locked": true
  },
  {
    "id": 267231,
    "matchday": 12,
    "homeTeamId": 14,
    "awayTeamId": 7,
    "result": {
      "homeGoals": 1,
      "awayGoals": 1,
      "isOfficial": true
    },
    "locked": true
  },
  {
    "id": 267232,
    "matchday": 12,
    "homeTeamId": 19,
    "awayTeamId": 10,
    "result": {
      "homeGoals": 2,
      "awayGoals": 0,
      "isOfficial": true
    },
    "locked": true
  },
  {
    "id": 267233,
    "matchday": 12,
    "homeTeamId": 9,
    "awayTeamId": 13,
    "result": {
      "homeGoals": 0,
      "awayGoals": 0,
      "isOfficial": true
    },
    "locked": true
  },
  {
    "id": 267234,
    "matchday": 12,
    "homeTeamId": 16,
    "awayTeamId": 12,
    "result": {
      "homeGoals": 0,
      "awayGoals": 1,
      "isOfficial": true
    },
    "locked": true
  },
  {
    "id": 267235,
    "matchday": 12,
    "homeTeamId": 3,
    "awayTeamId": 11,
    "result": {
      "homeGoals": 1,
      "awayGoals": 1,
      "isOfficial": true
    },
    "locked": true
  },
  {
    "id": 267236,
    "matchday": 12,
    "homeTeamId": 6,
    "awayTeamId": 17,
    "result": {
      "homeGoals": 2,
      "awayGoals": 0,
      "isOfficial": true
    },
    "locked": true
  },
  {
    "id": 267237,
    "matchday": 12,
    "homeTeamId": 15,
    "awayTeamId": 20,
    "result": {
      "homeGoals": 3,
      "awayGoals": 0,
      "isOfficial": true
    },
    "locked": true
  },
  {
    "id": 267238,
    "matchday": 13,
    "homeTeamId": 18,
    "awayTeamId": 15,
    "result": {
      "homeGoals": 0,
      "awayGoals": 2,
      "isOfficial": true
    },
    "locked": true
  },
  {
    "id": 267239,
    "matchday": 13,
    "homeTeamId": 2,
    "awayTeamId": 14,
    "result": {
      "homeGoals": 2,
      "awayGoals": 0,
      "isOfficial": true
    },
    "locked": true
  },
  {
    "id": 267240,
    "matchday": 13,
    "homeTeamId": 7,
    "awayTeamId": 3,
    "result": {
      "homeGoals": 1,
      "awayGoals": 0,
      "isOfficial": true
    },
    "locked": true
  },
  {
    "id": 267241,
    "matchday": 13,
    "homeTeamId": 10,
    "awayTeamId": 5,
    "result": {
      "homeGoals": 2,
      "awayGoals": 1,
      "isOfficial": true
    },
    "locked": true
  },
  {
    "id": 267242,
    "matchday": 13,
    "homeTeamId": 13,
    "awayTeamId": 1,
    "result": {
      "homeGoals": 1,
      "awayGoals": 4,
      "isOfficial": true
    },
    "locked": true
  },
  {
    "id": 267243,
    "matchday": 13,
    "homeTeamId": 17,
    "awayTeamId": 19,
    "result": {
      "homeGoals": 1,
      "awayGoals": 2,
      "isOfficial": true
    },
    "locked": true
  },
  {
    "id": 267244,
    "matchday": 13,
    "homeTeamId": 20,
    "awayTeamId": 4,
    "result": {
      "homeGoals": 2,
      "awayGoals": 3,
      "isOfficial": true
    },
    "locked": true
  },
  {
    "id": 267245,
    "matchday": 13,
    "homeTeamId": 11,
    "awayTeamId": 9,
    "result": {
      "homeGoals": 2,
      "awayGoals": 1,
      "isOfficial": true
    },
    "locked": true
  },
  {
    "id": 267246,
    "matchday": 13,
    "homeTeamId": 8,
    "awayTeamId": 16,
    "result": {
      "homeGoals": 2,
      "awayGoals": 1,
      "isOfficial": true
    },
    "locked": true
  },
  {
    "id": 267247,
    "matchday": 13,
    "homeTeamId": 12,
    "awayTeamId": 6,
    "result": {
      "homeGoals": 3,
      "awayGoals": 0,
      "isOfficial": true
    },
    "locked": true
  },
  {
    "id": 267248,
    "matchday": 14,
    "homeTeamId": 15,
    "awayTeamId": 12,
    "result": {
      "homeGoals": 4,
      "awayGoals": 3,
      "isOfficial": true
    },
    "locked": true
  },
  {
    "id": 267249,
    "matchday": 14,
    "homeTeamId": 5,
    "awayTeamId": 11,
    "result": {
      "homeGoals": 2,
      "awayGoals": 2,
      "isOfficial": true
    },
    "locked": true
  },
  {
    "id": 267250,
    "matchday": 14,
    "homeTeamId": 4,
    "awayTeamId": 7,
    "result": {
      "homeGoals": 2,
      "awayGoals": 0,
      "isOfficial": true
    },
    "locked": true
  },
  {
    "id": 267251,
    "matchday": 14,
    "homeTeamId": 19,
    "awayTeamId": 8,
    "result": {
      "homeGoals": 1,
      "awayGoals": 3,
      "isOfficial": true
    },
    "locked": true
  },
  {
    "id": 267252,
    "matchday": 14,
    "homeTeamId": 9,
    "awayTeamId": 2,
    "result": {
      "homeGoals": 1,
      "awayGoals": 2,
      "isOfficial": true
    },
    "locked": true
  },
  {
    "id": 267253,
    "matchday": 14,
    "homeTeamId": 1,
    "awayTeamId": 18,
    "result": {
      "homeGoals": 1,
      "awayGoals": 0,
      "isOfficial": true
    },
    "locked": true
  },
  {
    "id": 267254,
    "matchday": 14,
    "homeTeamId": 6,
    "awayTeamId": 10,
    "result": {
      "homeGoals": 2,
      "awayGoals": 1,
      "isOfficial": true
    },
    "locked": true
  },
  {
    "id": 267255,
    "matchday": 14,
    "homeTeamId": 14,
    "awayTeamId": 13,
    "result": {
      "homeGoals": 1,
      "awayGoals": 2,
      "isOfficial": true
    },
    "locked": true
  },
  {
    "id": 267256,
    "matchday": 14,
    "homeTeamId": 16,
    "awayTeamId": 17,
    "result": {
      "homeGoals": 0,
      "awayGoals": 1,
      "isOfficial": true
    },
    "locked": true
  },
  {
    "id": 267257,
    "matchday": 14,
    "homeTeamId": 3,
    "awayTeamId": 20,
    "result": {
      "homeGoals": 1,
      "awayGoals": 1,
      "isOfficial": true
    },
    "locked": true
  },
  {
    "id": 267258,
    "matchday": 15,
    "homeTeamId": 18,
    "awayTeamId": 16,
    "result": {
      "homeGoals": 1,
      "awayGoals": 0,
      "isOfficial": true
    },
    "locked": true
  },
  {
    "id": 267259,
    "matchday": 15,
    "homeTeamId": 2,
    "awayTeamId": 3,
    "result": {
      "homeGoals": 1,
      "awayGoals": 2,
      "isOfficial": true
    },
    "locked": true
  },
  {
    "id": 267260,
    "matchday": 15,
    "homeTeamId": 7,
    "awayTeamId": 1,
    "result": {
      "homeGoals": 2,
      "awayGoals": 2,
      "isOfficial": true
    },
    "locked": true
  },
  {
    "id": 267261,
    "matchday": 15,
    "homeTeamId": 13,
    "awayTeamId": 4,
    "result": {
      "homeGoals": 3,
      "awayGoals": 1,
      "isOfficial": true
    },
    "locked": true
  },
  {
    "id": 267262,
    "matchday": 15,
    "homeTeamId": 11,
    "awayTeamId": 15,
    "result": {
      "homeGoals": 3,
      "awayGoals": 2,
      "isOfficial": true
    },
    "locked": true
  },
  {
    "id": 267263,
    "matchday": 15,
    "homeTeamId": 17,
    "awayTeamId": 5,
    "result": {
      "homeGoals": 0,
      "awayGoals": 1,
      "isOfficial": true
    },
    "locked": true
  },
  {
    "id": 267264,
    "matchday": 15,
    "homeTeamId": 20,
    "awayTeamId": 19,
    "result": {
      "homeGoals": 1,
      "awayGoals": 0,
      "isOfficial": true
    },
    "locked": true
  },
  {
    "id": 267265,
    "matchday": 15,
    "homeTeamId": 12,
    "awayTeamId": 14,
    "result": {
      "homeGoals": 2,
      "awayGoals": 2,
      "isOfficial": true
    },
    "locked": true
  },
  {
    "id": 267266,
    "matchday": 15,
    "homeTeamId": 10,
    "awayTeamId": 9,
    "result": {
      "homeGoals": 1,
      "awayGoals": 2,
      "isOfficial": true
    },
    "locked": true
  },
  {
    "id": 267267,
    "matchday": 15,
    "homeTeamId": 8,
    "awayTeamId": 6,
    "result": {
      "homeGoals": 2,
      "awayGoals": 2,
      "isOfficial": true
    },
    "locked": true
  },
  {
    "id": 267268,
    "matchday": 16,
    "homeTeamId": 5,
    "awayTeamId": 12,
    "result": {
      "homeGoals": 2,
      "awayGoals": 1,
      "isOfficial": true
    },
    "locked": true
  },
  {
    "id": 267269,
    "matchday": 16,
    "homeTeamId": 4,
    "awayTeamId": 2,
    "result": {
      "homeGoals": 1,
      "awayGoals": 2,
      "isOfficial": true
    },
    "locked": true
  },
  {
    "id": 267270,
    "matchday": 16,
    "homeTeamId": 9,
    "awayTeamId": 1,
    "result": {
      "homeGoals": 0,
      "awayGoals": 1,
      "isOfficial": true
    },
    "locked": true
  },
  {
    "id": 267271,
    "matchday": 16,
    "homeTeamId": 17,
    "awayTeamId": 8,
    "result": {
      "homeGoals": 0,
      "awayGoals": 2,
      "isOfficial": true
    },
    "locked": true
  },
  {
    "id": 267272,
    "matchday": 16,
    "homeTeamId": 6,
    "awayTeamId": 20,
    "result": {
      "homeGoals": 3,
      "awayGoals": 1,
      "isOfficial": true
    },
    "locked": true
  },
  {
    "id": 267273,
    "matchday": 16,
    "homeTeamId": 14,
    "awayTeamId": 18,
    "result": {
      "homeGoals": 1,
      "awayGoals": 3,
      "isOfficial": true
    },
    "locked": true
  },
  {
    "id": 267274,
    "matchday": 16,
    "homeTeamId": 19,
    "awayTeamId": 7,
    "result": {
      "homeGoals": 0,
      "awayGoals": 0,
      "isOfficial": true
    },
    "locked": true
  },
  {
    "id": 267275,
    "matchday": 16,
    "homeTeamId": 15,
    "awayTeamId": 10,
    "result": {
      "homeGoals": 2,
      "awayGoals": 2,
      "isOfficial": true
    },
    "locked": true
  },
  {
    "id": 267276,
    "matchday": 16,
    "homeTeamId": 3,
    "awayTeamId": 13,
    "result": {
      "homeGoals": 2,
      "awayGoals": 0,
      "isOfficial": true
    },
    "locked": true
  },
  {
    "id": 267277,
    "matchday": 16,
    "homeTeamId": 16,
    "awayTeamId": 11,
    "result": {
      "homeGoals": 2,
      "awayGoals": 1,
      "isOfficial": true
    },
    "locked": true
  },
  {
    "id": 267278,
    "matchday": 17,
    "homeTeamId": 18,
    "awayTeamId": 19,
    "result": {
      "homeGoals": 2,
      "awayGoals": 0,
      "isOfficial": true
    },
    "locked": true
  },
  {
    "id": 267279,
    "matchday": 17,
    "homeTeamId": 7,
    "awayTeamId": 15,
    "result": {
      "homeGoals": 2,
      "awayGoals": 1,
      "isOfficial": true
    },
    "locked": true
  },
  {
    "id": 267280,
    "matchday": 17,
    "homeTeamId": 10,
    "awayTeamId": 3,
    "result": {
      "homeGoals": 0,
      "awayGoals": 1,
      "isOfficial": true
    },
    "locked": true
  },
  {
    "id": 267281,
    "matchday": 17,
    "homeTeamId": 13,
    "awayTeamId": 16,
    "result": {
      "homeGoals": 1,
      "awayGoals": 2,
      "isOfficial": true
    },
    "locked": true
  },
  {
    "id": 267282,
    "matchday": 17,
    "homeTeamId": 9,
    "awayTeamId": 5,
    "result": {
      "homeGoals": 2,
      "awayGoals": 1,
      "isOfficial": true
    },
    "locked": true
  },
  {
    "id": 267283,
    "matchday": 17,
    "homeTeamId": 20,
    "awayTeamId": 8,
    "result": {
      "homeGoals": 2,
      "awayGoals": 3,
      "isOfficial": true
    },
    "locked": true
  },
  {
    "id": 267284,
    "matchday": 17,
    "homeTeamId": 1,
    "awayTeamId": 14,
    "result": {
      "homeGoals": 2,
      "awayGoals": 0,
      "isOfficial": true
    },
    "locked": true
  },
  {
    "id": 267285,
    "matchday": 17,
    "homeTeamId": 11,
    "awayTeamId": 4,
    "result": {
      "homeGoals": 2,
      "awayGoals": 3,
      "isOfficial": true
    },
    "locked": true
  },
  {
    "id": 267286,
    "matchday": 17,
    "homeTeamId": 12,
    "awayTeamId": 17,
    "result": {
      "homeGoals": 2,
      "awayGoals": 2,
      "isOfficial": true
    },
    "locked": true
  },
  {
    "id": 267287,
    "matchday": 17,
    "homeTeamId": 2,
    "awayTeamId": 6,
    "result": {
      "homeGoals": 1,
      "awayGoals": 0,
      "isOfficial": true
    },
    "locked": true
  },
  {
    "id": 267288,
    "matchday": 18,
    "homeTeamId": 7,
    "awayTeamId": 11,
    "result": {
      "homeGoals": 1,
      "awayGoals": 0,
      "isOfficial": true
    },
    "locked": true
  },
  {
    "id": 267289,
    "matchday": 18,
    "homeTeamId": 4,
    "awayTeamId": 14,
    "result": {
      "homeGoals": 1,
      "awayGoals": 0,
      "isOfficial": true
    },
    "locked": true
  },
  {
    "id": 267290,
    "matchday": 18,
    "homeTeamId": 10,
    "awayTeamId": 12,
    "result": {
      "homeGoals": 5,
      "awayGoals": 0,
      "isOfficial": true
    },
    "locked": true
  },
  {
    "id": 267291,
    "matchday": 18,
    "homeTeamId": 19,
    "awayTeamId": 1,
    "result": {
      "homeGoals": 0,
      "awayGoals": 2,
      "isOfficial": true
    },
    "locked": true
  },
  {
    "id": 267292,
    "matchday": 18,
    "homeTeamId": 17,
    "awayTeamId": 2,
    "result": {
      "homeGoals": 2,
      "awayGoals": 3,
      "isOfficial": true
    },
    "locked": true
  },
  {
    "id": 267293,
    "matchday": 18,
    "homeTeamId": 6,
    "awayTeamId": 18,
    "result": {
      "homeGoals": 2,
      "awayGoals": 0,
      "isOfficial": true
    },
    "locked": true
  },
  {
    "id": 267294,
    "matchday": 18,
    "homeTeamId": 3,
    "awayTeamId": 5,
    "result": {
      "homeGoals": 2,
      "awayGoals": 1,
      "isOfficial": true
    },
    "locked": true
  },
  {
    "id": 267295,
    "matchday": 18,
    "homeTeamId": 8,
    "awayTeamId": 13,
    "result": {
      "homeGoals": 1,
      "awayGoals": 0,
      "isOfficial": true
    },
    "locked": true
  },
  {
    "id": 267296,
    "matchday": 18,
    "homeTeamId": 15,
    "awayTeamId": 9,
    "result": {
      "homeGoals": 2,
      "awayGoals": 1,
      "isOfficial": true
    },
    "locked": true
  },
  {
    "id": 267297,
    "matchday": 18,
    "homeTeamId": 16,
    "awayTeamId": 20,
    "result": {
      "homeGoals": 2,
      "awayGoals": 0,
      "isOfficial": true
    },
    "locked": true
  },
  {
    "id": 267298,
    "matchday": 19,
    "homeTeamId": 18,
    "awayTeamId": 7,
    "result": {
      "homeGoals": 0,
      "awayGoals": 2,
      "isOfficial": true
    },
    "locked": true
  },
  {
    "id": 267299,
    "matchday": 19,
    "homeTeamId": 13,
    "awayTeamId": 6,
    "result": {
      "homeGoals": 4,
      "awayGoals": 1,
      "isOfficial": true
    },
    "locked": true
  },
  {
    "id": 267300,
    "matchday": 19,
    "homeTeamId": 12,
    "awayTeamId": 8,
    "result": {
      "homeGoals": 0,
      "awayGoals": 0,
      "isOfficial": true
    },
    "locked": true
  },
  {
    "id": 267301,
    "matchday": 19,
    "homeTeamId": 9,
    "awayTeamId": 3,
    "result": {
      "homeGoals": 0,
      "awayGoals": 3,
      "isOfficial": true
    },
    "locked": true
  },
  {
    "id": 267302,
    "matchday": 19,
    "homeTeamId": 11,
    "awayTeamId": 19,
    "result": {
      "homeGoals": 1,
      "awayGoals": 0,
      "isOfficial": true
    },
    "locked": true
  },
  {
    "id": 267303,
    "matchday": 19,
    "homeTeamId": 14,
    "awayTeamId": 15,
    "result": {
      "homeGoals": 2,
      "awayGoals": 0,
      "isOfficial": true
    },
    "locked": true
  },
  {
    "id": 267304,
    "matchday": 19,
    "homeTeamId": 5,
    "awayTeamId": 4,
    "result": {
      "homeGoals": 0,
      "awayGoals": 1,
      "isOfficial": true
    },
    "locked": true
  },
  {
    "id": 267305,
    "matchday": 19,
    "homeTeamId": 2,
    "awayTeamId": 10,
    "result": {
      "homeGoals": 1,
      "awayGoals": 2,
      "isOfficial": true
    },
    "locked": true
  },
  {
    "id": 267306,
    "matchday": 19,
    "homeTeamId": 20,
    "awayTeamId": 17,
    "result": {
      "homeGoals": 1,
      "awayGoals": 1,
      "isOfficial": true
    },
    "locked": true
  },
  {
    "id": 267307,
    "matchday": 19,
    "homeTeamId": 1,
    "awayTeamId": 16,
    "result": {
      "homeGoals": 1,
      "awayGoals": 0,
      "isOfficial": true
    },
    "locked": true
  },
  {
    "id": 267308,
    "matchday": 20,
    "homeTeamId": 7,
    "awayTeamId": 12,
    "result": {
      "homeGoals": 1,
      "awayGoals": 3,
      "isOfficial": true
    },
    "locked": true
  },
  {
    "id": 267309,
    "matchday": 20,
    "homeTeamId": 4,
    "awayTeamId": 9,
    "result": {
      "homeGoals": 0,
      "awayGoals": 2,
      "isOfficial": true
    },
    "locked": true
  },
  {
    "id": 267310,
    "matchday": 20,
    "homeTeamId": 10,
    "awayTeamId": 20,
    "result": {
      "homeGoals": 2,
      "awayGoals": 1,
      "isOfficial": true
    },
    "locked": true
  },
  {
    "id": 267311,
    "matchday": 20,
    "homeTeamId": 6,
    "awayTeamId": 11,
    "result": {
      "homeGoals": 1,
      "awayGoals": 1,
      "isOfficial": true
    },
    "locked": true
  },
  {
    "id": 267312,
    "matchday": 20,
    "homeTeamId": 3,
    "awayTeamId": 18,
    "result": {
      "homeGoals": 1,
      "awayGoals": 1,
      "isOfficial": true
    },
    "locked": true
  },
  {
    "id": 267313,
    "matchday": 20,
    "homeTeamId": 16,
    "awayTeamId": 2,
    "result": {
      "homeGoals": 1,
      "awayGoals": 1,
      "isOfficial": true
    },
    "locked": true
  },
  {
    "id": 267314,
    "matchday": 20,
    "homeTeamId": 14,
    "awayTeamId": 5,
    "result": {
      "homeGoals": 3,
      "awayGoals": 0,
      "isOfficial": true
    },
    "locked": true
  },
  {
    "id": 267315,
    "matchday": 20,
    "homeTeamId": 17,
    "awayTeamId": 13,
    "result": {
      "homeGoals": 2,
      "awayGoals": 0,
      "isOfficial": true
    },
    "locked": true
  },
  {
    "id": 267316,
    "matchday": 20,
    "homeTeamId": 15,
    "awayTeamId": 19,
    "result": {
      "homeGoals": 2,
      "awayGoals": 0,
      "isOfficial": true
    },
    "locked": true
  },
  {
    "id": 267317,
    "matchday": 20,
    "homeTeamId": 8,
    "awayTeamId": 1,
    "result": {
      "homeGoals": 0,
      "awayGoals": 1,
      "isOfficial": true
    },
    "locked": true
  },
  {
    "id": 267318,
    "matchday": 21,
    "homeTeamId": 2,
    "awayTeamId": 8,
    "result": {
      "homeGoals": 3,
      "awayGoals": 3,
      "isOfficial": true
    },
    "locked": true
  },
  {
    "id": 267319,
    "matchday": 21,
    "homeTeamId": 4,
    "awayTeamId": 10,
    "result": {
      "homeGoals": 2,
      "awayGoals": 0,
      "isOfficial": true
    },
    "locked": true
  },
  {
    "id": 267320,
    "matchday": 21,
    "homeTeamId": 12,
    "awayTeamId": 16,
    "result": {
      "homeGoals": 5,
      "awayGoals": 1,
      "isOfficial": true
    },
    "locked": true
  },
  {
    "id": 267321,
    "matchday": 21,
    "homeTeamId": 9,
    "awayTeamId": 7,
    "result": {
      "homeGoals": 1,
      "awayGoals": 2,
      "isOfficial": true
    },
    "locked": true
  },
  {
    "id": 267322,
    "matchday": 21,
    "homeTeamId": 11,
    "awayTeamId": 3,
    "result": {
      "homeGoals": 1,
      "awayGoals": 1,
      "isOfficial": true
    },
    "locked": true
  },
  {
    "id": 267323,
    "matchday": 21,
    "homeTeamId": 20,
    "awayTeamId": 14,
    "result": {
      "homeGoals": 0,
      "awayGoals": 1,
      "isOfficial": true
    },
    "locked": true
  },
  {
    "id": 267324,
    "matchday": 21,
    "homeTeamId": 5,
    "awayTeamId": 18,
    "result": {
      "homeGoals": 2,
      "awayGoals": 0,
      "isOfficial": true
    },
    "locked": true
  },
  {
    "id": 267325,
    "matchday": 21,
    "homeTeamId": 19,
    "awayTeamId": 13,
    "result": {
      "homeGoals": 2,
      "awayGoals": 3,
      "isOfficial": true
    },
    "locked": true
  },
  {
    "id": 267326,
    "matchday": 21,
    "homeTeamId": 15,
    "awayTeamId": 17,
    "result": {
      "homeGoals": 0,
      "awayGoals": 1,
      "isOfficial": true
    },
    "locked": true
  },
  {
    "id": 267327,
    "matchday": 21,
    "homeTeamId": 1,
    "awayTeamId": 6,
    "result": {
      "homeGoals": 4,
      "awayGoals": 2,
      "isOfficial": true
    },
    "locked": true
  },
  {
    "id": 267328,
    "matchday": 22,
    "homeTeamId": 18,
    "awayTeamId": 4,
    "result": {
      "homeGoals": 1,
      "awayGoals": 1,
      "isOfficial": true
    },
    "locked": true
  },
  {
    "id": 267329,
    "matchday": 22,
    "homeTeamId": 2,
    "awayTeamId": 12,
    "result": {
      "homeGoals": 2,
      "awayGoals": 0,
      "isOfficial": true
    },
    "locked": true
  },
  {
    "id": 267330,
    "matchday": 22,
    "homeTeamId": 7,
    "awayTeamId": 14,
    "result": {
      "homeGoals": 0,
      "awayGoals": 2,
      "isOfficial": true
    },
    "locked": true
  },
  {
    "id": 267331,
    "matchday": 22,
    "homeTeamId": 13,
    "awayTeamId": 15,
    "result": {
      "homeGoals": 2,
      "awayGoals": 1,
      "isOfficial": true
    },
    "locked": true
  },
  {
    "id": 267332,
    "matchday": 22,
    "homeTeamId": 9,
    "awayTeamId": 11,
    "result": {
      "homeGoals": 1,
      "awayGoals": 2,
      "isOfficial": true
    },
    "locked": true
  },
  {
    "id": 267333,
    "matchday": 22,
    "homeTeamId": 6,
    "awayTeamId": 19,
    "result": {
      "homeGoals": 1,
      "awayGoals": 1,
      "isOfficial": true
    },
    "locked": true
  },
  {
    "id": 267334,
    "matchday": 22,
    "homeTeamId": 8,
    "awayTeamId": 5,
    "result": {
      "homeGoals": 1,
      "awayGoals": 0,
      "isOfficial": true
    },
    "locked": true
  },
  {
    "id": 267335,
    "matchday": 22,
    "homeTeamId": 16,
    "awayTeamId": 3,
    "result": {
      "homeGoals": 0,
      "awayGoals": 4,
      "isOfficial": true
    },
    "locked": true
  },
  {
    "id": 267336,
    "matchday": 22,
    "homeTeamId": 17,
    "awayTeamId": 10,
    "result": {
      "homeGoals": 0,
      "awayGoals": 0,
      "isOfficial": true
    },
    "locked": true
  },
  {
    "id": 267337,
    "matchday": 22,
    "homeTeamId": 1,
    "awayTeamId": 20,
    "result": {
      "homeGoals": 4,
      "awayGoals": 0,
      "isOfficial": true
    },
    "locked": true
  },
  {
    "id": 267338,
    "matchday": 23,
    "homeTeamId": 18,
    "awayTeamId": 9,
    "result": {
      "homeGoals": 6,
      "awayGoals": 3,
      "isOfficial": true
    },
    "locked": true
  },
  {
    "id": 267339,
    "matchday": 23,
    "homeTeamId": 5,
    "awayTeamId": 7,
    "result": {
      "homeGoals": 1,
      "awayGoals": 1,
      "isOfficial": true
    },
    "locked": true
  },
  {
    "id": 267340,
    "matchday": 23,
    "homeTeamId": 4,
    "awayTeamId": 1,
    "result": {
      "homeGoals": 0,
      "awayGoals": 0,
      "isOfficial": true
    },
    "locked": true
  },
  {
    "id": 267341,
    "matchday": 23,
    "homeTeamId": 10,
    "awayTeamId": 16,
    "result": {
      "homeGoals": 2,
      "awayGoals": 1,
      "isOfficial": true
    },
    "locked": true
  },
  {
    "id": 267342,
    "matchday": 23,
    "homeTeamId": 11,
    "awayTeamId": 8,
    "result": {
      "homeGoals": 2,
      "awayGoals": 0,
      "isOfficial": true
    },
    "locked": true
  },
  {
    "id": 267343,
    "matchday": 23,
    "homeTeamId": 12,
    "awayTeamId": 15,
    "result": {
      "homeGoals": 1,
      "awayGoals": 0,
      "isOfficial": true
    },
    "locked": true
  },
  {
    "id": 267344,
    "matchday": 23,
    "homeTeamId": 14,
    "awayTeamId": 2,
    "result": {
      "homeGoals": 0,
      "awayGoals": 0,
      "isOfficial": true
    },
    "locked": true
  },
  {
    "id": 267345,
    "matchday": 23,
    "homeTeamId": 20,
    "awayTeamId": 13,
    "result": {
      "homeGoals": 1,
      "awayGoals": 0,
      "isOfficial": true
    },
    "locked": true
  },
  {
    "id": 267346,
    "matchday": 23,
    "homeTeamId": 19,
    "awayTeamId": 17,
    "result": {
      "homeGoals": 2,
      "awayGoals": 2,
      "isOfficial": true
    },
    "locked": true
  },
  {
    "id": 267347,
    "matchday": 23,
    "homeTeamId": 3,
    "awayTeamId": 6,
    "result": {
      "homeGoals": 0,
      "awayGoals": 0,
      "isOfficial": true
    },
    "locked": true
  },
  {
    "id": 267348,
    "matchday": 24,
    "homeTeamId": 13,
    "awayTeamId": 14,
    "result": {
      "homeGoals": 0,
      "awayGoals": 1,
      "isOfficial": true
    },
    "locked": true
  },
  {
    "id": 267349,
    "matchday": 24,
    "homeTeamId": 19,
    "awayTeamId": 12,
    "result": {
      "homeGoals": 0,
      "awayGoals": 2,
      "isOfficial": true
    },
    "locked": true
  },
  {
    "id": 267350,
    "matchday": 24,
    "homeTeamId": 17,
    "awayTeamId": 3,
    "result": {
      "homeGoals": 1,
      "awayGoals": 0,
      "isOfficial": true
    },
    "locked": true
  },
  {
    "id": 267351,
    "matchday": 24,
    "homeTeamId": 16,
    "awayTeamId": 18,
    "result": {
      "homeGoals": 2,
      "awayGoals": 1,
      "isOfficial": true
    },
    "locked": true
  },
  {
    "id": 267352,
    "matchday": 24,
    "homeTeamId": 1,
    "awayTeamId": 5,
    "result": {
      "homeGoals": 0,
      "awayGoals": 1,
      "isOfficial": true
    },
    "locked": true
  },
  {
    "id": 267353,
    "matchday": 24,
    "homeTeamId": 6,
    "awayTeamId": 4,
    "result": {
      "homeGoals": 2,
      "awayGoals": 1,
      "isOfficial": true
    },
    "locked": true
  },
  {
    "id": 267354,
    "matchday": 24,
    "homeTeamId": 8,
    "awayTeamId": 10,
    "result": {
      "homeGoals": 2,
      "awayGoals": 2,
      "isOfficial": true
    },
    "locked": true
  },
  {
    "id": 267355,
    "matchday": 24,
    "homeTeamId": 2,
    "awayTeamId": 9,
    "result": {
      "homeGoals": 4,
      "awayGoals": 2,
      "isOfficial": true
    },
    "locked": true
  },
  {
    "id": 267356,
    "matchday": 24,
    "homeTeamId": 15,
    "awayTeamId": 11,
    "result": {
      "homeGoals": 3,
      "awayGoals": 1,
      "isOfficial": true
    },
    "locked": true
  },
  {
    "id": 267357,
    "matchday": 24,
    "homeTeamId": 7,
    "awayTeamId": 20,
    "result": {
      "homeGoals": 2,
      "awayGoals": 0,
      "isOfficial": true
    },
    "locked": true
  },
  {
    "id": 267358,
    "matchday": 25,
    "homeTeamId": 18,
    "awayTeamId": 1,
    "result": {
      "homeGoals": 0,
      "awayGoals": 1,
      "isOfficial": true
    },
    "locked": true
  },
  {
    "id": 267359,
    "matchday": 25,
    "homeTeamId": 14,
    "awayTeamId": 16,
    "result": {
      "homeGoals": 1,
      "awayGoals": 0,
      "isOfficial": true
    },
    "locked": true
  },
  {
    "id": 267360,
    "matchday": 25,
    "homeTeamId": 4,
    "awayTeamId": 8,
    "result": {
      "homeGoals": 1,
      "awayGoals": 0,
      "isOfficial": true
    },
    "locked": true
  },
  {
    "id": 267361,
    "matchday": 25,
    "homeTeamId": 10,
    "awayTeamId": 19,
    "result": {
      "homeGoals": 1,
      "awayGoals": 0,
      "isOfficial": true
    },
    "locked": true
  },
  {
    "id": 267362,
    "matchday": 25,
    "homeTeamId": 9,
    "awayTeamId": 6,
    "result": {
      "homeGoals": 1,
      "awayGoals": 1,
      "isOfficial": true
    },
    "locked": true
  },
  {
    "id": 267363,
    "matchday": 25,
    "homeTeamId": 20,
    "awayTeamId": 15,
    "result": {
      "homeGoals": 1,
      "awayGoals": 0,
      "isOfficial": true
    },
    "locked": true
  },
  {
    "id": 267364,
    "matchday": 25,
    "homeTeamId": 5,
    "awayTeamId": 2,
    "result": {
      "homeGoals": 1,
      "awayGoals": 2,
      "isOfficial": true
    },
    "locked": true
  },
  {
    "id": 267365,
    "matchday": 25,
    "homeTeamId": 3,
    "awayTeamId": 7,
    "result": {
      "homeGoals": 1,
      "awayGoals": 1,
      "isOfficial": true
    },
    "locked": true
  },
  {
    "id": 267366,
    "matchday": 25,
    "homeTeamId": 12,
    "awayTeamId": 13,
    "result": {
      "homeGoals": 2,
      "awayGoals": 0,
      "isOfficial": true
    },
    "locked": true
  },
  {
    "id": 267367,
    "matchday": 25,
    "homeTeamId": 11,
    "awayTeamId": 17,
    "result": {
      "homeGoals": 1,
      "awayGoals": 0,
      "isOfficial": true
    },
    "locked": true
  },
  {
    "id": 267368,
    "matchday": 26,
    "homeTeamId": 2,
    "awayTeamId": 11,
    "result": {
      "homeGoals": 1,
      "awayGoals": 1,
      "isOfficial": true
    },
    "locked": true
  },
  {
    "id": 267369,
    "matchday": 26,
    "homeTeamId": 13,
    "awayTeamId": 10,
    "result": {
      "homeGoals": 2,
      "awayGoals": 1,
      "isOfficial": true
    },
    "locked": true
  },
  {
    "id": 267370,
    "matchday": 26,
    "homeTeamId": 19,
    "awayTeamId": 3,
    "result": {
      "homeGoals": 0,
      "awayGoals": 0,
      "isOfficial": true
    },
    "locked": true
  },
  {
    "id": 267371,
    "matchday": 26,
    "homeTeamId": 17,
    "awayTeamId": 12,
    "result": {
      "homeGoals": 3,
      "awayGoals": 3,
      "isOfficial": true
    },
    "locked": true
  },
  {
    "id": 267372,
    "matchday": 26,
    "homeTeamId": 6,
    "awayTeamId": 14,
    "result": {
      "homeGoals": 0,
      "awayGoals": 1,
      "isOfficial": true
    },
    "locked": true
  },
  {
    "id": 267373,
    "matchday": 26,
    "homeTeamId": 15,
    "awayTeamId": 18,
    "result": {
      "homeGoals": 2,
      "awayGoals": 0,
      "isOfficial": true
    },
    "locked": true
  },
  {
    "id": 267374,
    "matchday": 26,
    "homeTeamId": 16,
    "awayTeamId": 5,
    "result": {
      "homeGoals": 3,
      "awayGoals": 1,
      "isOfficial": true
    },
    "locked": true
  },
  {
    "id": 267375,
    "matchday": 26,
    "homeTeamId": 7,
    "awayTeamId": 4,
    "result": {
      "homeGoals": 1,
      "awayGoals": 0,
      "isOfficial": true
    },
    "locked": true
  },
  {
    "id": 267376,
    "matchday": 26,
    "homeTeamId": 1,
    "awayTeamId": 9,
    "result": {
      "homeGoals": 2,
      "awayGoals": 2,
      "isOfficial": true
    },
    "locked": true
  },
  {
    "id": 267377,
    "matchday": 26,
    "homeTeamId": 8,
    "awayTeamId": 20,
    "result": {
      "homeGoals": 1,
      "awayGoals": 1,
      "isOfficial": true
    },
    "locked": true
  },
  {
    "id": 267378,
    "matchday": 27,
    "homeTeamId": 18,
    "awayTeamId": 6,
    "result": {
      "homeGoals": 2,
      "awayGoals": 2,
      "isOfficial": true
    },
    "locked": true
  },
  {
    "id": 267379,
    "matchday": 27,
    "homeTeamId": 3,
    "awayTeamId": 12,
    "result": {
      "homeGoals": 0,
      "awayGoals": 0,
      "isOfficial": true
    },
    "locked": true
  },
  {
    "id": 267380,
    "matchday": 27,
    "homeTeamId": 10,
    "awayTeamId": 15,
    "result": {
      "homeGoals": 1,
      "awayGoals": 0,
      "isOfficial": true
    },
    "locked": true
  },
  {
    "id": 267381,
    "matchday": 27,
    "homeTeamId": 9,
    "awayTeamId": 8,
    "result": {
      "homeGoals": 0,
      "awayGoals": 2,
      "isOfficial": true
    },
    "locked": true
  },
  {
    "id": 267382,
    "matchday": 27,
    "homeTeamId": 11,
    "awayTeamId": 16,
    "result": {
      "homeGoals": 0,
      "awayGoals": 0,
      "isOfficial": true
    },
    "locked": true
  },
  {
    "id": 267383,
    "matchday": 27,
    "homeTeamId": 20,
    "awayTeamId": 2,
    "result": {
      "homeGoals": 3,
      "awayGoals": 0,
      "isOfficial": true
    },
    "locked": true
  },
  {
    "id": 267384,
    "matchday": 27,
    "homeTeamId": 1,
    "awayTeamId": 7,
    "result": {
      "homeGoals": 1,
      "awayGoals": 1,
      "isOfficial": true
    },
    "locked": true
  },
  {
    "id": 267385,
    "matchday": 27,
    "homeTeamId": 4,
    "awayTeamId": 13,
    "result": {
      "homeGoals": 1,
      "awayGoals": 1,
      "isOfficial": true
    },
    "locked": true
  },
  {
    "id": 267386,
    "matchday": 27,
    "homeTeamId": 14,
    "awayTeamId": 19,
    "result": {
      "homeGoals": 0,
      "awayGoals": 1,
      "isOfficial": true
    },
    "locked": true
  },
  {
    "id": 267387,
    "matchday": 27,
    "homeTeamId": 5,
    "awayTeamId": 17,
    "result": {
      "homeGoals": 3,
      "awayGoals": 1,
      "isOfficial": true
    },
    "locked": true
  },
  {
    "id": 267388,
    "matchday": 28,
    "homeTeamId": 2,
    "awayTeamId": 1,
    "result": {
      "homeGoals": 1,
      "awayGoals": 1,
      "isOfficial": true
    },
    "locked": true
  },
  {
    "id": 267390,
    "matchday": 28,
    "homeTeamId": 17,
    "awayTeamId": 14,
    "result": {
      "homeGoals": 0,
      "awayGoals": 0,
      "isOfficial": true
    },
    "locked": true
  },
  {
    "id": 267391,
    "matchday": 28,
    "homeTeamId": 8,
    "awayTeamId": 18,
    "result": {
      "homeGoals": 1,
      "awayGoals": 0,
      "isOfficial": true
    },
    "locked": true
  },
  {
    "id": 267392,
    "matchday": 28,
    "homeTeamId": 15,
    "awayTeamId": 5,
    "result": {
      "homeGoals": 1,
      "awayGoals": 1,
      "isOfficial": true
    },
    "locked": true
  },
  {
    "id": 267393,
    "matchday": 28,
    "homeTeamId": 19,
    "awayTeamId": 4,
    "result": {
      "homeGoals": 0,
      "awayGoals": 1,
      "isOfficial": true
    },
    "locked": true
  },
  {
    "id": 267394,
    "matchday": 28,
    "homeTeamId": 12,
    "awayTeamId": 10,
    "result": {
      "homeGoals": 0,
      "awayGoals": 3,
      "isOfficial": true
    },
    "locked": true
  },
  {
    "id": 267395,
    "matchday": 28,
    "homeTeamId": 16,
    "awayTeamId": 9,
    "result": {
      "homeGoals": 1,
      "awayGoals": 1,
      "isOfficial": true
    },
    "locked": true
  },
  {
    "id": 267396,
    "matchday": 28,
    "homeTeamId": 11,
    "awayTeamId": 20,
    "result": {
      "homeGoals": 1,
      "awayGoals": 4,
      "isOfficial": true
    },
    "locked": true
  },
  {
    "id": 267397,
    "matchday": 28,
    "homeTeamId": 7,
    "awayTeamId": 6,
    "result": {
      "homeGoals": 0,
      "awayGoals": 4,
      "isOfficial": true
    },
    "locked": true
  },
  {
    "id": 267398,
    "matchday": 29,
    "homeTeamId": 18,
    "awayTeamId": 2,
    "result": {
      "homeGoals": 1,
      "awayGoals": 1,
      "isOfficial": true
    },
    "locked": true
  },
  {
    "id": 267399,
    "matchday": 29,
    "homeTeamId": 14,
    "awayTeamId": 12,
    "result": {
      "homeGoals": 3,
      "awayGoals": 1,
      "isOfficial": true
    },
    "locked": true
  },
  {
    "id": 267400,
    "matchday": 29,
    "homeTeamId": 4,
    "awayTeamId": 11,
    "result": {
      "homeGoals": 1,
      "awayGoals": 1,
      "isOfficial": true
    },
    "locked": true
  },
  {
    "id": 267401,
    "matchday": 29,
    "homeTeamId": 9,
    "awayTeamId": 17,
    "result": {
      "homeGoals": 1,
      "awayGoals": 1,
      "isOfficial": true
    },
    "locked": true
  },
  {
    "id": 267402,
    "matchday": 29,
    "homeTeamId": 20,
    "awayTeamId": 16,
    "result": {
      "homeGoals": 1,
      "awayGoals": 1,
      "isOfficial": true
    },
    "locked": true
  },
  {
    "id": 267403,
    "matchday": 29,
    "homeTeamId": 6,
    "awayTeamId": 8,
    "result": {
      "homeGoals": 2,
      "awayGoals": 2,
      "isOfficial": true
    },
    "locked": true
  },
  {
    "id": 267404,
    "matchday": 29,
    "homeTeamId": 3,
    "awayTeamId": 15,
    "result": {
      "homeGoals": 0,
      "awayGoals": 0,
      "isOfficial": true
    },
    "locked": true
  },
  {
    "id": 267405,
    "matchday": 29,
    "homeTeamId": 5,
    "awayTeamId": 10,
    "result": {
      "homeGoals": 0,
      "awayGoals": 0,
      "isOfficial": true
    },
    "locked": true
  },
  {
    "id": 267406,
    "matchday": 29,
    "homeTeamId": 7,
    "awayTeamId": 13,
    "result": {
      "homeGoals": 1,
      "awayGoals": 1,
      "isOfficial": true
    },
    "locked": true
  },
  {
    "id": 267407,
    "matchday": 29,
    "homeTeamId": 1,
    "awayTeamId": 19,
    "result": {
      "homeGoals": 1,
      "awayGoals": 0,
      "isOfficial": true
    },
    "locked": true
  },
  {
    "id": 267408,
    "matchday": 30,
    "homeTeamId": 15,
    "awayTeamId": 14,
    "result": {
      "homeGoals": 0,
      "awayGoals": 0,
      "isOfficial": true
    },
    "locked": true
  },
  {
    "id": 267409,
    "matchday": 30,
    "homeTeamId": 10,
    "awayTeamId": 6,
    "result": {
      "homeGoals": 2,
      "awayGoals": 1,
      "isOfficial": true
    },
    "locked": true
  },
  {
    "id": 267410,
    "matchday": 30,
    "homeTeamId": 13,
    "awayTeamId": 9,
    "result": {
      "homeGoals": 3,
      "awayGoals": 2,
      "isOfficial": true
    },
    "locked": true
  },
  {
    "id": 267411,
    "matchday": 30,
    "homeTeamId": 17,
    "awayTeamId": 7,
    "result": {
      "homeGoals": 1,
      "awayGoals": 2,
      "isOfficial": true
    },
    "locked": true
  },
  {
    "id": 267412,
    "matchday": 30,
    "homeTeamId": 16,
    "awayTeamId": 1,
    "result": {
      "homeGoals": 0,
      "awayGoals": 0,
      "isOfficial": true
    },
    "locked": true
  },
  {
    "id": 267413,
    "matchday": 30,
    "homeTeamId": 12,
    "awayTeamId": 18,
    "result": {
      "homeGoals": 3,
      "awayGoals": 1,
      "isOfficial": true
    },
    "locked": true
  },
  {
    "id": 267414,
    "matchday": 30,
    "homeTeamId": 11,
    "awayTeamId": 5,
    "result": {
      "homeGoals": 2,
      "awayGoals": 1,
      "isOfficial": true
    },
    "locked": true
  },
  {
    "id": 267415,
    "matchday": 30,
    "homeTeamId": 8,
    "awayTeamId": 3,
    "result": {
      "homeGoals": 2,
      "awayGoals": 1,
      "isOfficial": true
    },
    "locked": true
  },
  {
    "id": 267416,
    "matchday": 30,
    "homeTeamId": 2,
    "awayTeamId": 4,
    "result": {
      "homeGoals": 2,
      "awayGoals": 1,
      "isOfficial": true
    },
    "locked": true
  },
  {
    "id": 267417,
    "matchday": 30,
    "homeTeamId": 19,
    "awayTeamId": 20,
    "result": {
      "homeGoals": 4,
      "awayGoals": 3,
      "isOfficial": true
    },
    "locked": true
  },
  {
    "id": 267418,
    "matchday": 31,
    "homeTeamId": 7,
    "awayTeamId": 19,
    "result": {
      "homeGoals": 0,
      "awayGoals": 1,
      "isOfficial": true
    },
    "locked": true
  },
  {
    "id": 267419,
    "matchday": 31,
    "homeTeamId": 4,
    "awayTeamId": 16,
    "result": {
      "homeGoals": 1,
      "awayGoals": 2,
      "isOfficial": true
    },
    "locked": true
  },
  {
    "id": 267420,
    "matchday": 31,
    "homeTeamId": 9,
    "awayTeamId": 15,
    "result": {
      "homeGoals": 2,
      "awayGoals": 1,
      "isOfficial": true
    },
    "locked": true
  },
  {
    "id": 267421,
    "matchday": 31,
    "homeTeamId": 6,
    "awayTeamId": 2,
    "result": {
      "homeGoals": 5,
      "awayGoals": 1,
      "isOfficial": true
    },
    "locked": true
  },
  {
    "id": 267422,
    "matchday": 31,
    "homeTeamId": 20,
    "awayTeamId": 5,
    "result": {
      "homeGoals": 1,
      "awayGoals": 0,
      "isOfficial": true
    },
    "locked": true
  },
  {
    "id": 267423,
    "matchday": 31,
    "homeTeamId": 3,
    "awayTeamId": 10,
    "result": {
      "homeGoals": 2,
      "awayGoals": 0,
      "isOfficial": true
    },
    "locked": true
  },
  {
    "id": 267424,
    "matchday": 31,
    "homeTeamId": 18,
    "awayTeamId": 13,
    "result": {
      "homeGoals": 1,
      "awayGoals": 2,
      "isOfficial": true
    },
    "locked": true
  },
  {
    "id": 267425,
    "matchday": 31,
    "homeTeamId": 8,
    "awayTeamId": 12,
    "result": {
      "homeGoals": 2,
      "awayGoals": 3,
      "isOfficial": true
    },
    "locked": true
  },
  {
    "id": 267426,
    "matchday": 31,
    "homeTeamId": 14,
    "awayTeamId": 11,
    "result": {
      "homeGoals": 4,
      "awayGoals": 1,
      "isOfficial": true
    },
    "locked": true
  },
  {
    "id": 267427,
    "matchday": 31,
    "homeTeamId": 1,
    "awayTeamId": 17,
    "result": {
      "homeGoals": 1,
      "awayGoals": 1,
      "isOfficial": true
    },
    "locked": true
  }
]

export const initialFixtures: Match[] = [
  {
    "id": 267389,
    "matchday": 28,
    "homeTeamId": 13,
    "awayTeamId": 3,
    "result": null
  },
  {
    "id": 267428,
    "matchday": 32,
    "homeTeamId": 13,
    "awayTeamId": 2,
    "result": null
  },
  {
    "id": 267429,
    "matchday": 32,
    "homeTeamId": 11,
    "awayTeamId": 1,
    "result": null
  },
  {
    "id": 267430,
    "matchday": 32,
    "homeTeamId": 16,
    "awayTeamId": 8,
    "result": null
  },
  {
    "id": 267431,
    "matchday": 32,
    "homeTeamId": 10,
    "awayTeamId": 18,
    "result": null
  },
  {
    "id": 267432,
    "matchday": 32,
    "homeTeamId": 15,
    "awayTeamId": 7,
    "result": null
  },
  {
    "id": 267433,
    "matchday": 32,
    "homeTeamId": 3,
    "awayTeamId": 14,
    "result": null
  },
  {
    "id": 267434,
    "matchday": 32,
    "homeTeamId": 17,
    "awayTeamId": 4,
    "result": null
  },
  {
    "id": 267435,
    "matchday": 32,
    "homeTeamId": 19,
    "awayTeamId": 9,
    "result": null
  },
  {
    "id": 267436,
    "matchday": 32,
    "homeTeamId": 12,
    "awayTeamId": 20,
    "result": null
  },
  {
    "id": 267437,
    "matchday": 32,
    "homeTeamId": 5,
    "awayTeamId": 6,
    "result": null
  },
  {
    "id": 267438,
    "matchday": 33,
    "homeTeamId": 18,
    "awayTeamId": 11,
    "result": null
  },
  {
    "id": 267439,
    "matchday": 33,
    "homeTeamId": 7,
    "awayTeamId": 16,
    "result": null
  },
  {
    "id": 267440,
    "matchday": 33,
    "homeTeamId": 4,
    "awayTeamId": 5,
    "result": null
  },
  {
    "id": 267441,
    "matchday": 33,
    "homeTeamId": 9,
    "awayTeamId": 12,
    "result": null
  },
  {
    "id": 267442,
    "matchday": 33,
    "homeTeamId": 20,
    "awayTeamId": 3,
    "result": null
  },
  {
    "id": 267443,
    "matchday": 33,
    "homeTeamId": 6,
    "awayTeamId": 15,
    "result": null
  },
  {
    "id": 267444,
    "matchday": 33,
    "homeTeamId": 14,
    "awayTeamId": 10,
    "result": null
  },
  {
    "id": 267445,
    "matchday": 33,
    "homeTeamId": 1,
    "awayTeamId": 13,
    "result": null
  },
  {
    "id": 267446,
    "matchday": 33,
    "homeTeamId": 8,
    "awayTeamId": 19,
    "result": null
  },
  {
    "id": 267447,
    "matchday": 33,
    "homeTeamId": 2,
    "awayTeamId": 17,
    "result": null
  },
  {
    "id": 267448,
    "matchday": 34,
    "homeTeamId": 15,
    "awayTeamId": 8,
    "result": null
  },
  {
    "id": 267449,
    "matchday": 34,
    "homeTeamId": 14,
    "awayTeamId": 1,
    "result": null
  },
  {
    "id": 267450,
    "matchday": 34,
    "homeTeamId": 10,
    "awayTeamId": 7,
    "result": null
  },
  {
    "id": 267451,
    "matchday": 34,
    "homeTeamId": 13,
    "awayTeamId": 11,
    "result": null
  },
  {
    "id": 267452,
    "matchday": 34,
    "homeTeamId": 17,
    "awayTeamId": 20,
    "result": null
  },
  {
    "id": 267453,
    "matchday": 34,
    "homeTeamId": 19,
    "awayTeamId": 18,
    "result": null
  },
  {
    "id": 267454,
    "matchday": 34,
    "homeTeamId": 3,
    "awayTeamId": 2,
    "result": null
  },
  {
    "id": 267455,
    "matchday": 34,
    "homeTeamId": 12,
    "awayTeamId": 4,
    "result": null
  },
  {
    "id": 267456,
    "matchday": 34,
    "homeTeamId": 5,
    "awayTeamId": 9,
    "result": null
  },
  {
    "id": 267457,
    "matchday": 34,
    "homeTeamId": 16,
    "awayTeamId": 6,
    "result": null
  },
  {
    "id": 267458,
    "matchday": 35,
    "homeTeamId": 18,
    "awayTeamId": 17,
    "result": null
  },
  {
    "id": 267459,
    "matchday": 35,
    "homeTeamId": 2,
    "awayTeamId": 19,
    "result": null
  },
  {
    "id": 267460,
    "matchday": 35,
    "homeTeamId": 5,
    "awayTeamId": 3,
    "result": null
  },
  {
    "id": 267461,
    "matchday": 35,
    "homeTeamId": 4,
    "awayTeamId": 15,
    "result": null
  },
  {
    "id": 267462,
    "matchday": 35,
    "homeTeamId": 9,
    "awayTeamId": 20,
    "result": null
  },
  {
    "id": 267463,
    "matchday": 35,
    "homeTeamId": 6,
    "awayTeamId": 12,
    "result": null
  },
  {
    "id": 267464,
    "matchday": 35,
    "homeTeamId": 11,
    "awayTeamId": 7,
    "result": null
  },
  {
    "id": 267465,
    "matchday": 35,
    "homeTeamId": 8,
    "awayTeamId": 14,
    "result": null
  },
  {
    "id": 267466,
    "matchday": 35,
    "homeTeamId": 1,
    "awayTeamId": 10,
    "result": null
  },
  {
    "id": 267467,
    "matchday": 35,
    "homeTeamId": 16,
    "awayTeamId": 13,
    "result": null
  },
  {
    "id": 267468,
    "matchday": 36,
    "homeTeamId": 7,
    "awayTeamId": 8,
    "result": null
  },
  {
    "id": 267469,
    "matchday": 36,
    "homeTeamId": 10,
    "awayTeamId": 11,
    "result": null
  },
  {
    "id": 267470,
    "matchday": 36,
    "homeTeamId": 13,
    "awayTeamId": 5,
    "result": null
  },
  {
    "id": 267471,
    "matchday": 36,
    "homeTeamId": 19,
    "awayTeamId": 16,
    "result": null
  },
  {
    "id": 267472,
    "matchday": 36,
    "homeTeamId": 12,
    "awayTeamId": 1,
    "result": null
  },
  {
    "id": 267473,
    "matchday": 36,
    "homeTeamId": 17,
    "awayTeamId": 6,
    "result": null
  },
  {
    "id": 267474,
    "matchday": 36,
    "homeTeamId": 20,
    "awayTeamId": 18,
    "result": null
  },
  {
    "id": 267475,
    "matchday": 36,
    "homeTeamId": 15,
    "awayTeamId": 2,
    "result": null
  },
  {
    "id": 267476,
    "matchday": 36,
    "homeTeamId": 3,
    "awayTeamId": 4,
    "result": null
  },
  {
    "id": 267477,
    "matchday": 36,
    "homeTeamId": 14,
    "awayTeamId": 9,
    "result": null
  },
  {
    "id": 267478,
    "matchday": 37,
    "homeTeamId": 18,
    "awayTeamId": 14,
    "result": null
  },
  {
    "id": 267479,
    "matchday": 37,
    "homeTeamId": 2,
    "awayTeamId": 7,
    "result": null
  },
  {
    "id": 267480,
    "matchday": 37,
    "homeTeamId": 5,
    "awayTeamId": 19,
    "result": null
  },
  {
    "id": 267481,
    "matchday": 37,
    "homeTeamId": 4,
    "awayTeamId": 20,
    "result": null
  },
  {
    "id": 267482,
    "matchday": 37,
    "homeTeamId": 9,
    "awayTeamId": 10,
    "result": null
  },
  {
    "id": 267483,
    "matchday": 37,
    "homeTeamId": 11,
    "awayTeamId": 12,
    "result": null
  },
  {
    "id": 267484,
    "matchday": 37,
    "homeTeamId": 16,
    "awayTeamId": 15,
    "result": null
  },
  {
    "id": 267485,
    "matchday": 37,
    "homeTeamId": 1,
    "awayTeamId": 3,
    "result": null
  },
  {
    "id": 267486,
    "matchday": 37,
    "homeTeamId": 6,
    "awayTeamId": 13,
    "result": null
  },
  {
    "id": 267487,
    "matchday": 37,
    "homeTeamId": 8,
    "awayTeamId": 17,
    "result": null
  },
  {
    "id": 267488,
    "matchday": 38,
    "homeTeamId": 15,
    "awayTeamId": 1,
    "result": null
  },
  {
    "id": 267489,
    "matchday": 38,
    "homeTeamId": 10,
    "awayTeamId": 2,
    "result": null
  },
  {
    "id": 267490,
    "matchday": 38,
    "homeTeamId": 13,
    "awayTeamId": 8,
    "result": null
  },
  {
    "id": 267491,
    "matchday": 38,
    "homeTeamId": 17,
    "awayTeamId": 16,
    "result": null
  },
  {
    "id": 267492,
    "matchday": 38,
    "homeTeamId": 7,
    "awayTeamId": 18,
    "result": null
  },
  {
    "id": 267493,
    "matchday": 38,
    "homeTeamId": 12,
    "awayTeamId": 5,
    "result": null
  },
  {
    "id": 267494,
    "matchday": 38,
    "homeTeamId": 14,
    "awayTeamId": 4,
    "result": null
  },
  {
    "id": 267495,
    "matchday": 38,
    "homeTeamId": 3,
    "awayTeamId": 9,
    "result": null
  },
  {
    "id": 267496,
    "matchday": 38,
    "homeTeamId": 19,
    "awayTeamId": 11,
    "result": null
  },
  {
    "id": 267497,
    "matchday": 38,
    "homeTeamId": 20,
    "awayTeamId": 6,
    "result": null
  }
]

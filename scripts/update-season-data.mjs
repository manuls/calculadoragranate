#!/usr/bin/env node

import { readFile, writeFile } from "node:fs/promises"
import path from "node:path"
import process from "node:process"
import { fileURLToPath } from "node:url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const projectRoot = path.resolve(__dirname, "..")

const SEASON = {
  label: "2025-26",
  slug: "t2025-261rf1",
  tableUrl: "https://www.bdfutbol.com/es/t/t2025-261rf1.html",
  resultsUrl: "https://www.bdfutbol.com/es/t/t2025-261rf1.html?tab=results",
}

const TEAMS = [
  { id: 1, canonicalName: "CD Tenerife", logoUrl: "https://tmssl.akamaized.net/images/wappen/medium/648.png?lm=1578091884", aliases: ["tenerife", "cd tenerife"] },
  { id: 2, canonicalName: "RC Celta Fortuna", logoUrl: "https://tmssl.akamaized.net/images/wappen/medium/8733.png?lm=1406966406", aliases: ["celta fortuna", "rc celta fortuna"] },
  { id: 3, canonicalName: "Pontevedra CF", logoUrl: "https://tmssl.akamaized.net/images/wappen/medium/5650.png?lm=1732278110", aliases: ["pontevedra", "pontevedra cf"] },
  { id: 4, canonicalName: "Bilbao Athletic", logoUrl: "https://tmssl.akamaized.net/images/wappen/medium/6688.png?lm=1695069038", aliases: ["bilbao athletic"] },
  { id: 5, canonicalName: "Racing Ferrol", logoUrl: "https://tmssl.akamaized.net/images/wappen/medium/1176.png?lm=1702049971", aliases: ["racing ferrol", "racing de ferrol"] },
  { id: 6, canonicalName: "Real Madrid Castilla", logoUrl: "https://tmssl.akamaized.net/images/wappen/medium/6767.png?lm=1729684474", aliases: ["real madrid castilla"] },
  { id: 7, canonicalName: "CD Lugo", logoUrl: "https://tmssl.akamaized.net/images/wappen/medium/11000.png?lm=1405933427", aliases: ["lugo", "cd lugo"] },
  { id: 8, canonicalName: "Zamora CF", logoUrl: "https://tmssl.akamaized.net/images/wappen/medium/10907.png?lm=1422972812", aliases: ["zamora", "zamora cf"] },
  { id: 9, canonicalName: "Real Avilés Industrial", logoUrl: "https://tmssl.akamaized.net/images/wappen/medium/20844.png?lm=1705039777", aliases: ["aviles industrial", "real aviles industrial", "aviles"] },
  { id: 10, canonicalName: "Barakaldo CF", logoUrl: "https://tmssl.akamaized.net/images/wappen/medium/3708.png?lm=1422971751", aliases: ["barakaldo", "barakaldo cf"] },
  { id: 11, canonicalName: "Mérida AD", logoUrl: "https://tmssl.akamaized.net/images/wappen/medium/46854.png?lm=1718102950", aliases: ["merida", "merida ad", "mérida ad"] },
  { id: 12, canonicalName: "Unionistas CF", logoUrl: "https://tmssl.akamaized.net/images/wappen/medium/52397.png?lm=1468618498", aliases: ["unionistas", "unionistas cf", "unionistas de salamanca"] },
  { id: 13, canonicalName: "Arenas Club", logoUrl: "https://tmssl.akamaized.net/images/wappen/medium/16122.png?lm=1706197149", aliases: ["arenas", "arenas club", "arenas de getxo"] },
  { id: 14, canonicalName: "SD Ponferradina", logoUrl: "https://tmssl.akamaized.net/images/wappen/medium/4032.png?lm=1625561266", aliases: ["ponferradina", "sd ponferradina"] },
  { id: 15, canonicalName: "Ourense CF", logoUrl: "https://tmssl.akamaized.net/images/wappen/medium/55398.png?lm=1472936726", aliases: ["ourense", "ourense cf"] },
  { id: 16, canonicalName: "CF Talavera de la Reina", logoUrl: "https://tmssl.akamaized.net/images/wappen/medium/47421.png?lm=1468166961", aliases: ["talavera", "talavera de la reina", "cf talavera de la reina"] },
  { id: 17, canonicalName: "CP Cacereño", logoUrl: "https://tmssl.akamaized.net/images/wappen/medium/11602.png?lm=1637151598", aliases: ["cacereno", "cp cacereno", "cacereño", "cp cacereño"] },
  { id: 18, canonicalName: "CD Arenteiro", logoUrl: "https://tmssl.akamaized.net/images/wappen/medium/8516.png?lm=1686070938", aliases: ["arenteiro", "cd arenteiro"] },
  { id: 19, canonicalName: "CA Osasuna Promesas", logoUrl: "https://tmssl.akamaized.net/images/wappen/medium/58946.png?lm=1688843561", aliases: ["osasuna b", "osasuna promesas", "ca osasuna promesas"] },
  { id: 20, canonicalName: "CD Guadalajara", logoUrl: "https://tmssl.akamaized.net/images/wappen/medium/16576.png?lm=1754924420", aliases: ["guadalajara", "cd guadalajara"] },
]

const teamById = new Map(TEAMS.map((team) => [team.id, team]))
const teamByAlias = new Map()
for (const team of TEAMS) {
  teamByAlias.set(normalizeName(team.canonicalName), team)
  for (const alias of team.aliases) {
    teamByAlias.set(normalizeName(alias), team)
  }
}

async function main() {
  const options = parseArgs(process.argv.slice(2))
  const htmlSources = await loadHtmlSources(options)
  const currentMatchday = parseSelectedMatchday(htmlSources.tableHtml)
  const sourceTeams = parseSourceTeams(htmlSources.resultsHtml)
  const standings = parseStandings(htmlSources.tableHtml)
  const { playedMatches, pendingMatches } = parseSeasonMatches(htmlSources.resultsHtml, sourceTeams)

  validateDataset({ standings, playedMatches, pendingMatches })

  await Promise.all([
    writeFile(path.join(projectRoot, "lib/data.ts"), buildDataFile({ currentMatchday, standings, playedMatches, pendingMatches })),
    writeFile(path.join(projectRoot, "lib/match-id-mapping.ts"), buildMatchIdMappingFile(pendingMatches)),
  ])

  console.log(`Actualizados lib/data.ts y lib/match-id-mapping.ts`)
  console.log(`Clasificación: jornada ${currentMatchday}, ${standings.length} equipos`)
  console.log(`Partidos jugados: ${playedMatches.length}`)
  console.log(`Partidos pendientes/aplazados: ${pendingMatches.length}`)
}

function parseArgs(args) {
  const options = {
    mainFile: null,
    resultsFile: null,
  }

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index]
    if (arg === "--main-file") {
      options.mainFile = args[index + 1]
      index += 1
      continue
    }
    if (arg === "--results-file") {
      options.resultsFile = args[index + 1]
      index += 1
      continue
    }
    if (arg === "--help" || arg === "-h") {
      printHelp()
      process.exit(0)
    }
    throw new Error(`Argumento no reconocido: ${arg}`)
  }

  if ((options.mainFile && !options.resultsFile) || (!options.mainFile && options.resultsFile)) {
    throw new Error("Debes indicar tanto --main-file como --results-file")
  }

  return options
}

function printHelp() {
  console.log(`\nUso:\n  node scripts/update-season-data.mjs\n  node scripts/update-season-data.mjs --main-file /ruta/main.html --results-file /ruta/results.html\n`)
}

async function loadHtmlSources(options) {
  if (options.mainFile && options.resultsFile) {
    const [tableHtml, resultsHtml] = await Promise.all([
      readFile(path.resolve(options.mainFile), "utf8"),
      readFile(path.resolve(options.resultsFile), "utf8"),
    ])

    return { tableHtml, resultsHtml }
  }

  const [tableHtml, resultsHtml] = await Promise.all([
    fetchHtml(SEASON.tableUrl),
    fetchHtml(SEASON.resultsUrl),
  ])

  return { tableHtml, resultsHtml }
}

async function fetchHtml(url) {
  const response = await fetch(url, {
    headers: {
      "user-agent": "Mozilla/5.0 (compatible; CalculadoraGranate/1.0)",
    },
  })

  if (!response.ok) {
    throw new Error(`No se pudo descargar ${url}: ${response.status}`)
  }

  return response.text()
}

function parseSelectedMatchday(html) {
  const match = html.match(/<select id="jornada"[\s\S]*?<option value="(\d+)" selected="selected">/)
  if (!match) {
    throw new Error("No se pudo detectar la jornada seleccionada en la clasificación")
  }
  return Number(match[1])
}

function parseSourceTeams(html) {
  const sourceTeams = new Map()
  const regex = /SE\[(\d+)\]="\d+\|([^"]+)";/g
  let match

  while ((match = regex.exec(html)) !== null) {
    const sourceIndex = Number(match[1])
    const sourceName = decodeHtml(match[2]).trim()
    const team = resolveTeam(sourceName)
    sourceTeams.set(sourceIndex, team)
  }

  if (sourceTeams.size !== 20) {
    throw new Error(`Se esperaban 20 equipos en el mapeo fuente y se obtuvieron ${sourceTeams.size}`)
  }

  return sourceTeams
}

function parseStandings(html) {
  const tableMatch = html.match(/<table class="taula_estil sortable taula_classificacio" id="classific">([\s\S]*?)<\/table>/)
  if (!tableMatch) {
    throw new Error("No se encontró la tabla de clasificación")
  }

  const rows = [...tableMatch[1].matchAll(/<tr data-ideq="[^"]+">([\s\S]*?)<\/tr>/g)]
  const standings = rows.map((rowMatch) => {
    const cells = [...rowMatch[1].matchAll(/<td\b[^>]*>([\s\S]*?)<\/td>/g)].map((cell) => stripTags(cell[1]))
    if (cells.length < 11) {
      throw new Error(`Fila de clasificación inesperada: ${rowMatch[0].slice(0, 120)}...`)
    }

    const sourceName = cells[3]
    const team = resolveTeam(sourceName)
    const position = Number(cells[1])

    return {
      id: team.id,
      name: team.canonicalName,
      played: Number(cells[5]),
      won: Number(cells[6]),
      drawn: Number(cells[7]),
      lost: Number(cells[8]),
      goalsFor: Number(cells[9]),
      goalsAgainst: Number(cells[10]),
      points: Number(cells[4]),
      logoUrl: team.logoUrl,
      initialPosition: position,
    }
  })

  return standings.sort((a, b) => a.initialPosition - b.initialPosition)
}

function parseSeasonMatches(html, sourceTeams) {
  const playedMatches = []
  const pendingMatches = []
  const regex = /SP\[(\d+)\]\.push\((\{[^;]+\})\);/g
  let match

  while ((match = regex.exec(html)) !== null) {
    const matchday = Number(match[1])
    const payload = JSON.parse(match[2])
    const homeTeam = sourceTeams.get(Number(payload.a1))
    const awayTeam = sourceTeams.get(Number(payload.a2))

    if (!homeTeam || !awayTeam) {
      throw new Error(`No se pudo resolver el partido ${payload.id} (${payload.a1} vs ${payload.a2})`)
    }

    const homeGoals = Number(payload.g1)
    const awayGoals = Number(payload.g2)
    const fixture = {
      id: Number(payload.id),
      matchday,
      homeTeamId: homeTeam.id,
      awayTeamId: awayTeam.id,
      result: null,
    }

    if (homeGoals >= 0 && awayGoals >= 0) {
      playedMatches.push({
        ...fixture,
        result: {
          homeGoals,
          awayGoals,
          isOfficial: true,
        },
        locked: true,
      })
    } else {
      pendingMatches.push(fixture)
    }
  }

  playedMatches.sort(sortMatches)
  pendingMatches.sort(sortMatches)

  return { playedMatches, pendingMatches }
}

function validateDataset({ standings, playedMatches, pendingMatches }) {
  if (standings.length !== 20) {
    throw new Error(`La clasificación debería tener 20 equipos y tiene ${standings.length}`)
  }

  const totalMatches = playedMatches.length + pendingMatches.length
  if (totalMatches !== 380) {
    throw new Error(`La temporada debería sumar 380 partidos y suma ${totalMatches}`)
  }

  const seenMatchIds = new Set()
  for (const match of [...playedMatches, ...pendingMatches]) {
    if (seenMatchIds.has(match.id)) {
      throw new Error(`ID de partido duplicado: ${match.id}`)
    }
    seenMatchIds.add(match.id)
  }
}

function buildDataFile({ currentMatchday, standings, playedMatches, pendingMatches }) {
  const generatedAt = new Date().toISOString()

  return `import type { Team, Match } from "./types"\n\n// Datos oficiales de BDFutbol / Primera RFEF Grupo 1.\n// Generado automáticamente por scripts/update-season-data.mjs el ${generatedAt}.\n// Clasificación general tras la jornada ${currentMatchday}.\nexport const initialTeams: Team[] = ${JSON.stringify(standings, null, 2)}\n\nexport const playedMatches: Match[] = ${JSON.stringify(playedMatches, null, 2)}\n\nexport const initialFixtures: Match[] = ${JSON.stringify(pendingMatches, null, 2)}\n`
}

function buildMatchIdMappingFile(pendingMatches) {
  const mapping = pendingMatches.map((match) => ({
    id: match.id,
    matchday: match.matchday,
    homeTeam: getTeamName(match.homeTeamId),
    awayTeam: getTeamName(match.awayTeamId),
  }))

  return `/**\n * Mapeo entre el ID de cada partido pendiente y sus equipos.\n * Generado automáticamente por scripts/update-season-data.mjs.\n */\n\nexport interface MatchInfo {\n  id: number\n  matchday: number\n  homeTeam: string\n  awayTeam: string\n}\n\nexport const matchIdMapping: MatchInfo[] = ${JSON.stringify(mapping, null, 2)}\n\nexport function getMatchInfoById(id: number): MatchInfo | undefined {\n  return matchIdMapping.find((match) => match.id === id)\n}\n\nexport function getMatchesByMatchday(matchday: number): MatchInfo[] {\n  return matchIdMapping.filter((match) => match.matchday === matchday)\n}\n`
}

function getTeamName(teamId) {
  const team = teamById.get(teamId)
  if (!team) {
    throw new Error(`Equipo desconocido: ${teamId}`)
  }
  return team.canonicalName
}

function resolveTeam(sourceName) {
  const team = teamByAlias.get(normalizeName(sourceName))
  if (!team) {
    throw new Error(`No existe mapeo para el equipo fuente: ${sourceName}`)
  }
  return team
}

function sortMatches(a, b) {
  return a.matchday - b.matchday || a.id - b.id
}

function stripTags(value) {
  return decodeHtml(value.replace(/<[^>]+>/g, " ")).replace(/\s+/g, " ").trim()
}

function decodeHtml(value) {
  return value
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&aacute;/g, "á")
    .replace(/&eacute;/g, "é")
    .replace(/&iacute;/g, "í")
    .replace(/&oacute;/g, "ó")
    .replace(/&uacute;/g, "ú")
    .replace(/&Aacute;/g, "Á")
    .replace(/&Eacute;/g, "É")
    .replace(/&Iacute;/g, "Í")
    .replace(/&Oacute;/g, "Ó")
    .replace(/&Uacute;/g, "Ú")
    .replace(/&ntilde;/g, "ñ")
    .replace(/&Ntilde;/g, "Ñ")
    .replace(/&uuml;/g, "ü")
    .replace(/&Uuml;/g, "Ü")
    .replace(/&ccedil;/g, "ç")
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)))
}

function normalizeName(value) {
  return decodeHtml(value)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " ")
    .trim()
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error)
  process.exit(1)
})

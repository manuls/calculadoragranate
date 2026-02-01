import { teamNameMapping } from "./team-mapping"

export interface ScrapedMatch {
  homeTeam: string
  awayTeam: string
  homeGoals: number
  awayGoals: number
  homeTeamId: number | null
  awayTeamId: number | null
}

export interface ScrapedMatchday {
  matchday: number
  matches: ScrapedMatch[]
  scrapedAt: string
}

const BDFUTBOL_URL = "https://www.bdfutbol.com/es/t/t2025-261rf1.html?tab=results"

/**
 * Scrapes match results from BDFutbol for a specific matchday
 */
export async function scrapeMatchday(matchday: number): Promise<ScrapedMatchday> {
  const response = await fetch(BDFUTBOL_URL, {
    headers: {
      "User-Agent": "Mozilla/5.0 (compatible; CalculadoraGranate/1.0)",
    },
  })

  if (!response.ok) {
    throw new Error(`Failed to fetch BDFutbol: ${response.status}`)
  }

  const html = await response.text()
  const matches = parseMatchdayFromHtml(html, matchday)

  return {
    matchday,
    matches,
    scrapedAt: new Date().toISOString(),
  }
}

/**
 * Parses match results for a specific matchday from BDFutbol HTML
 */
function parseMatchdayFromHtml(html: string, matchday: number): ScrapedMatch[] {
  const matches: ScrapedMatch[] = []

  // Find the section for the specific matchday using regex
  // Pattern: data-jornada='X' followed by match rows until next jornada
  const jornadaPattern = new RegExp(
    `data-jornada='${matchday}'[\\s\\S]*?(?=data-jornada='${matchday + 1}'|$)`,
    "g"
  )

  const jornadaMatch = html.match(jornadaPattern)
  if (!jornadaMatch) {
    console.log(`No data found for matchday ${matchday}`)
    return matches
  }

  const jornadaHtml = jornadaMatch[0]

  // Extract each match row
  // Pattern looks for: team name, result divs with goals, opposing team name
  const matchPattern =
    /<a[^>]*>([^<]+)<\/a><\/div><\/td>\s*<td[^>]*><div[^>]*><a[^>]*><div class='resultat-gols[^']*'[^>]*>(\d+)<\/div><div class='resultat-gols[^']*'[^>]*>(\d+)<\/div><\/a><\/div><\/td>\s*<td[^>]*><div[^>]*><a[^>]*><img[^>]*><\/a><a[^>]*>([^<]+)<\/a>/g

  let match
  while ((match = matchPattern.exec(jornadaHtml)) !== null) {
    const homeTeam = match[1].trim()
    const homeGoals = parseInt(match[2], 10)
    const awayGoals = parseInt(match[3], 10)
    const awayTeam = match[4].trim()

    // Map team names to our IDs
    const homeTeamId = teamNameMapping[normalizeTeamName(homeTeam)] || null
    const awayTeamId = teamNameMapping[normalizeTeamName(awayTeam)] || null

    matches.push({
      homeTeam,
      awayTeam,
      homeGoals,
      awayGoals,
      homeTeamId,
      awayTeamId,
    })
  }

  // If regex didn't work, try alternative parsing
  if (matches.length === 0) {
    return parseMatchdayAlternative(jornadaHtml)
  }

  return matches
}

/**
 * Alternative parsing method using simpler patterns
 */
function parseMatchdayAlternative(jornadaHtml: string): ScrapedMatch[] {
  const matches: ScrapedMatch[] = []

  // Split by table rows that contain match data
  const rows = jornadaHtml.split("<tr class='jornadai")

  for (const row of rows) {
    // Skip header rows
    if (row.includes("<th") || !row.includes("resultat-gols")) continue

    // Extract team names - look for links with team names
    const teamLinks = row.match(/<a[^>]*php\?id=\d+[^>]*>([^<]+)<\/a>/g) || []
    const teams = teamLinks
      .map((link) => {
        const match = link.match(/>([^<]+)</)
        return match ? match[1].trim() : null
      })
      .filter((t) => t && !t.match(/^\d{2}\/\d{2}\/\d{4}$/)) // Filter out dates

    // Extract goals
    const goalsMatch = row.match(/resultat-gols[^>]*>(\d+)<\/div><div class='resultat-gols[^>]*>(\d+)</)

    if (teams.length >= 2 && goalsMatch) {
      const homeTeam = teams[0] as string
      const awayTeam = teams[1] as string
      const homeGoals = parseInt(goalsMatch[1], 10)
      const awayGoals = parseInt(goalsMatch[2], 10)

      const homeTeamId = teamNameMapping[normalizeTeamName(homeTeam)] || null
      const awayTeamId = teamNameMapping[normalizeTeamName(awayTeam)] || null

      matches.push({
        homeTeam,
        awayTeam,
        homeGoals,
        awayGoals,
        homeTeamId,
        awayTeamId,
      })
    }
  }

  return matches
}

/**
 * Normalizes team names for matching
 */
function normalizeTeamName(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Remove accents
    .replace(/\s+/g, " ")
    .trim()
}

/**
 * Calculates the current matchday based on the season start date
 */
export function calculateCurrentMatchday(): number {
  const seasonStart = new Date("2025-08-24") // Approximate season start
  const now = new Date()
  const weeksSinceStart = Math.floor(
    (now.getTime() - seasonStart.getTime()) / (7 * 24 * 60 * 60 * 1000)
  )

  // Matchday 1 starts week 0, with some adjustments for breaks
  return Math.min(Math.max(weeksSinceStart + 1, 1), 38)
}

import baseline from "./granate-baseline";
import type { Competition, CompetitionMatch, CompetitionTeam } from "./model-types";

const sourceUrl = "https://as.com/resultados/futbol/primera_rfef/2026_2027/clasificacion/";
const normalize = (value: string) => value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]/g, "");
const plain = (value: string) => value.replace(/<[^>]+>/g, " ").replace(/&amp;/g, "&").replace(/&nbsp;/g, " ").replace(/\s+/g, " ").trim();
const aliases: [number, string[]][] = [
  [1, ["Mirandés"]], [2, ["Cultural"]], [3, ["Pontevedra"]], [4, ["Bilbao Athletic"]], [5, ["Racing Ferrol"]],
  [6, ["Real Club Deportivo Fabril"]], [7, ["Lugo"]], [15, ["UD Ourense"]], [9, ["Real Avilés"]], [10, ["Barakaldo"]],
  [11, ["Mérida"]], [12, ["Unionistas CF"]], [13, ["Arenas"]], [14, ["Ponferradina"]], [8, ["Zamora"]],
  [16, ["Real Unión"]], [17, ["Cacereño"]], [18, ["CD Coria"]], [19, ["CD Extremadura"]], [20, ["UD Logroñés"]],
];
const ids = new Map(aliases.flatMap(([id, names]) => names.map((name) => [normalize(name), id] as const)));
for (const team of baseline.initialTeams) ids.set(normalize(team.name), team.id);
const content = (html: string, tag: string, css: string) => html.match(new RegExp(`<${tag}\\b[^>]*class=["'][^"']*\\b${css}\\b[^"']*["'][^>]*>([\\s\\S]*?)<\\/${tag}>`, "i"))?.[1] ?? "";

export async function fetchAsGranateCompetition(base: Competition): Promise<Competition> {
  const deadline = AbortSignal.timeout(45000);
  async function read(url: string) {
    const response = await fetch(url, { cache: "no-store", signal: deadline, headers: { "User-Agent": "Mozilla/5.0 (compatible; CalculadoraGranate/1.0)", Accept: "text/html" } });
    if (!response.ok) throw new Error(`AS no disponible (${response.status}).`);
    return response.text();
  }
  const html = await read(sourceUrl);
  if (!html.includes("2026/2027") && !html.includes("2026_2027")) throw new Error("Temporada de respaldo incorrecta.");
  const table = [...html.matchAll(/<table\b[^>]*>[\s\S]*?<\/table>/gi)].map((item) => item[0]).find((item) => item.includes('id="grupo-a-header"'));
  if (!table) throw new Error("No se encontró el grupo 1 de respaldo.");
  const teams: CompetitionTeam[] = [];
  for (const row of table.matchAll(/<tr\b[^>]*>([\s\S]*?)<\/tr>/gi)) {
    const position = Number(plain(content(row[1], "th", "pos")).match(/^\d+/)?.[0]);
    if (!position) continue;
    const id = ids.get(normalize(plain(content(row[1], "span", "a_tb_tn"))));
    const known = base.teams.find((team) => team.id === id);
    if (!known) throw new Error("Equipo de respaldo desconocido.");
    const readNumber = (css: string) => {
      const value = plain(content(row[1], "td", css));
      if (!/^-?\d+$/.test(value)) throw new Error("Clasificación de respaldo incompleta.");
      return Number(value);
    };
    const points = readNumber("pts"), won = readNumber("pg"), drawn = readNumber("pe");
    teams.push({ ...known, position, points, played: readNumber("pj"), won, drawn, lost: readNumber("pp"), goalsFor: readNumber("gf"), goalsAgainst: readNumber("gc"), pointsAdjustment: points - 3 * won - drawn });
  }
  if (teams.length !== 20 || new Set(teams.map((team) => team.id)).size !== 20) throw new Error("Grupo de respaldo incompleto.");
  // Conservamos los 380 emparejamientos de Calculadora Granate. AS actualiza sus resultados.
  const matches: CompetitionMatch[] = base.matches.map((match) => ({ ...match }));
  const rounds = Array.from({ length: Math.min(38, Math.max(...teams.map((team) => team.played)) + 1) }, (_, i) => i + 1);
  for (let start = 0; start < rounds.length; start += 3) {
    if (start) await new Promise((resolve) => setTimeout(resolve, 1000));
    const results = await Promise.all(rounds.slice(start, start + 3).map(async (round) => ({ round, html: await read(`https://as.com/resultados/futbol/primera_rfef/2026_2027/jornada/grupos_a_${round}/`) })));
    for (const result of results) {
      let parsed = 0;
      for (const block of result.html.matchAll(/<li\b[^>]*class=["'][^"']*\ba_sc_l_it\b[^"']*["'][\s\S]*?<\/li>/gi)) {
        if (plain(content(block[0], "div", "a_sc_gp")) !== "Grupo I") continue;
        const tag = block[0].slice(0, block[0].indexOf(">") + 1);
        const attr = (name: string) => tag.match(new RegExp(`${name}=["']([^"']*)["']`))?.[1] ?? "";
        const home = ids.get(normalize(attr("data-team-home-name"))), away = ids.get(normalize(attr("data-team-away-name")));
        const match = matches.find((item) => item.homeId === home && item.awayId === away && item.round === result.round);
        if (!match) throw new Error("El calendario de AS no coincide con Calculadora Granate.");
        const score = plain(content(block[0], "div", "a_sc_gl")).match(/^(\d+)\s*-\s*(\d+)$/);
        const finished = plain(content(block[0], "div", "a_sc_st")) === "Finalizado";
        if (finished && !score) throw new Error("Resultado final sin marcador.");
        match.homeGoals = finished ? Number(score![1]) : null;
        match.awayGoals = finished ? Number(score![2]) : null;
        const date = attr("data-datetime");
        if (/^202[67]-\d\d-\d\dT/.test(date)) match.date = date.slice(0, 10);
        parsed++;
      }
      if (parsed !== 10) throw new Error("Jornada de respaldo incompleta.");
    }
  }
  for (const team of teams) {
    const games = matches.filter((match) => (match.homeId === team.id || match.awayId === team.id) && match.homeGoals !== null && match.awayGoals !== null);
    const goalsFor = games.reduce((sum, match) => sum + (match.homeId === team.id ? match.homeGoals! : match.awayGoals!), 0);
    const goalsAgainst = games.reduce((sum, match) => sum + (match.homeId === team.id ? match.awayGoals! : match.homeGoals!), 0);
    const won = games.filter((match) => match.homeId === team.id ? match.homeGoals! > match.awayGoals! : match.awayGoals! > match.homeGoals!).length;
    const drawn = games.filter((match) => match.homeGoals === match.awayGoals).length;
    if (won !== team.won || drawn !== team.drawn || games.length - won - drawn !== team.lost || games.length !== team.played || goalsFor !== team.goalsFor || goalsAgainst !== team.goalsAgainst) throw new Error("AS aún no ha sincronizado su clasificación y sus marcadores.");
  }
  return { ...base, teams: teams.sort((a, b) => a.position - b.position), matches, source: "AS · Calendario de Calculadora Granate", sourceUrl, capturedAt: new Date().toISOString(), availability: "source" };
}

// Importador sin dependencias. Mantiene el formato de partidos usado por Calculadora Granate.
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const exec = promisify(execFile);
const root = fileURLToPath(new URL("../../", import.meta.url));
const output = path.join(root, "lib/forecasts");
const cache = path.join(root, ".cache/forecast-import");
await mkdir(cache, { recursive: true });
const normalize = (value) => value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]/g, "");
const text = (value) => value.replace(/<[^>]+>/g, " ").replace(/&amp;/g, "&").replace(/&nbsp;/g, " ").replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n))).replace(/\s+/g, " ").trim();

async function html(url, name) {
  const location = path.join(cache, name);
  if (!process.argv.includes("--refresh")) {
    try { return await readFile(location, "utf8"); } catch { /* Primera importación. */ }
  }
  await new Promise((resolve) => setTimeout(resolve, 1500));
  await exec("curl", ["--fail", "--silent", "--show-error", "--location", "--max-time", "35", url, "--output", location]);
  return readFile(location, "utf8");
}

function parse(tableHtml, resultsHtml, season, group) {
  const table = tableHtml.match(/<table\b[^>]*id="classific"[^>]*>([\s\S]*?)<\/table>/)?.[1];
  if (!table) throw new Error(`Sin clasificación en ${season} G${group}`);
  const teams = [...table.matchAll(/<tr data-ideq="([^"]+)">([\s\S]*?)<\/tr>/g)].map((row) => {
    const cells = [...row[2].matchAll(/<td\b[^>]*>([\s\S]*?)<\/td>/g)].map((cell) => text(cell[1]));
    return { id: row[1], name: cells[3], position: Number(cells[1]), points: Number(cells[4].match(/^-?\d+/)?.[0]), played: Number(cells[5]), won: Number(cells[6]), drawn: Number(cells[7]), lost: Number(cells[8]), goalsFor: Number(cells[9]), goalsAgainst: Number(cells[10]), administrativeNote: cells[4].includes("*") };
  });
  const byName = new Map(teams.map((team) => [normalize(team.name), team.id]));
  const sourceTeams = new Map([...resultsHtml.matchAll(/SE\[(\d+)\]="\d+\|([^"]+)";/g)].map((entry) => {
    const name = text(entry[2]);
    const id = byName.get(normalize(name));
    if (!id) throw new Error(`Equipo sin correspondencia: ${name}, ${season} G${group}`);
    return [Number(entry[1]), id];
  }));
  const matches = [...resultsHtml.matchAll(/SP\[(\d+)\]\.push\((\{[^;]+\})\);/g)].map((entry) => {
    const value = JSON.parse(entry[2]);
    return { id: Number(value.id), round: Number(entry[1]), homeId: sourceTeams.get(Number(value.a1)), awayId: sourceTeams.get(Number(value.a2)), date: value.d, homeGoals: Number(value.g1) >= 0 ? Number(value.g1) : null, awayGoals: Number(value.g2) >= 0 ? Number(value.g2) : null };
  });
  if (teams.length !== 20 || matches.length !== 380 || new Set(matches.map((m) => m.id)).size !== 380
    || matches.some((m) => !m.homeId || !m.awayId || m.homeGoals === null || m.awayGoals === null)
    || teams.some((t) => t.played !== 38 || !Number.isFinite(t.points))) {
    throw new Error(`Temporada incompleta: ${season} G${group}`);
  }
  // Los puntos oficiales pueden incluir sanciones. Se conserva el ajuste de cada equipo.
  for (const team of teams) team.pointsAdjustment = team.points - (team.won * 3 + team.drawn);
  return { season, group, sourceUrl: `https://www.bdfutbol.com/es/t/t${season}1rf${group}.html`, capturedAt: new Date().toISOString(), teams, matches };
}

const seasons = [];
for (let year = 2021; year <= 2025; year++) {
  const season = `${year}-${String(year + 1).slice(2)}`;
  for (const group of [1, 2]) {
    const url = `https://www.bdfutbol.com/es/t/t${season}1rf${group}.html`;
    const table = await html(url, `${season}-${group}-table.html`);
    const results = await html(`${url}?tab=results`, `${season}-${group}-results.html`);
    const dataset = parse(table, results, season, group);
    seasons.push(dataset);
    console.log(`${season} G${group}: ${dataset.matches.length} partidos, último salvado ${dataset.teams.find((t) => t.position === 15).points} puntos`);
    await writeFile(path.join(output, "historical-seasons.json"), JSON.stringify({ importedAt: new Date().toISOString(), seasons }, null, 2) + "\n");
  }
}

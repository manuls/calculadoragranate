// Copias locales de los escudos: las URLs originales siguen identificando equipos en los datos.
const localCrests = new Set(["13l.png", "145.png", "149.png", "178.png", "359b.png", "411.png", "473.png", "48.png", "510.png", "515.png", "58.png", "62.png", "6b.png", "76.png", "81.png", "84.png", "87.png", "88.png", "95.png", "99.png"])

export function teamCrestUrl(source: string): string {
  const filename = source.match(/^https:\/\/www\.bdfutbol\.com\/i\/eg\/([a-z0-9]+\.png)$/i)?.[1]
  return filename && localCrests.has(filename) ? `/crests/${filename}` : source
}

// La fecha del calendario se conserva para horarios aún no anunciados.
// kickoffAt guarda un instante ISO UTC y se presenta siempre en Europe/Madrid.
export function madridDate(value: Date): string {
  const parts = Object.fromEntries(new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/Madrid", year: "numeric", month: "2-digit", day: "2-digit",
  }).formatToParts(value).map((part) => [part.type, part.value]));
  return `${parts.year}-${parts.month}-${parts.day}`;
}

export function sourceSchedule(value: string, confirmed: boolean): { date: string | null; kickoffAt: string | null } {
  if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:Z|[+-]\d{2}:\d{2})$/.test(value)) return { date: null, kickoffAt: null };
  const instant = new Date(value);
  if (!Number.isFinite(instant.getTime())) return { date: null, kickoffAt: null };
  return { date: madridDate(instant), kickoffAt: confirmed ? instant.toISOString() : null };
}

export function fixtureSchedule(date?: string | null, kickoffAt?: string | null): string {
  const instant = kickoffAt ? new Date(kickoffAt) : null;
  if (instant && Number.isFinite(instant.getTime())) {
    return new Intl.DateTimeFormat("es-ES", {
      timeZone: "Europe/Madrid", weekday: "short", day: "numeric", month: "short",
      hour: "2-digit", minute: "2-digit", hourCycle: "h23",
    }).format(instant);
  }
  if (date && /^\d{4}-\d{2}-\d{2}$/.test(date)) {
    const day = new Date(`${date}T12:00:00Z`);
    if (Number.isFinite(day.getTime())) return `${new Intl.DateTimeFormat("es-ES", {
      timeZone: "Europe/Madrid", weekday: "short", day: "numeric", month: "short",
    }).format(day)} · Hora por confirmar`;
  }
  return "Fecha y hora por confirmar";
}

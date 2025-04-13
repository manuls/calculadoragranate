import MatchIdViewer from "@/components/match-id-viewer"

export default function MatchIdsPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Relación de IDs de Partidos</h1>
      <p className="mb-6 text-muted-foreground">
        Esta página muestra la relación entre los IDs de los partidos y los equipos que participan en ellos. Utiliza
        esta información para identificar correctamente los partidos al editar resultados.
      </p>
      <MatchIdViewer />
    </div>
  )
}

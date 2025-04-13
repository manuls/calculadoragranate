"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { updateHistoricalData, convertOfficialToHistorical } from "@/lib/prediction-service"
import { fetchHistoricalMatches, submitHistoricalMatches } from "@/lib/api-historical"
import type { HistoricalMatch } from "@/lib/types"
import type { Match } from "@/lib/types"
import { RefreshCcw, Upload, DownloadCloud, Check, FilePlus2 } from "lucide-react"

interface HistoricalDataImportProps {
  fixtures: Match[]
}

export default function HistoricalDataImport({ fixtures }: HistoricalDataImportProps) {
  const [importJson, setImportJson] = useState("")
  const [activeTab, setActiveTab] = useState("import")
  const [isImporting, setIsImporting] = useState(false)
  const [importedCount, setImportedCount] = useState<number | null>(null)
  const { toast } = useToast()

  // Manejar la importación de datos JSON
  const handleImportData = () => {
    setIsImporting(true)

    try {
      // Validar JSON
      let data: HistoricalMatch[]
      try {
        data = JSON.parse(importJson)
      } catch (error) {
        throw new Error("El formato JSON no es válido")
      }

      // Validar estructura
      if (!Array.isArray(data)) {
        throw new Error("Los datos deben ser un array de partidos")
      }

      // Validar que cada elemento tenga la estructura correcta
      if (data.length > 0) {
        const requiredFields = ["homeTeamId", "awayTeamId", "homeGoals", "awayGoals"]
        const firstItem = data[0]

        for (const field of requiredFields) {
          if (!(field in firstItem)) {
            throw new Error(`Falta el campo obligatorio: ${field}`)
          }
        }
      }

      // Enviar los datos al backend
      submitHistoricalMatches(data)
        .then((response) => {
          if (response.success) {
            // Actualizar también los datos locales
            updateHistoricalData(data)

            setImportedCount(data.length)
            toast({
              title: "Importación exitosa",
              description: `Se han importado ${data.length} partidos históricos`,
            })
          } else {
            throw new Error(response.error || "Error al guardar los datos")
          }
        })
        .catch((error) => {
          throw error
        })
        .finally(() => {
          setIsImporting(false)
        })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Error desconocido"

      toast({
        title: "Error al importar",
        description: errorMessage,
        variant: "destructive",
      })
      setIsImporting(false)
    }
  }

  // Convertir resultados oficiales actuales a datos históricos
  const convertCurrentResults = () => {
    try {
      // Obtener partidos con resultados oficiales
      const historicalData = convertOfficialToHistorical(fixtures, false)

      // Enviar los datos al backend
      submitHistoricalMatches(historicalData)
        .then((response) => {
          if (response.success) {
            // Actualizar también los datos locales
            updateHistoricalData(historicalData)

            setImportedCount(historicalData.length)
            toast({
              title: "Conversión exitosa",
              description: `Se han convertido ${historicalData.length} resultados oficiales a datos históricos`,
            })
          } else {
            throw new Error(response.error || "Error al guardar los datos convertidos")
          }
        })
        .catch((error) => {
          throw error
        })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Error desconocido"

      toast({
        title: "Error al convertir resultados",
        description: errorMessage,
        variant: "destructive",
      })
    }
  }

  // Generar JSON de ejemplo
  const generateSampleJson = () => {
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    const sampleData: HistoricalMatch[] = [
      {
        id: 1,
        date: yesterday.toISOString().split("T")[0],
        homeTeamId: 1, // Pontevedra CF
        awayTeamId: 2, // CD Numancia
        homeGoals: 2,
        awayGoals: 1,
        season: "2023-2024",
        matchday: 5,
      },
      {
        id: 2,
        date: "2023-10-15",
        homeTeamId: 3, // Real Avila
        awayTeamId: 1, // Pontevedra CF
        homeGoals: 0,
        awayGoals: 3,
        season: "2023-2024",
        matchday: 4,
      },
    ]

    setImportJson(JSON.stringify(sampleData, null, 2))
  }

  // Exportar datos a archivo JSON
  const exportDataAsJson = () => {
    try {
      fetchHistoricalMatches()
        .then((response) => {
          if (response.success && response.data && response.data.matches) {
            const data = response.data.matches
            const dataStr = JSON.stringify(data, null, 2)
            const dataBlob = new Blob([dataStr], { type: "application/json" })
            const url = URL.createObjectURL(dataBlob)

            const a = document.createElement("a")
            a.href = url
            a.download = "historical-matches.json"
            document.body.appendChild(a)
            a.click()
            document.body.removeChild(a)
            URL.revokeObjectURL(url)

            toast({
              title: "Exportación exitosa",
              description: "Los datos históricos se han exportado correctamente",
            })
          } else {
            throw new Error(response.error || "No hay datos históricos para exportar")
          }
        })
        .catch((error) => {
          throw error
        })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Error desconocido"

      toast({
        title: "Error al exportar",
        description: errorMessage,
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Datos Históricos para Predicciones</h2>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="import">Importar Datos</TabsTrigger>
          <TabsTrigger value="convert">Usar Resultados Actuales</TabsTrigger>
        </TabsList>

        <TabsContent value="import" className="space-y-4">
          <div className="flex flex-col space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Formato JSON para importar</span>
              <Button variant="ghost" size="sm" onClick={generateSampleJson}>
                <FilePlus2 className="h-4 w-4 mr-1" />
                Generar Ejemplo
              </Button>
            </div>

            <Textarea
              placeholder="[{ id: 1, homeTeamId: 1, awayTeamId: 2, homeGoals: 1, awayGoals: 0, date: '2023-09-10', ... }]"
              value={importJson}
              onChange={(e) => setImportJson(e.target.value)}
              className="min-h-[200px] font-mono text-sm"
            />

            <div className="flex flex-col sm:flex-row justify-between gap-2 mt-4">
              <Button
                onClick={handleImportData}
                disabled={isImporting || !importJson.trim()}
                className="w-full sm:w-auto"
              >
                {isImporting ? (
                  <>
                    <RefreshCcw className="h-4 w-4 mr-2 animate-spin" />
                    Importando...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4 mr-2" />
                    Importar Datos
                  </>
                )}
              </Button>

              <Button variant="outline" onClick={exportDataAsJson} className="w-full sm:w-auto">
                <DownloadCloud className="h-4 w-4 mr-2" />
                Exportar Datos Actuales
              </Button>
            </div>
          </div>

          {importedCount !== null && (
            <div className="bg-primary/10 p-3 rounded-md mt-4 flex items-center">
              <Check className="h-5 w-5 text-primary mr-2" />
              <p>Se han importado correctamente {importedCount} partidos históricos</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="convert" className="space-y-4">
          <div className="bg-muted/30 p-4 rounded-md">
            <h3 className="font-medium mb-2">Utilizar resultados oficiales como datos históricos</h3>
            <p className="text-sm text-muted-foreground mb-3">
              Esta opción convierte automáticamente todos los resultados oficiales registrados en la aplicación a datos
              históricos que pueden ser utilizados por el algoritmo de predicción.
            </p>
            <p className="text-sm text-muted-foreground mb-4">
              Es una forma rápida de mejorar las predicciones si ya tienes varios resultados oficiales registrados.
            </p>

            <Button onClick={convertCurrentResults}>
              <RefreshCcw className="h-4 w-4 mr-2" />
              Convertir Resultados Oficiales
            </Button>
          </div>

          <div className="border p-4 rounded-md">
            <h3 className="font-medium mb-2">Resultados actuales disponibles</h3>
            <div className="space-y-2">
              {fixtures.filter((match) => match.result && (match.locked || match.result.isOfficial)).length > 0 ? (
                <>
                  <div className="flex items-center justify-between">
                    <span>Resultados oficiales:</span>
                    <Badge variant="secondary">
                      {fixtures.filter((match) => match.result && (match.locked || match.result.isOfficial)).length}
                    </Badge>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Estos resultados pueden ser convertidos a datos históricos para mejorar las predicciones.
                  </div>
                </>
              ) : (
                <div className="text-sm text-muted-foreground">
                  No hay resultados oficiales disponibles para convertir.
                </div>
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <div className="mt-4 pt-4 border-t text-xs text-muted-foreground">
        <p>
          <strong>Nota:</strong> Los datos históricos se utilizan para calcular estadísticas como la fortaleza ofensiva
          y defensiva de cada equipo, lo que mejora la precisión de las predicciones. Estos datos se almacenan
          localmente en tu navegador.
        </p>
      </div>
    </div>
  )
}

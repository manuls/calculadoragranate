"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { getMatchesByMatchday, matchIdMapping } from "@/lib/match-id-mapping"

export default function MatchIdViewer() {
  const [selectedMatchday, setSelectedMatchday] = useState<string>("31")

  // Obtener todas las jornadas únicas
  const matchdays = Array.from(new Set(matchIdMapping.map((match) => match.matchday))).sort((a, b) => a - b)

  // Obtener los partidos de la jornada seleccionada
  const matches = getMatchesByMatchday(Number.parseInt(selectedMatchday))

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Visor de IDs de Partidos</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <Select value={selectedMatchday} onValueChange={setSelectedMatchday}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Seleccionar jornada" />
            </SelectTrigger>
            <SelectContent>
              {matchdays.map((matchday) => (
                <SelectItem key={matchday} value={matchday.toString()}>
                  Jornada {matchday}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Jornada</TableHead>
                <TableHead>Equipo Local</TableHead>
                <TableHead>Equipo Visitante</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {matches.map((match) => (
                <TableRow key={match.id}>
                  <TableCell className="font-medium">{match.id}</TableCell>
                  <TableCell>J{match.matchday}</TableCell>
                  <TableCell>{match.homeTeam}</TableCell>
                  <TableCell>{match.awayTeam}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}

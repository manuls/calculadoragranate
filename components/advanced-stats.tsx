"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import type { Team, Match } from "@/lib/types"

interface AdvancedStatsProps {
  teams: Team[]
  fixtures: Match[]
}

export default function AdvancedStats({ teams, fixtures }: AdvancedStatsProps) {
  const [activeTab, setActiveTab] = useState("goals")

  // Datos para el gráfico de goles
  const goalsData = teams
    .map((team) => ({
      name: team.name,
      goalsFor: team.goalsFor,
      goalsAgainst: team.goalsAgainst,
    }))
    .sort((a, b) => b.goalsFor - a.goalsFor)
    .slice(0, 10)

  // Datos para el gráfico de puntos
  const pointsData = teams
    .map((team) => ({
      name: team.name,
      points: team.points,
    }))
    .sort((a, b) => b.points - a.points)

  // Datos para el gráfico de victorias/derrotas/empates
  const resultsData = [
    {
      name: "Victorias locales",
      value: fixtures.filter((m) => m.result && m.result.homeGoals > m.result.awayGoals).length,
    },
    { name: "Empates", value: fixtures.filter((m) => m.result && m.result.homeGoals === m.result.awayGoals).length },
    {
      name: "Victorias visitantes",
      value: fixtures.filter((m) => m.result && m.result.homeGoals < m.result.awayGoals).length,
    },
  ]

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"]

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Estadísticas Avanzadas</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="goals">Goles</TabsTrigger>
            <TabsTrigger value="points">Puntos</TabsTrigger>
            <TabsTrigger value="results">Resultados</TabsTrigger>
          </TabsList>

          <TabsContent value="goals" className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={goalsData} margin={{ top: 20, right: 30, left: 20, bottom: 70 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={70} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="goalsFor" name="Goles a favor" fill="#8884d8" />
                <Bar dataKey="goalsAgainst" name="Goles en contra" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </TabsContent>

          <TabsContent value="points" className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={pointsData} margin={{ top: 20, right: 30, left: 20, bottom: 70 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={70} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="points" name="Puntos" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </TabsContent>

          <TabsContent value="results" className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={resultsData}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={150}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {resultsData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

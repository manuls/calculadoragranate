"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { motion } from "framer-motion"
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react"
import type { Match, Team } from "@/lib/types"
import { Button } from "@/components/ui/button"

interface MatchCalendarProps {
  fixtures: Match[]
  teams: Team[]
  tempResults: Record<number, { home: string; away: string }>
}

export default function MatchCalendar({ fixtures, teams, tempResults }: MatchCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState<number>(new Date().getMonth())
  const [currentYear, setCurrentYear] = useState<number>(new Date().getFullYear())

  // Funcion para obtener el nombre del equipo por ID
  const getTeamName = (teamId: number) => {
    const team = teams.find((t) => t.id === teamId)
    return team ? team.name : "Equipo desconocido"
  }

  // Funcion para obtener el nombre del mes
  const getMonthName = (month: number) => {
    const monthNames = [
      "Enero",
      "Febrero",
      "Marzo",
      "Abril",
      "Mayo",
      "Junio",
      "Julio",
      "Agosto",
      "Septiembre",
      "Octubre",
      "Noviembre",
      "Diciembre",
    ]
    return monthNames[month]
  }

  // Funcion para navegar al mes anterior
  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11)
      setCurrentYear(currentYear - 1)
    } else {
      setCurrentMonth(currentMonth - 1)
    }
  }

  // Funcion para navegar al mes siguiente
  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0)
      setCurrentYear(currentYear + 1)
    } else {
      setCurrentMonth(currentMonth + 1)
    }
  }

  // Obtener el primer dia del mes actual
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1)

  // Obtener el ultimo dia del mes actual
  const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0)

  // Crear un array con todos los dias del mes
  const daysInMonth = []
  for (let i = 1; i <= lastDayOfMonth.getDate(); i++) {
    daysInMonth.push(new Date(currentYear, currentMonth, i))
  }

  // Obtener el dia de la semana del primer dia del mes (0 = Domingo, 1 = Lunes, etc.)
  const firstDayOfWeek = firstDayOfMonth.getDay()

  // Ajustar para que la semana comience en lunes (0 = Lunes, 6 = Domingo)
  const adjustedFirstDay = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1

  // Crear un array con los dias vacios antes del primer dia del mes
  const emptyDays = []
  for (let i = 0; i < adjustedFirstDay; i++) {
    emptyDays.push(null)
  }

  // Combinar los dias vacios y los dias del mes
  const calendarDays = [...emptyDays, ...daysInMonth]

  // Agrupar los dias en semanas
  const weeks = []
  for (let i = 0; i < calendarDays.length; i += 7) {
    weeks.push(calendarDays.slice(i, i + 7))
  }

  // Filtrar partidos para el mes actual
  const monthFixtures = fixtures.filter((match) => {
    // Asignamos meses basados en la jornada (aproximacion)
    let matchMonth = 0
    if (match.matchday <= 4)
      matchMonth = 8 // Septiembre
    else if (match.matchday <= 8)
      matchMonth = 9 // Octubre
    else if (match.matchday <= 12)
      matchMonth = 10 // Noviembre
    else if (match.matchday <= 16)
      matchMonth = 11 // Diciembre
    else if (match.matchday <= 20)
      matchMonth = 0 // Enero
    else if (match.matchday <= 24)
      matchMonth = 1 // Febrero
    else if (match.matchday <= 28)
      matchMonth = 2 // Marzo
    else if (match.matchday <= 32)
      matchMonth = 3 // Abril
    else matchMonth = 4 // Mayo

    return matchMonth === currentMonth
  })

  // Funcion para obtener los partidos de un dia especifico
  const getMatchesForDay = (day: Date | null) => {
    if (!day) return []

    const dayOfMonth = day.getDate()

    // Distribuimos los partidos a lo largo del mes
    const matchesPerDay = Math.ceil(monthFixtures.length / lastDayOfMonth.getDate())
    const startIndex = (dayOfMonth - 1) * matchesPerDay

    return monthFixtures.slice(startIndex, startIndex + matchesPerDay)
  }

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center">
            <Calendar className="mr-2 h-5 w-5" />
            Calendario de Partidos
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="icon" onClick={prevMonth}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="font-medium">
              {getMonthName(currentMonth)} {currentYear}
            </span>
            <Button variant="outline" size="icon" onClick={nextMonth}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-1 mb-2">
          {["Lun", "Mar", "Mie", "Jue", "Vie", "Sab", "Dom"].map((day) => (
            <div key={day} className="text-center font-medium text-sm py-1">
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {weeks.map((week, weekIndex) =>
            week.map((day, dayIndex) => {
              const isToday = day && day.getDate() === new Date().getDate() && day.getMonth() === new Date().getMonth()

              let cellClass = "border rounded-md p-1 min-h-[100px] relative "
              cellClass += day ? "bg-card " : "bg-muted/20 "
              cellClass += day && isToday ? "border-primary" : "border-border"

              return (
                <motion.div
                  key={weekIndex + "-" + dayIndex}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.2, delay: (weekIndex * 7 + dayIndex) * 0.01 }}
                  className={cellClass}
                >
                  {day && (
                    <>
                      <div className="text-right text-sm font-medium mb-1">{day.getDate()}</div>
                      <div className="space-y-1 overflow-y-auto max-h-[80px] text-xs">
                        {getMatchesForDay(day).map((match) => {
                          let resultText = "vs"
                          if (match.result) {
                            resultText = match.result.homeGoals + "-" + match.result.awayGoals
                          } else if (tempResults[match.id]?.home && tempResults[match.id]?.away) {
                            resultText = tempResults[match.id].home + "-" + tempResults[match.id].away
                          }

                          return (
                            <div
                              key={match.id}
                              className="p-1 rounded bg-background border border-border flex flex-col"
                            >
                              <div className="flex justify-between items-center">
                                <span className="truncate max-w-[70px]">{getTeamName(match.homeTeamId)}</span>
                                <span className="mx-1 font-bold">{resultText}</span>
                                <span className="truncate max-w-[70px]">{getTeamName(match.awayTeamId)}</span>
                              </div>
                              <div className="text-center text-[10px] mt-1">J{match.matchday}</div>
                            </div>
                          )
                        })}
                      </div>
                    </>
                  )}
                </motion.div>
              )
            }),
          )}
        </div>
      </CardContent>
    </Card>
  )
}

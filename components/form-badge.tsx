"use client"

import { useState } from "react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import type { FormResult } from "@/lib/team-form"
import { cn } from "@/lib/utils"
import styles from "./standings-table.module.css"

const labels = { V: "Victoria", E: "Empate", D: "Derrota" }
const colors = { V: styles.win, E: styles.draw, D: styles.loss }

export default function FormBadge({ result: { match, outcome }, homeName, awayName }: {
  result: FormResult
  homeName: string
  awayName: string
}) {
  const [open, setOpen] = useState(false)
  const detail = `${labels[outcome]} · Jornada ${match.matchday} · ${homeName} ${match.result.homeGoals}–${match.result.awayGoals} ${awayName}`

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className={cn(styles.badge, styles.badgeButton, colors[outcome])}
          aria-label={detail}
          onPointerEnter={(event) => { if (event.pointerType === "mouse") setOpen(true) }}
          onPointerLeave={(event) => { if (event.pointerType === "mouse") setOpen(false) }}
          onBlur={() => setOpen(false)}
        >{outcome}</button>
      </PopoverTrigger>
      <PopoverContent
        side="top"
        sideOffset={8}
        collisionPadding={12}
        className="w-[min(288px,calc(100vw-24px))] p-3"
        aria-label="Detalle del partido"
        onOpenAutoFocus={(event) => event.preventDefault()}
        onCloseAutoFocus={(event) => event.preventDefault()}
      >
        <p className="mb-2 text-xs text-muted-foreground">Jornada {match.matchday} · {labels[outcome]}</p>
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-3 gap-y-1.5 text-sm">
          <span className="min-w-0 break-words">{homeName}</span><strong className="text-lg tabular-nums">{match.result.homeGoals}</strong>
          <span className="min-w-0 break-words">{awayName}</span><strong className="text-lg tabular-nums">{match.result.awayGoals}</strong>
        </div>
      </PopoverContent>
    </Popover>
  )
}

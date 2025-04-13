"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Maximize2, Minimize2 } from "lucide-react"

interface FullscreenButtonProps {
  targetRef: React.RefObject<HTMLElement>
}

export default function FullscreenButton({ targetRef }: FullscreenButtonProps) {
  const [isFullscreen, setIsFullscreen] = useState(false)

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }

    document.addEventListener("fullscreenchange", handleFullscreenChange)
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange)
  }, [])

  const toggleFullscreen = () => {
    if (!targetRef.current) return

    if (!isFullscreen) {
      targetRef.current.requestFullscreen().catch((err) => {
        console.error(`Error al intentar mostrar en pantalla completa:`, err)
      })
    } else {
      document.exitFullscreen()
    }
  }

  return (
    <Button variant="outline" size="sm" onClick={toggleFullscreen} className="flex items-center gap-2">
      {isFullscreen ? (
        <>
          <Minimize2 className="h-4 w-4" />
          <span className="hidden sm:inline">Salir</span>
        </>
      ) : (
        <>
          <Maximize2 className="h-4 w-4" />
          <span className="hidden sm:inline">Pantalla completa</span>
        </>
      )}
    </Button>
  )
}

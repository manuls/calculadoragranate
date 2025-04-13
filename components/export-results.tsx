"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Download, Camera } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import html2canvas from "html2canvas"
import jsPDF from "jspdf"
import type { Team } from "@/lib/types"

interface ExportResultsProps {
  teams: Team[]
  containerRef: React.RefObject<HTMLDivElement>
}

export default function ExportResults({ teams, containerRef }: ExportResultsProps) {
  const [isExporting, setIsExporting] = useState(false)

  const exportAsPDF = async () => {
    if (!containerRef.current) return

    setIsExporting(true)
    try {
      const canvas = await html2canvas(containerRef.current)
      const imgData = canvas.toDataURL("image/png")

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      })

      const imgWidth = 210
      const imgHeight = (canvas.height * imgWidth) / canvas.width

      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight)
      pdf.save("clasificacion-granate.pdf")
    } catch (error) {
      console.error("Error al exportar a PDF:", error)
    } finally {
      setIsExporting(false)
    }
  }

  const exportAsImage = async () => {
    if (!containerRef.current) return

    setIsExporting(true)
    try {
      const canvas = await html2canvas(containerRef.current)
      const link = document.createElement("a")
      link.download = "clasificacion-granate.png"
      link.href = canvas.toDataURL("image/png")
      link.click()
    } catch (error) {
      console.error("Error al exportar como imagen:", error)
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          <span className="hidden sm:inline">Exportar</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-2" align="end">
        <div className="flex flex-col gap-2">
          <div className="text-sm font-medium mb-1">Exportar como:</div>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
              onClick={exportAsPDF}
              disabled={isExporting}
            >
              <Download className="h-4 w-4" />
              <span>PDF</span>
            </Button>

            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
              onClick={exportAsImage}
              disabled={isExporting}
            >
              <Camera className="h-4 w-4" />
              <span>Imagen</span>
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}

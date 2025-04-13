"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Accessibility } from "lucide-react"

export default function AccessibilityControls() {
  const [fontSize, setFontSize] = useState(100)
  const [highContrast, setHighContrast] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(false)

  useEffect(() => {
    // Aplicar tamaño de fuente
    document.documentElement.style.fontSize = `${fontSize}%`

    // Aplicar alto contraste
    if (highContrast) {
      document.documentElement.classList.add("high-contrast")
    } else {
      document.documentElement.classList.remove("high-contrast")
    }

    // Aplicar movimiento reducido
    if (reducedMotion) {
      document.documentElement.classList.add("reduced-motion")
    } else {
      document.documentElement.classList.remove("reduced-motion")
    }
  }, [fontSize, highContrast, reducedMotion])

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-2">
          <Accessibility className="h-4 w-4" />
          <span className="hidden sm:inline">Accesibilidad</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="space-y-4">
          <h3 className="font-medium">Opciones de accesibilidad</h3>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="font-size">Tamaño de texto: {fontSize}%</Label>
            </div>
            <Slider
              id="font-size"
              min={80}
              max={150}
              step={10}
              value={[fontSize]}
              onValueChange={(value) => setFontSize(value[0])}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="high-contrast">Alto contraste</Label>
            <Switch id="high-contrast" checked={highContrast} onCheckedChange={setHighContrast} />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="reduced-motion">Reducir animaciones</Label>
            <Switch id="reduced-motion" checked={reducedMotion} onCheckedChange={setReducedMotion} />
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}

"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Textarea } from "@/components/ui/textarea"
import { Share2, Facebook, Linkedin, Link, Check } from "lucide-react"
import type { Team } from "@/lib/types"

interface SocialShareProps {
  teams: Team[]
  generateImage: () => Promise<string>
}

export default function SocialShare({ teams, generateImage }: SocialShareProps) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const generateShareText = () => {
    let text = `Mi predicción para la clasificación final de Primera RFEF Grupo 1:\n\n`

    // Añadir los primeros 5 equipos
    teams.slice(0, 5).forEach((team, index) => {
      text += `${index + 1}. ${team.name} - ${team.points} pts\n`
    })

    text += `\nGenerado con Calculadora Granate - ${window.location.href}`

    return text
  }

  const handleGenerateImage = async () => {
    setIsGenerating(true)
    try {
      const url = await generateImage()
      setImageUrl(url)
    } catch (error) {
      console.error("Error al generar imagen:", error)
    } finally {
      setIsGenerating(false)
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generateShareText())
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const shareText = encodeURIComponent(generateShareText())
  const shareUrl = encodeURIComponent(window.location.href)

  const twitterUrl = `https://twitter.com/intent/tweet?text=${shareText}`
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}&quote=${shareText}`
  const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-2">
          <Share2 className="h-4 w-4" />
          <span className="hidden sm:inline">Compartir</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="space-y-4">
          <h3 className="font-medium">Compartir predicción</h3>

          <Textarea value={generateShareText()} readOnly rows={6} className="resize-none" />

          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-2 bg-black text-white hover:bg-gray-800 hover:text-white"
              onClick={() => window.open(twitterUrl, "_blank")}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4"
              >
                <path d="M4 4l11.733 16h4.267l-11.733 -16z" />
                <path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772" />
              </svg>
              <span>X</span>
            </Button>

            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
              onClick={() => window.open(facebookUrl, "_blank")}
            >
              <Facebook className="h-4 w-4" />
              <span>Facebook</span>
            </Button>

            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
              onClick={() => window.open(linkedinUrl, "_blank")}
            >
              <Linkedin className="h-4 w-4" />
              <span>LinkedIn</span>
            </Button>

            <Button variant="outline" size="sm" className="flex items-center gap-2" onClick={copyToClipboard}>
              {copied ? (
                <>
                  <Check className="h-4 w-4" />
                  <span>¡Copiado!</span>
                </>
              ) : (
                <>
                  <Link className="h-4 w-4" />
                  <span>Copiar</span>
                </>
              )}
            </Button>
          </div>

          {!imageUrl ? (
            <Button
              variant="default"
              size="sm"
              className="w-full"
              onClick={handleGenerateImage}
              disabled={isGenerating}
            >
              {isGenerating ? "Generando imagen..." : "Generar imagen para compartir"}
            </Button>
          ) : (
            <div className="space-y-2">
              <img src={imageUrl || "/placeholder.svg"} alt="Clasificación" className="w-full rounded-md border" />
              <Button
                variant="default"
                size="sm"
                className="w-full"
                onClick={() => {
                  const link = document.createElement("a")
                  link.href = imageUrl
                  link.download = "clasificacion-granate.png"
                  link.click()
                }}
              >
                Descargar imagen
              </Button>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}

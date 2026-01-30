"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Facebook, Share2, Copy, Check } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { toast } from "@/hooks/use-toast"
import type { Team } from "@/lib/types"

interface ShareButtonsProps {
  teams: Team[]
  currentUrl: string
  title?: string
  description?: string
}

export default function ShareButtons({
  teams,
  currentUrl,
  title = "Calculadora Granate - Predicción de clasificación",
  description = "Mira mi predicción para la clasificación final de la Primera RFEF Grupo 1",
}: ShareButtonsProps) {
  const [copied, setCopied] = useState(false)

  // Crear un texto con la clasificación actual
  const generateShareText = () => {
    let text = `${title}\n\n`

    // Añadir los primeros 5 equipos
    teams.slice(0, 5).forEach((team, index) => {
      text += `${index + 1}. ${team.name} - ${team.points} pts\n`
    })

    text += `\nVer clasificación completa: ${currentUrl}`

    return encodeURIComponent(text)
  }

  const shareText = generateShareText()

  // Función para copiar al portapapeles
  const copyToClipboard = () => {
    navigator.clipboard.writeText(currentUrl).then(() => {
      setCopied(true)
      toast({
        title: "Enlace copiado",
        description: "El enlace ha sido copiado al portapapeles",
      })

      setTimeout(() => setCopied(false), 2000)
    })
  }

  // URLs para compartir en redes sociales
  const twitterUrl = `https://twitter.com/intent/tweet?text=${shareText}`
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}&quote=${shareText}`
  const whatsappUrl = `https://wa.me/?text=${shareText}`
  const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(currentUrl)}&text=${shareText}`

  // Función para registrar eventos de compartir en Google Analytics
  const trackShare = (platform: string) => {
    if (typeof window !== "undefined" && (window as any).gtag) {
      ;(window as any).gtag("event", "share", {
        event_category: "engagement",
        event_label: platform,
      })
    }
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-2">
          <Share2 className="h-4 w-4" />
          <span className="hidden sm:inline">Compartir</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-2" align="end">
        <div className="flex flex-col gap-2">
          <div className="text-sm font-medium mb-1">Compartir en:</div>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-2 bg-black text-white hover:bg-gray-800 hover:text-white"
              onClick={() => {
                window.open(twitterUrl, "_blank")
                trackShare("twitter")
              }}
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
              className="flex items-center gap-2 bg-[#1877F2] text-white hover:bg-[#1877F2]/90"
              onClick={() => {
                window.open(facebookUrl, "_blank")
                trackShare("facebook")
              }}
            >
              <Facebook className="h-4 w-4" />
              <span>Facebook</span>
            </Button>

            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-2 bg-[#25D366] text-white hover:bg-[#25D366]/90"
              onClick={() => {
                window.open(whatsappUrl, "_blank")
                trackShare("whatsapp")
              }}
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
                <path d="M17.498 14.382c-.301-.15-1.767-.867-2.04-.966-.273-.101-.473-.15-.673.15-.2.301-.767.966-.94 1.164-.173.199-.347.223-.647.075-.3-.15-1.269-.467-2.416-1.483-.893-.795-1.484-1.77-1.66-2.07-.174-.3-.019-.462.13-.61.136-.137.301-.354.451-.531.151-.177.2-.301.3-.502.099-.2.05-.375-.025-.524-.075-.15-.672-1.62-.922-2.206-.24-.584-.487-.51-.672-.51-.172-.007-.371-.01-.571-.01-.2 0-.523.074-.797.375-.273.3-1.045 1.02-1.045 2.475s1.07 2.865 1.219 3.075c.149.21 2.096 3.2 5.076 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.571-.347z" />
                <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 22c-5.523 0-10-4.477-10-10S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" />
              </svg>
              <span>WhatsApp</span>
            </Button>

            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-2 bg-[#0088cc] text-white hover:bg-[#0088cc]/90"
              onClick={() => {
                window.open(telegramUrl, "_blank")
                trackShare("telegram")
              }}
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
                <path d="M22 3L2 10l7 3.5L18 7l-7.5 9.5L22 21l-2-18z" />
              </svg>
              <span>Telegram</span>
            </Button>
          </div>

          <div className="mt-2 pt-2 border-t">
            <Button
              variant="outline"
              size="sm"
              className="w-full flex items-center justify-center gap-2"
              onClick={copyToClipboard}
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4" />
                  <span>¡Copiado!</span>
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" />
                  <span>Copiar enlace</span>
                </>
              )}
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}

"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Textarea } from "@/components/ui/textarea"
import { Share2, Copy, Check, Facebook, PhoneIcon as WhatsApp, Send } from "lucide-react"
import type { Team } from "@/lib/types"
import { useToast } from "@/hooks/use-toast"

interface EnhancedShareButtonsProps {
  teams: Team[]
  currentUrl: string
  title?: string
  description?: string
}

export default function EnhancedShareButtons({
  teams,
  currentUrl,
  title = "Calculadora Granate - Predicción de clasificación",
  description = "Mira mi predicción para la clasificación final de la Segunda RFEF Grupo 1",
}: EnhancedShareButtonsProps) {
  const [copied, setCopied] = useState(false)
  const { toast } = useToast()
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Crear un texto con la clasificación actual
  const generateShareText = () => {
    let text = `${title}

`

    // Añadir los primeros 5 equipos
    teams.slice(0, 5).forEach((team, index) => {
      text += `${index + 1}. ${team.name} - ${team.points} pts
`
    })

    text += `
Ver clasificación completa: ${currentUrl}`

    return text
  }

  const shareText = generateShareText()
  const encodedShareText = encodeURIComponent(shareText)

  // Función para copiar al portapapeles
  const copyToClipboard = () => {
    if (textareaRef.current) {
      textareaRef.current.select()
      navigator.clipboard.writeText(textareaRef.current.value).then(() => {
        setCopied(true)
        toast({
          title: "Texto copiado",
          description: "El texto ha sido copiado al portapapeles",
        })

        setTimeout(() => setCopied(false), 2000)
      })
    }
  }

  // URLs para compartir en redes sociales
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodedShareText}`
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}&quote=${encodedShareText}`
  const whatsappUrl = `https://wa.me/?text=${encodedShareText}`
  const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(currentUrl)}&text=${encodedShareText}`

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
      <PopoverContent className="w-auto p-4" align="end">
        <div className="space-y-4">
          <div className="space-y-2">
            <Textarea ref={textareaRef} value={shareText} readOnly rows={6} className="resize-none font-mono text-xs" />
          </div>

          <div className="grid grid-cols-2 gap-2">
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
              <WhatsApp className="h-4 w-4" />
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
              <Send className="h-4 w-4" />
              <span>Telegram</span>
            </Button>
          </div>

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
                <span>Copiar texto</span>
              </>
            )}
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}

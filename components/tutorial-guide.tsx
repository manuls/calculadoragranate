"use client"

import { useState, useEffect } from "react"
import { X, HelpCircle, ArrowRight, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { cn } from "@/lib/utils"

// Definir los pasos del tutorial
const tutorialSteps = [
  {
    title: "Bienvenido a la Calculadora Granate",
    description:
      "Esta guía te ayudará a entender cómo usar la aplicación. Puedes cerrarla en cualquier momento y volver a abrirla desde el botón de ayuda.",
    target: null,
    position: "center",
  },
  {
    title: "Navegación por pestañas",
    description:
      "La aplicación tiene tres pestañas principales: Clasificación, Predicciones IA y Objetivos del Equipo.",
    target: ".tabs-list",
    position: "bottom",
  },
  {
    title: "Tabla de Clasificación",
    description:
      "Aquí puedes ver la clasificación actual de los equipos. Los colores indican las zonas de ascenso, playoff, play out y descenso.",
    target: ".standings-table",
    position: "left",
  },
  {
    title: "Partidos Pendientes",
    description: "Introduce los resultados de los partidos pendientes para ver cómo afectarían a la clasificación.",
    target: ".match-fixtures",
    position: "right",
  },
  {
    title: "Calcular Clasificación",
    description: "Después de introducir los resultados, pulsa este botón para actualizar la tabla de clasificación.",
    target: ".btn-primary",
    position: "top",
  },
  {
    title: "Predicciones IA",
    description: "En esta pestaña puedes ver predicciones generadas por IA para los próximos partidos.",
    target: "[data-value='predictions_ai']",
    position: "bottom",
  },
  {
    title: "Objetivos del Equipo",
    description: "Aquí puedes ver las probabilidades de que cada equipo alcance diferentes objetivos.",
    target: "[data-value='team_objectives']",
    position: "bottom",
  },
  {
    title: "¡Listo para empezar!",
    description:
      "Ya conoces las funciones básicas de la Calculadora Granate. ¡Disfruta explorando los posibles resultados de la liga!",
    target: null,
    position: "center",
  },
]

interface TutorialGuideProps {
  onComplete?: () => void
}

export default function TutorialGuide({ onComplete }: TutorialGuideProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [highlightStyle, setHighlightStyle] = useState({})
  const [tooltipStyle, setTooltipStyle] = useState({})

  // Función para enviar eventos a Google Analytics
  const sendGAEvent = (eventName: string, eventParams?: Record<string, any>) => {
    if (typeof window !== "undefined" && "gtag" in window) {
      // @ts-ignore
      window.gtag("event", eventName, eventParams)
      console.log(`GA Event: ${eventName}`, eventParams)
    }
  }

  // Comprobar si es la primera visita del usuario
  useEffect(() => {
    const hasSeenTutorial = localStorage.getItem("hasSeenTutorial")
    if (!hasSeenTutorial) {
      // Pequeño retraso para asegurar que la interfaz está cargada
      const timer = setTimeout(() => {
        setIsOpen(true)
        sendGAEvent("tutorial_auto_start")
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [])

  // Posicionar el tooltip y el resaltado
  useEffect(() => {
    if (!isOpen) return

    const step = tutorialSteps[currentStep]

    if (!step.target) {
      // Si no hay target, centrar en la pantalla
      setHighlightStyle({})
      setTooltipStyle({
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
      })
      return
    }

    // Encontrar el elemento objetivo
    const targetElement = document.querySelector(step.target)
    if (!targetElement) return

    // Obtener la posición del elemento
    const rect = targetElement.getBoundingClientRect()

    // Establecer el estilo del resaltado
    setHighlightStyle({
      position: "fixed",
      top: `${rect.top}px`,
      left: `${rect.left}px`,
      width: `${rect.width}px`,
      height: `${rect.height}px`,
    })

    // Posicionar el tooltip según la posición especificada
    let tooltipTop, tooltipLeft

    switch (step.position) {
      case "top":
        tooltipTop = rect.top - 10
        tooltipLeft = rect.left + rect.width / 2
        break
      case "bottom":
        tooltipTop = rect.bottom + 10
        tooltipLeft = rect.left + rect.width / 2
        break
      case "left":
        tooltipTop = rect.top + rect.height / 2
        tooltipLeft = rect.left - 10
        break
      case "right":
        tooltipTop = rect.top + rect.height / 2
        tooltipLeft = rect.right + 10
        break
      default:
        tooltipTop = rect.top + rect.height / 2
        tooltipLeft = rect.left + rect.width / 2
    }

    setTooltipStyle({
      position: "fixed",
      top: `${tooltipTop}px`,
      left: `${tooltipLeft}px`,
      transform:
        step.position === "left"
          ? "translate(-100%, -50%)"
          : step.position === "right"
            ? "translate(0, -50%)"
            : step.position === "top"
              ? "translate(-50%, -100%)"
              : "translate(-50%, 0)",
    })
  }, [currentStep, isOpen])

  // Manejar el avance al siguiente paso
  const handleNext = () => {
    if (currentStep < tutorialSteps.length - 1) {
      const nextStep = currentStep + 1
      setCurrentStep(nextStep)
      sendGAEvent("tutorial_next_step", {
        from_step: currentStep + 1,
        to_step: nextStep + 1,
        step_title: tutorialSteps[nextStep].title,
      })
    } else {
      completeTutorial(true)
    }
  }

  // Manejar el retroceso al paso anterior
  const handlePrevious = () => {
    if (currentStep > 0) {
      const prevStep = currentStep - 1
      setCurrentStep(prevStep)
      sendGAEvent("tutorial_prev_step", {
        from_step: currentStep + 1,
        to_step: prevStep + 1,
        step_title: tutorialSteps[prevStep].title,
      })
    }
  }

  // Completar el tutorial
  const completeTutorial = (finished = false) => {
    setIsOpen(false)
    localStorage.setItem("hasSeenTutorial", "true")

    if (finished) {
      sendGAEvent("tutorial_completed", { steps_viewed: currentStep + 1 })
    } else {
      sendGAEvent("tutorial_skipped", {
        last_step_viewed: currentStep + 1,
        last_step_title: tutorialSteps[currentStep].title,
      })
    }

    if (onComplete) onComplete()
  }

  // Reiniciar el tutorial
  const startTutorial = () => {
    setCurrentStep(0)
    setIsOpen(true)
    sendGAEvent("tutorial_manual_start")
  }

  return (
    <>
      {/* Botón para abrir el tutorial */}
      <Button
        variant="outline"
        size="sm"
        onClick={startTutorial}
        className="fixed bottom-4 right-4 z-50 rounded-full w-10 h-10 p-0 flex items-center justify-center"
        aria-label="Abrir tutorial"
      >
        <HelpCircle className="h-5 w-5" />
      </Button>

      {/* Overlay del tutorial */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
          {/* Resaltado del elemento */}
          {tutorialSteps[currentStep].target && (
            <div className="absolute border-2 border-primary rounded-md z-[60] animate-pulse" style={highlightStyle} />
          )}

          {/* Tooltip con la información del paso */}
          <div
            className={cn(
              "bg-card border rounded-lg shadow-lg p-4 max-w-md z-[70]",
              tutorialSteps[currentStep].target ? "absolute" : "relative",
            )}
            style={tutorialSteps[currentStep].target ? tooltipStyle : {}}
          >
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-bold text-lg">{tutorialSteps[currentStep].title}</h3>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => completeTutorial(false)}
                aria-label="Cerrar tutorial"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <p className="text-muted-foreground mb-4">{tutorialSteps[currentStep].description}</p>

            <div className="flex justify-between items-center">
              <div>
                <span className="text-sm text-muted-foreground">
                  Paso {currentStep + 1} de {tutorialSteps.length}
                </span>
              </div>
              <div className="flex gap-2">
                {currentStep > 0 && (
                  <Button variant="outline" size="sm" onClick={handlePrevious} className="flex items-center">
                    <ArrowLeft className="h-4 w-4 mr-1" />
                    Anterior
                  </Button>
                )}
                <Button variant="default" size="sm" onClick={handleNext} className="flex items-center">
                  {currentStep < tutorialSteps.length - 1 ? (
                    <>
                      Siguiente
                      <ArrowRight className="h-4 w-4 ml-1" />
                    </>
                  ) : (
                    "Finalizar"
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Diálogo de bienvenida para nuevos usuarios */}
      <Dialog
        open={isOpen && currentStep === 0}
        onOpenChange={(open) => {
          if (!open) completeTutorial(false)
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Bienvenido a la Calculadora Granate</DialogTitle>
            <DialogDescription>
              Esta aplicación te permite predecir resultados y ver cómo afectarían a la clasificación de la liga.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <p>¿Te gustaría ver un breve tutorial sobre cómo usar la aplicación?</p>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  completeTutorial(false)
                  sendGAEvent("tutorial_welcome_skip")
                }}
              >
                No, gracias
              </Button>
              <Button
                onClick={() => {
                  handleNext()
                  sendGAEvent("tutorial_welcome_start")
                }}
              >
                Sí, mostrar tutorial
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

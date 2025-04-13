"use client"

import { useEffect, useState } from "react"
import Link from "next/link"

export function AppTitle() {
  const [animate, setAnimate] = useState(false)

  useEffect(() => {
    // Iniciar animación aleatoria cada 5-10 segundos
    const interval = setInterval(
      () => {
        setAnimate(true)
        setTimeout(() => setAnimate(false), 1500)
      },
      Math.random() * 7000 + 5000,
    )

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="relative flex items-center justify-center py-3 my-2">
      <Link href="/" className="block">
        <div className="relative">
          {/* Fondo del título con forma de escudo */}
          <div
            className="bg-gradient-to-b from-primary to-primary/80 dark:from-primary dark:to-primary/90
                         px-6 py-3 rounded-t-lg shadow-lg border-2 border-primary/30 dark:border-primary/50
                         relative"
          >
            {/* Forma de escudo - parte inferior */}
            <div className="absolute -bottom-[15px] left-0 right-0 h-[15px] overflow-hidden">
              <div
                className="w-full h-[30px] bg-gradient-to-b from-primary to-primary/80 dark:from-primary dark:to-primary/90
                            rounded-b-[100%] border-x-2 border-b-2 border-primary/30 dark:border-primary/50"
              ></div>
            </div>

            {/* Título principal con efecto de relieve */}
            <h1 className="text-3xl font-bold text-primary-foreground relative">
              {/* Sombra de texto para efecto 3D */}
              <span className="absolute -left-[1px] -top-[1px] opacity-30 blur-[0.5px] select-none">
                Calculadora Granate
              </span>
              Calculadora Granate
            </h1>
          </div>

          {/* Sombra del escudo */}
          <div
            className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-[50%] h-2 
                         bg-black/20 dark:bg-black/40 blur-md rounded-full"
          ></div>
        </div>
      </Link>

      {/* Etiqueta BETA */}
      <div className="absolute -top-3 -right-3 transform rotate-12 z-10">
        <div className={`${animate ? "animate-pulse" : ""}`} style={{ animationDuration: "1s" }}>
          <div
            className="relative bg-gradient-to-r from-yellow-500 to-yellow-300 dark:from-yellow-600 dark:to-yellow-400 
                         px-3 py-1 rounded-md shadow-md
                         border-2 border-yellow-600 dark:border-yellow-300
                         flex items-center justify-center"
          >
            {/* Patrón de balón de fútbol */}
            <div className="absolute -left-1 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-white dark:bg-gray-800 rounded-full border border-yellow-600 dark:border-yellow-300"></div>
            <div className="absolute -right-1 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-white dark:bg-gray-800 rounded-full border border-yellow-600 dark:border-yellow-300"></div>
            <div className="absolute left-1/2 -top-1 transform -translate-x-1/2 w-2 h-2 bg-white dark:bg-gray-800 rounded-full border border-yellow-600 dark:border-yellow-300"></div>
            <div className="absolute left-1/2 -bottom-1 transform -translate-x-1/2 w-2 h-2 bg-white dark:bg-gray-800 rounded-full border border-yellow-600 dark:border-yellow-300"></div>

            <span className="text-xs font-bold text-yellow-900 dark:text-yellow-100 tracking-wider">BETA</span>
          </div>

          {/* Sombra */}
          <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-full h-1 bg-black/20 dark:bg-black/40 blur-sm rounded-full"></div>
        </div>
      </div>
    </div>
  )
}

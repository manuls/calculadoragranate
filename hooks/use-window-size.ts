"use client"

import { useState, useEffect } from "react"

interface WindowSize {
  width: number | undefined
  height: number | undefined
  isMobile: boolean
}

export function useWindowSize(): WindowSize {
  // Inicializar con undefined para evitar errores de hidratación
  const [windowSize, setWindowSize] = useState<WindowSize>({
    width: undefined,
    height: undefined,
    isMobile: false,
  })

  useEffect(() => {
    // Solo ejecutar en el cliente
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
        isMobile: window.innerWidth < 640,
      })
    }

    // Añadir event listener
    window.addEventListener("resize", handleResize)

    // Llamar al handler inmediatamente para establecer el tamaño inicial
    handleResize()

    // Limpiar event listener al desmontar
    return () => window.removeEventListener("resize", handleResize)
  }, []) // Array vacío significa que este efecto se ejecuta solo una vez al montar

  return windowSize
}

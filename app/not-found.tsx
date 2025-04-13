"use client"

import Link from "next/link"
import { ThemeProvider } from "@/components/theme-provider"

export default function NotFound() {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground p-4">
        <div className="text-center">
          <h1 className="text-9xl font-bold tracking-wider text-primary pixel-font">404</h1>
          <div className="mt-4 text-xl">
            <p className="mb-4">¡Ups! Parece que este partido no existe.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
              <Link
                href="/"
                className="px-6 py-3 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
              >
                Volver al inicio
              </Link>
              <a
                href="http://pontevedracf.net"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/90 transition-colors"
              >
                Visitar PontevedraCF.Net
              </a>
            </div>
          </div>
        </div>

        <div className="mt-16 pixel-art-container">
          <div className="pixel-art-scene">
            <div className="football-field">
              <div className="field-line center-circle"></div>
              <div className="field-line center-line"></div>
              <div className="field-line penalty-area left"></div>
              <div className="field-line penalty-area right"></div>
              <div className="field-line goal-area left"></div>
              <div className="field-line goal-area right"></div>
              <div className="goal left"></div>
              <div className="goal right"></div>
              <div className="corner-flag top-left"></div>
              <div className="corner-flag top-right"></div>
              <div className="corner-flag bottom-left"></div>
              <div className="corner-flag bottom-right"></div>
            </div>

            <div className="player player-1">
              <div className="player-head"></div>
              <div className="player-body"></div>
              <div className="player-legs"></div>
              <div className="player-shadow"></div>
            </div>

            <div className="player player-2">
              <div className="player-head"></div>
              <div className="player-body"></div>
              <div className="player-legs"></div>
              <div className="player-shadow"></div>
            </div>

            <div className="ball">
              <div className="ball-shadow"></div>
            </div>

            <div className="referee">
              <div className="referee-head"></div>
              <div className="referee-body"></div>
              <div className="referee-legs"></div>
              <div className="referee-card"></div>
            </div>

            <div className="message-box">
              <div className="message-text">PARTIDO NO ENCONTRADO</div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .pixel-font {
          font-family: 'Press Start 2P', 'Courier New', monospace;
          text-shadow: 4px 4px 0px rgba(0, 0, 0, 0.2);
          letter-spacing: -0.05em;
        }
        
        .pixel-art-container {
          width: 320px;
          height: 240px;
          margin: 20px auto;
          position: relative;
          overflow: hidden;
          image-rendering: pixelated;
          border: 4px solid hsl(var(--primary));
          border-radius: 4px;
          box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
        }
        
        .pixel-art-scene {
          width: 100%;
          height: 100%;
          position: relative;
          background-color: #4a8;
          overflow: hidden;
        }
        
        .football-field {
          width: 100%;
          height: 100%;
          position: absolute;
          background: repeating-linear-gradient(
            90deg,
            #4a8,
            #4a8 20px,
            #3a7 20px,
            #3a7 40px
          );
        }
        
        .field-line {
          position: absolute;
          background-color: rgba(255, 255, 255, 0.7);
        }
        
        .center-line {
          width: 2px;
          height: 100%;
          left: 50%;
          transform: translateX(-50%);
        }
        
        .center-circle {
          width: 60px;
          height: 60px;
          border: 2px solid rgba(255, 255, 255, 0.7);
          border-radius: 50%;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
          background-color: transparent;
        }
        
        .penalty-area {
          height: 80px;
          width: 40px;
          border: 2px solid rgba(255, 255, 255, 0.7);
          background-color: transparent;
          top: 50%;
          transform: translateY(-50%);
        }
        
        .penalty-area.left {
          left: 0;
          border-left: none;
        }
        
        .penalty-area.right {
          right: 0;
          border-right: none;
        }
        
        .goal-area {
          height: 40px;
          width: 20px;
          border: 2px solid rgba(255, 255, 255, 0.7);
          background-color: transparent;
          top: 50%;
          transform: translateY(-50%);
        }
        
        .goal-area.left {
          left: 0;
          border-left: none;
        }
        
        .goal-area.right {
          right: 0;
          border-right: none;
        }
        
        .goal {
          position: absolute;
          width: 8px;
          height: 50px;
          background-color: white;
          top: 50%;
          transform: translateY(-50%);
        }
        
        .goal.left {
          left: -4px;
          border-top-right-radius: 4px;
          border-bottom-right-radius: 4px;
        }
        
        .goal.right {
          right: -4px;
          border-top-left-radius: 4px;
          border-bottom-left-radius: 4px;
        }
        
        .corner-flag {
          position: absolute;
          width: 6px;
          height: 6px;
          background-color: transparent;
          border-radius: 50%;
          border: 2px solid rgba(255, 255, 255, 0.7);
        }
        
        .corner-flag.top-left {
          top: 0;
          left: 0;
          border-top: none;
          border-left: none;
        }
        
        .corner-flag.top-right {
          top: 0;
          right: 0;
          border-top: none;
          border-right: none;
        }
        
        .corner-flag.bottom-left {
          bottom: 0;
          left: 0;
          border-bottom: none;
          border-left: none;
        }
        
        .corner-flag.bottom-right {
          bottom: 0;
          right: 0;
          border-bottom: none;
          border-right: none;
        }
        
        .player {
          position: absolute;
          width: 20px;
          height: 30px;
        }
        
        .player-1 {
          left: 30%;
          top: 40%;
          animation: player1-move 4s infinite;
        }
        
        .player-2 {
          right: 30%;
          top: 60%;
          animation: player2-move 4s infinite;
        }
        
        .player-head {
          position: absolute;
          width: 10px;
          height: 10px;
          background-color: #ffd;
          border-radius: 50%;
          top: 0;
          left: 50%;
          transform: translateX(-50%);
        }
        
        .player-body {
          position: absolute;
          width: 14px;
          height: 12px;
          background-color: hsl(var(--primary));
          top: 10px;
          left: 50%;
          transform: translateX(-50%);
        }
        
        .player-legs {
          position: absolute;
          width: 10px;
          height: 8px;
          background-color: #333;
          top: 22px;
          left: 50%;
          transform: translateX(-50%);
        }
        
        .player-shadow {
          position: absolute;
          width: 16px;
          height: 6px;
          background-color: rgba(0, 0, 0, 0.3);
          border-radius: 50%;
          bottom: -4px;
          left: 50%;
          transform: translateX(-50%);
        }
        
        .ball {
          position: absolute;
          width: 8px;
          height: 8px;
          background-color: white;
          border-radius: 50%;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          animation: ball-move 4s infinite;
          z-index: 10;
        }
        
        .ball-shadow {
          position: absolute;
          width: 10px;
          height: 4px;
          background-color: rgba(0, 0, 0, 0.3);
          border-radius: 50%;
          bottom: -4px;
          left: 50%;
          transform: translateX(-50%);
        }
        
        .referee {
          position: absolute;
          width: 20px;
          height: 30px;
          top: 70%;
          left: 70%;
          animation: referee-move 5s infinite;
        }
        
        .referee-head {
          position: absolute;
          width: 8px;
          height: 8px;
          background-color: #ffd;
          border-radius: 50%;
          top: 0;
          left: 50%;
          transform: translateX(-50%);
        }
        
        .referee-body {
          position: absolute;
          width: 12px;
          height: 12px;
          background-color: black;
          top: 8px;
          left: 50%;
          transform: translateX(-50%);
        }
        
        .referee-legs {
          position: absolute;
          width: 8px;
          height: 8px;
          background-color: #333;
          top: 20px;
          left: 50%;
          transform: translateX(-50%);
        }
        
        .referee-card {
          position: absolute;
          width: 6px;
          height: 8px;
          background-color: red;
          top: 8px;
          right: -4px;
          animation: card-wave 1s infinite;
          transform-origin: bottom center;
        }
        
        .message-box {
          position: absolute;
          width: 200px;
          height: 40px;
          background-color: white;
          border: 4px solid black;
          top: 20px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          align-items: center;
          justify-content: center;
          animation: message-blink 2s infinite;
        }
        
        .message-text {
          font-family: 'Press Start 2P', monospace;
          font-size: 8px;
          color: black;
          text-align: center;
          padding: 4px;
        }
        
        @keyframes player1-move {
          0%, 100% { transform: translate(0, 0); }
          25% { transform: translate(10px, -5px); }
          50% { transform: translate(20px, 0); }
          75% { transform: translate(10px, 5px); }
        }
        
        @keyframes player2-move {
          0%, 100% { transform: translate(0, 0); }
          25% { transform: translate(-10px, 5px); }
          50% { transform: translate(-20px, 0); }
          75% { transform: translate(-10px, -5px); }
        }
        
        @keyframes ball-move {
          0%, 100% { transform: translate(-50%, -50%) scale(1); }
          25% { transform: translate(-30%, -60%) scale(1.1); }
          50% { transform: translate(30%, -50%) scale(1); }
          75% { transform: translate(0%, -40%) scale(0.9); }
        }
        
        @keyframes referee-move {
          0%, 100% { transform: translate(0, 0); }
          30% { transform: translate(-20px, -10px); }
          60% { transform: translate(-40px, 0); }
          80% { transform: translate(-20px, 10px); }
        }
        
        @keyframes card-wave {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(15deg); }
        }
        
        @keyframes message-blink {
          0%, 49%, 100% { opacity: 1; }
          50%, 99% { opacity: 0.8; }
        }
      `}</style>
    </ThemeProvider>
  )
}

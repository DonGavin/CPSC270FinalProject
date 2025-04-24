import { Chess, Square } from "chess.js";
import { Platform } from "react-native";
import { Asset } from "expo-asset";

export class StockfishService {
  private stockfish: Worker | null = null;
  private isReady = false;
  private callbacks: {
    onMessage?: (message: string) => void;
    onReady?: () => void;
    onBestMove?: (move: string) => void;
    onEvaluation?: (evaluation: number | string) => void;
  } = {};
  private chess: Chess;

  constructor() {
    this.chess = new Chess();
    this.init();
  }

  async init() {
    try {
      if (Platform.OS === "web") {
        // Web: Create a proxy worker that loads the CDN script
        const workerCode = `
          try {
            importScripts('https://cdn.jsdelivr.net/npm/stockfish.js@10.0.2/stockfish.js');
            self.postMessage('Worker ready');
          } catch(e) {
            self.postMessage('Worker error: ' + e.message);
          }
        `;
        const blob = new Blob([workerCode], { type: "application/javascript" });
        this.stockfish = new Worker(URL.createObjectURL(blob));
      } else {
        // Mobile: Same approach works for native
        const workerCode = `
          importScripts('https://cdn.jsdelivr.net/npm/stockfish.js@10.0.2/stockfish.js');
          self.postMessage('Worker ready');
        `;
        const blob = new Blob([workerCode], { type: "application/javascript" });
        this.stockfish = new Worker(URL.createObjectURL(blob));
      }

      this.stockfish.onmessage = (event) => {
        const message = event.data;
        console.log("Stockfish message:", message);

        if (this.callbacks.onMessage) {
          this.callbacks.onMessage(message);
        }

        if (message === "readyok") {
          this.isReady = true;
          if (this.callbacks.onReady) {
            this.callbacks.onReady();
          }
        }

        if (message.includes("score cp")) {
          const match = message.match(/score cp (-?\d+)/);
          if (match && this.callbacks.onEvaluation) {
            const score = parseInt(match[1], 10) / 100;
            this.callbacks.onEvaluation(score);
          }
        }

        if (message.includes("score mate")) {
          const match = message.match(/score mate (-?\d+)/);
          if (match && this.callbacks.onEvaluation) {
            const mateIn = parseInt(match[1], 10);
            this.callbacks.onEvaluation(`Mate in ${Math.abs(mateIn)}`);
          }
        }

        if (message.startsWith("bestmove")) {
          const match = message.match(/bestmove (\w+)/);
          if (match && this.callbacks.onBestMove) {
            this.callbacks.onBestMove(match[1]);
          }
        }
      };

      this.stockfish.postMessage("uci");
      this.stockfish.postMessage("isready");
    } catch (error) {
      console.error("Failed to initialize Stockfish:", error);
    }
  }

  onReady(callback: () => void) {
    this.callbacks.onReady = callback;
    if (this.isReady) {
      callback();
    }
  }

  onMessage(callback: (message: string) => void) {
    this.callbacks.onMessage = callback;
  }

  onBestMove(callback: (move: string) => void) {
    this.callbacks.onBestMove = callback;
  }

  onEvaluation(callback: (evaluation: number | string) => void) {
    this.callbacks.onEvaluation = callback;
  }

  boardStateToFEN(
    boardState: { [key: number]: string | null },
    isWhiteTurn: boolean = true,
  ): string {
    this.chess.reset();
    this.chess.clear();

    for (let i = 0; i < 64; i++) {
      const piece = boardState[i];
      if (piece) {
        const row = Math.floor(i / 8);
        const col = i % 8;
        const square = String.fromCharCode(97 + col) + (8 - row);

        const color = piece[0] === "W" ? "w" : "b";
        let pieceType = piece.slice(1).toLowerCase();

        switch (pieceType) {
          case "pawn":
            pieceType = "p";
            break;
          case "rook":
            pieceType = "r";
            break;
          case "knight":
            pieceType = "n";
            break;
          case "bishop":
            pieceType = "b";
            break;
          case "queen":
            pieceType = "q";
            break;
          case "king":
            pieceType = "k";
            break;
        }

        this.chess.put({ type: pieceType as any, color }, square as Square);
      }
    }

    const fen = this.chess.fen();
    const parts = fen.split(" ");
    parts[1] = isWhiteTurn ? "w" : "b";
    return parts.join(" ");
  }

  analyzePosition(
    boardState: { [key: number]: string | null },
    depth = 15,
    isWhiteTurn = true,
  ) {
    if (!this.stockfish || !this.isReady) {
      console.error("Stockfish is not ready");
      return;
    }

    const fen = this.boardStateToFEN(boardState, isWhiteTurn);
    console.log("Analyzing FEN:", fen);
    this.stockfish.postMessage(`position fen ${fen}`);
    this.stockfish.postMessage(`go depth ${depth}`);
  }

  getBestMove(
    boardState: { [key: number]: string | null },
    depth = 15,
    isWhiteTurn = true,
  ) {
    this.analyzePosition(boardState, depth, isWhiteTurn);
  }

  stopAnalysis() {
    if (this.stockfish) {
      this.stockfish.postMessage("stop");
    }
  }

  setOption(name: string, value: string | number) {
    if (this.stockfish) {
      this.stockfish.postMessage(`setoption name ${name} value ${value}`);
    }
  }

  terminate() {
    if (this.stockfish) {
      this.stockfish.terminate();
      this.stockfish = null;
      this.isReady = false;
    }
  }

  algebraicToPosition(algebraic: string): number {
    const col = algebraic.charCodeAt(0) - 97;
    const row = 8 - parseInt(algebraic[1], 10);
    return row * 8 + col;
  }

  positionToAlgebraic(position: number): string {
    const row = Math.floor(position / 8);
    const col = position % 8;
    return String.fromCharCode(97 + col) + (8 - row);
  }

  uciMoveToPositions(uciMove: string): { source: number; target: number } {
    const source = this.algebraicToPosition(uciMove.substring(0, 2));
    const target = this.algebraicToPosition(uciMove.substring(2, 4));
    return { source, target };
  }
}

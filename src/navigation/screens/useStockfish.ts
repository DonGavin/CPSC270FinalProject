import { useState, useEffect, useRef } from "react";
import { StockfishService } from "../../../StockfishService";

export function useStockfish() {
  const [isReady, setIsReady] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [evaluation, setEvaluation] = useState<number | string | null>(null);
  const [bestMove, setBestMove] = useState<string | null>(null);
  const [bestMovePositions, setBestMovePositions] = useState<{
    source: number;
    target: number;
  } | null>(null);
  const [moveHistory, setMoveHistory] = useState<
    Array<{ from: number; to: number; piece: string; fen: string }>
  >([]);
  const stockfishRef = useRef<StockfishService | null>(null);

  useEffect(() => {
    const stockfish = new StockfishService();
    stockfishRef.current = stockfish;

    stockfish.onReady(() => {
      setIsReady(true);
      console.log("Stockfish initialized successfully");
    });

    stockfish.onMessage((message) => {
      console.log("Stockfish message:", message);
    });

    stockfish.onEvaluation((evaluationResult) => {
      setEvaluation(evaluationResult);
      console.log("Evaluation:", evaluationResult);
    });

    stockfish.onBestMove((move) => {
      setBestMove(move);
      const positions = stockfish.uciMoveToPositions(move);
      setBestMovePositions(positions);
      setIsThinking(false);
      console.log("Best move:", move, "Positions:", positions);
    });

    return () => {
      stockfish.terminate();
      console.log("Stockfish terminated");
    };
  }, []);

  const analyzePosition = (
    boardState: { [key: number]: string | null },
    depth = 15,
    isWhiteTurn = true,
  ) => {
    if (stockfishRef.current && isReady) {
      setIsThinking(true);
      setBestMove(null);
      setBestMovePositions(null);
      stockfishRef.current.analyzePosition(boardState, depth, isWhiteTurn);
    } else {
      console.error("Cannot analyze: Stockfish not ready");
    }
  };

  const getBestMove = (
    boardState: { [key: number]: string | null },
    depth = 15,
    isWhiteTurn = true,
  ) => {
    if (stockfishRef.current && isReady) {
      setIsThinking(true);
      stockfishRef.current.getBestMove(boardState, depth, isWhiteTurn);
    } else {
      console.error("Cannot get best move: Stockfish not ready");
    }
  };

  const stopAnalysis = () => {
    if (stockfishRef.current) {
      stockfishRef.current.stopAnalysis();
      setIsThinking(false);
    }
  };

  const setOption = (name: string, value: string | number) => {
    if (stockfishRef.current) {
      stockfishRef.current.setOption(name, value);
      console.log(`Set option ${name} to ${value}`);
    }
  };

  const recordMove = (
    source: number,
    target: number,
    piece: string,
    boardState: { [key: number]: string | null },
    isWhiteTurn: boolean = true,
  ) => {
    if (stockfishRef.current) {
      const fen = stockfishRef.current.boardStateToFEN(boardState, isWhiteTurn);
      setMoveHistory((prev) => [
        ...prev,
        { from: source, to: target, piece, fen },
      ]);
      console.log("Move recorded:", { from: source, to: target, piece, fen });
    }
  };

  return {
    isReady,
    isThinking,
    evaluation,
    bestMove,
    bestMovePositions,
    moveHistory,
    analyzePosition,
    getBestMove,
    stopAnalysis,
    setOption,
    recordMove,
  };
}

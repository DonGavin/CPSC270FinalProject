import { useState, useEffect } from "react";
import { ImageBackground } from "react-native";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useStockfish } from "./useStockfish";
import { Chess } from "chess.js";
import Chess_Background from "../../assets/Chess_Background.png";
import { TouchBackend } from 'react-dnd-touch-backend';
import { MultiBackend, TouchTransition, createTransition } from 'react-dnd-multi-backend';


const ItemTypes = {
  CHESS_PIECE: "chess_piece",
};

const HTML5toTouch = {
  backends: [
    {
      backend: HTML5Backend,
      transition: createTransition('dragPreview', 0),
    },
    {
      backend: TouchBackend,
      options: { enableMouseEvents: true },
      transition: TouchTransition,
    },
  ],
}

function ChessPiece({
  piece,
  position,
}: {
  piece: string;
  position: number;
  onRemove: (position: number) => void;
}) {
  const [{ isDragging }, drag] = useDrag(
    () => ({
      type: ItemTypes.CHESS_PIECE,
      item: { piece, sourcePosition: position },
      collect: (monitor) => ({
        isDragging: !!monitor.isDragging(),
      }),
    }),
    [piece, position],
  );

  return (
    <div
      ref={drag}
      style={{
        opacity: isDragging ? 0.5 : 1,
        cursor: "grab",
        padding: "0.25rem", 
        margin: "0.1rem", 
        backgroundColor: piece[0] === "W" ? "white" : "black",
        color: piece[0] === "W" ? "black" : "white",
        border: "1px solid black",
        width: "70%", 
        maxWidth: "70%", 
        textAlign: "center",
        fontSize: "clamp(0.5rem, 2vw, 0.8rem)",
      }}
    >
      {piece}
    </div>
  );
}

function BoardSquare({
  position,
  piece,
  onDrop,
  onRemove,
}: {
  position: number;
  piece: string | null;
  onDrop: (
    piece: string,
    targetPosition: number,
    sourcePosition: number,
  ) => void;
  onRemove: (position: number) => void;
}) {
  const [{ isOver }, drop] = useDrop(
    () => ({
      accept: ItemTypes.CHESS_PIECE,
      drop: (item: { piece: string; sourcePosition: number }) => {
        onDrop(item.piece, position, item.sourcePosition);
        return { position };
      },
      collect: (monitor) => ({
        isOver: !!monitor.isOver(),
      }),
    }),
    [position, onDrop],
  );

  return (
    <div
      ref={drop}
      style={{
        aspectRatio: "1/1",
        border: "1px solid black",
        backgroundColor: isOver
          ? "lightgreen"
          : (Math.floor(position / 8) + (position % 8)) % 2 === 0
            ? "darkGray"
            : "gray",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        padding: "0", 
        boxSizing: "border-box", 
      }}
    >
      {piece && (
        <ChessPiece piece={piece} position={position} onRemove={onRemove} />
      )}
    </div>
  );
}

export function Home() {
  const {
    isReady,
    isThinking,
    evaluation,
    bestMove,
    bestMovePositions,
    moveHistory,
    analyzePosition,
    setOption,
    recordMove,
  } = useStockfish();

  const [isWhiteTurn, setIsWhiteTurn] = useState(true);
  const [boardState, setBoardState] = useState<{
    [key: number]: string | null;
  }>({
    0: "BRook",
    1: "BKnight",
    2: "BBishop",
    3: "BQueen",
    4: "BKing",
    5: "BBishop",
    6: "BKnight",
    7: "BRook",
    8: "BPawn",
    9: "BPawn",
    10: "BPawn",
    11: "BPawn",
    12: "BPawn",
    13: "BPawn",
    14: "BPawn",
    15: "BPawn",
    16: null,
    17: null,
    18: null,
    19: null,
    20: null,
    21: null,
    22: null,
    23: null,
    24: null,
    25: null,
    26: null,
    27: null,
    28: null,
    29: null,
    30: null,
    31: null,
    32: null,
    33: null,
    34: null,
    35: null,
    36: null,
    37: null,
    38: null,
    39: null,
    40: null,
    41: null,
    42: null,
    43: null,
    44: null,
    45: null,
    46: null,
    47: null,
    48: "WPawn",
    49: "WPawn",
    50: "WPawn",
    51: "WPawn",
    52: "WPawn",
    53: "WPawn",
    54: "WPawn",
    55: "WPawn",
    56: "WRook",
    57: "WKnight",
    58: "WBishop",
    59: "WQueen",
    60: "WKing",
    61: "WBishop",
    62: "WKnight",
    63: "WRook",
  });

  const chess = new Chess();

  useEffect(() => {
    // This is where we could configure stockfish options
    if (isReady) {
      setOption("Skill Level", 10); // Adjust for User difficulty (0-20) if have time
      console.log("Stockfish isReady:", isReady, "isThinking:", isThinking);
      analyzePosition(boardState, 15, isWhiteTurn);
    }
  }, [isReady, boardState, isWhiteTurn, analyzePosition, setOption]);

  useEffect(() => {
    console.log("Best Move:", bestMove, "Positions:", bestMovePositions);
    if (!isWhiteTurn && isReady && bestMovePositions && !isThinking) {
      makeCPUMove();
    }
  }, [bestMovePositions, isWhiteTurn, isReady, isThinking]);

  function positionToAlgebraic(position: number): string {
    const row = Math.floor(position / 8);
    const col = position % 8;
    return String.fromCharCode(97 + col) + (8 - row);
  }

  function isValidMove(
    piece: string,
    sourcePosition: number,
    targetPosition: number,
  ): boolean {
    chess.clear();
    for (let i = 0; i < 64; i++) {
      const p = boardState[i];
      if (p) {
        const row = Math.floor(i / 8);
        const col = i % 8;
        const square = String.fromCharCode(97 + col) + (8 - row);
        const color = p[0] === "W" ? "w" : "b";
        let pieceType = p.slice(1).toLowerCase();
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
        chess.put({ type: pieceType as any, color }, square as any);
      }
    }

    const from = positionToAlgebraic(sourcePosition);
    const to = positionToAlgebraic(targetPosition);
    try {
      const move = chess.move({ from, to, promotion: "q" });
      return !!move;
    } catch (e) {
      console.log("Invalid move:", from, "to", to, "Error:", e);
      return false;
    }
  }

  const handleDrop = (
    piece: string,
    targetPosition: number,
    sourcePosition: number,
  ) => {
    if (!isWhiteTurn || !isValidMove(piece, sourcePosition, targetPosition)) {
      console.error("Invalid move from", sourcePosition, "to", targetPosition);
      return;
    }

    setBoardState((prev) => {
      const newState = { ...prev };
      newState[sourcePosition] = null;
      if (piece === "WPawn" && Math.floor(targetPosition / 8) === 0) {
        newState[targetPosition] = "WQueen";
      } else {
        newState[targetPosition] = piece;
      }
      return newState;
    });
    setBoardState((updatedState) => {
      recordMove(sourcePosition, targetPosition, piece, updatedState, false);
      setIsWhiteTurn(false);
      return updatedState;
    });
  };

  const handleRemove = (position: number) => {
    setBoardState((prev) => ({
      ...prev,
      [position]: null,
    }));
  };

  const makeCPUMove = () => {
    if (!isWhiteTurn && isReady && bestMovePositions && !isThinking) {
      const { source, target } = bestMovePositions;
      const piece = boardState[source];
      if (piece) {
        setBoardState((prev) => {
          const newState = { ...prev };
          newState[source] = null;
          if (piece === "BPawn" && Math.floor(target / 8) === 0) {
            newState[target] = "BQueen";
            recordMove(source, target, "BQueen", newState, true);
          } else {
            newState[target] = piece;
            recordMove(source, target, piece, newState, true);
          }
          setIsWhiteTurn(true);
          return newState;
        });
      }
    }
  };

  const render = () => {
    const squares = [];
    for (let i = 0; i < 64; i++) {
      squares.push(
        <BoardSquare
          key={i}
          position={i}
          piece={boardState[i]}
          onDrop={handleDrop}
          onRemove={handleRemove}
        />,
      );
    }
    return squares;
  };

 
return (
  <DndProvider backend={MultiBackend} options={HTML5toTouch}>
    <ImageBackground source={Chess_Background}>
    <div
  className="main-container"
  style={{
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
    width: "100%",
    height: "100vh",
    padding: "2vh 0.5rem", 
    boxSizing: "border-box",
    position: "relative",
    overflowY: "auto",
  }}
      >
        
        <div
    className="board-container"
    style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      width: "min(450px, 80vw)", 
      aspectRatio: "1 / 1",
      position: "relative",
      marginTop: "1rem", 
    }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(8, 1fr)",
              gridTemplateRows: "repeat(8, 1fr)",
              width: "100%",
              height: "100%",
            }}
          >
            {render()}
          </div>
        </div>

        <div
          className="move-history"
          style={{
            width: "min(300px, 85vw)",
            color: "black",
            backgroundColor: "grey",
            overflowY: "auto",
            borderRadius: "4px",
            padding: "0.5rem",
            fontSize: "clamp(0.8rem, 2vw, 1rem)",
            marginTop: "1rem", 
            maxHeight: "30vh",
          }}
        >
          <h3 style={{ fontSize: "clamp(1rem, 2.5vw, 1.5rem)" }}>Move History</h3>
          {moveHistory.map((move, index) => (
            <div key={index}>
              {`${move.piece}: ${positionToAlgebraic(move.from)} → ${positionToAlgebraic(move.to)}`}
            </div>
          ))}
        </div>

        <style>
  {`
    @media (max-width: 768px) {
      .main-container {
        padding: 0.5rem !important;
        height: auto !important;
        min-height: 100vh !important;
      }
      
      .board-container {
        width: 75vw !important; // Reduced from 85vw
        margin: 0.5rem auto !important;
      }
      
      .move-history {
        width: 75vw !important; // Reduced from 85vw
        margin: 0.5rem auto !important;
        position: relative !important;
        font-size: 0.8rem !important;
      }
    }

    @media (max-width: 480px) {
      .board-container {
        width: 95vw !important;
      }
      
      .move-history {
        width: 95vw !important;
      }
    }
  `}
</style>
      </div>
    </ImageBackground>
  </DndProvider>
);
}

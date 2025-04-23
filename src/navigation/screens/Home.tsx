import { useState, useEffect } from 'react';
import {ImageBackground} from 'react-native';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useStockfish } from './useStockfish';
import { Chess } from 'chess.js';
import Chess_Background from '../../assets/Chess_Background.png';

const ItemTypes = {
  CHESS_PIECE: 'chess_piece',
};

function ChessPiece({
  piece,
  position,
  onRemove,
}: {
  piece: string;
  position: number;
  onRemove: (position: number) => void;
}) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.CHESS_PIECE,
    item: { piece, sourcePosition: position },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }), [piece, position]);

  return (
    <div
      ref={drag}
      style={{
        opacity: isDragging ? 0.5 : 1,
        cursor: 'grab',
        padding: '0.5rem',
        margin: '0.25rem',
        backgroundColor: piece[0] === 'W' ? 'white' : 'black',
        color: piece[0] === 'W' ? 'black' : 'white',
        border: '1px solid black',
        width: '80%',
        maxWidth: '80%',
        textAlign: 'center',
        fontSize: 'min(1rem, 3vw)',
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
  onDrop: (piece: string, targetPosition: number, sourcePosition: number) => void;
  onRemove: (position: number) => void;
}) {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: ItemTypes.CHESS_PIECE,
    drop: (item: { piece: string; sourcePosition: number }) => {
      onDrop(item.piece, position, item.sourcePosition);
      return { position };
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }), [position, onDrop]);

  return (
    <div
      ref={drop}
      style={{
        aspectRatio: '1/1',
        border: '1px solid black',
        backgroundColor: isOver ? 'lightgreen' : (Math.floor(position / 8) + (position % 8)) % 2 === 0 ? 'darkGray' : 'gray',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
      }}
    >
      {piece && (
        <ChessPiece
          piece={piece}
          position={position}
          onRemove={onRemove}
        />
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
    getBestMove,
    stopAnalysis,
    setOption,
    recordMove,
  } = useStockfish();

  const [isWhiteTurn, setIsWhiteTurn] = useState(true);
  const [boardState, setBoardState] = useState<{ [key: number]: string | null }>({
    0: 'BRook',
    1: 'BKnight',
    2: 'BBishop',
    3: 'BQueen',
    4: 'BKing',
    5: 'BBishop',
    6: 'BKnight',
    7: 'BRook',
    8: 'BPawn',
    9: 'BPawn',
    10: 'BPawn',
    11: 'BPawn',
    12: 'BPawn',
    13: 'BPawn',
    14: 'BPawn',
    15: 'BPawn',
    16: null, 17: null, 18: null, 19: null, 20: null,
    21: null, 22: null, 23: null, 24: null, 25: null,
    26: null, 27: null, 28: null, 29: null, 30: null,
    31: null, 32: null, 33: null, 34: null, 35: null,
    36: null, 37: null, 38: null, 39: null, 40: null,
    41: null, 42: null, 43: null, 44: null, 45: null,
    46: null, 47: null,
    48: 'WPawn',
    49: 'WPawn',
    50: 'WPawn',
    51: 'WPawn',
    52: 'WPawn',
    53: 'WPawn',
    54: 'WPawn',
    55: 'WPawn',
    56: 'WRook',
    57: 'WKnight',
    58: 'WBishop',
    59: 'WQueen',
    60: 'WKing',
    61: 'WBishop',
    62: 'WKnight',
    63: 'WRook',
  });

  const chess = new Chess();

  useEffect(() => {
    // This is where we could configure stockfish options
    if (isReady) {
      setOption('Skill Level', 10); // Adjust for User difficulty (0-20) if have time
      console.log('Stockfish isReady:', isReady, 'isThinking:', isThinking);
      analyzePosition(boardState, 15, isWhiteTurn);
    }
  }, [isReady, boardState, isWhiteTurn, analyzePosition, setOption]);

  useEffect(() => {
    console.log('Best Move:', bestMove, 'Positions:', bestMovePositions);
    if (!isWhiteTurn && isReady && bestMovePositions && !isThinking) {
      makeCPUMove();
    }
  }, [bestMovePositions, isWhiteTurn, isReady, isThinking]);

  function positionToAlgebraic(position: number): string {
    const row = Math.floor(position / 8);
    const col = position % 8;
    return String.fromCharCode(97 + col) + (8 - row);
  }

  function isValidMove(piece: string, sourcePosition: number, targetPosition: number): boolean {
    chess.clear();
    for (let i = 0; i < 64; i++) {
      const p = boardState[i];
      if (p) {
        const row = Math.floor(i / 8);
        const col = i % 8;
        const square = String.fromCharCode(97 + col) + (8 - row);
        const color = p[0] === 'W' ? 'w' : 'b';
        let pieceType = p.slice(1).toLowerCase();
        switch (pieceType) {
          case 'pawn':
            pieceType = 'p';
            break;
          case 'rook':
            pieceType = 'r';
            break;
          case 'knight':
            pieceType = 'n';
            break;
          case 'bishop':
            pieceType = 'b';
            break;
          case 'queen':
            pieceType = 'q';
            break;
          case 'king':
            pieceType = 'k';
            break;
        }
        chess.put({ type: pieceType as any, color }, square as any);
      }
    }

    const from = positionToAlgebraic(sourcePosition);
    const to = positionToAlgebraic(targetPosition);
    try {
      const move = chess.move({ from, to, promotion: 'q' });
      return !!move;
    } catch (e) {
      console.log('Invalid move:', from, 'to', to, 'Error:', e);
      return false;
    }
  }

  const handleDrop = (piece: string, targetPosition: number, sourcePosition: number) => {
    if (!isWhiteTurn || !isValidMove(piece, sourcePosition, targetPosition)) {
      console.error('Invalid move from', sourcePosition, 'to', targetPosition);
      return;
    }

    setBoardState((prev) => {
      const newState = { ...prev };
      newState[sourcePosition] = null;
      if (piece === 'WPawn' && Math.floor(targetPosition / 8) === 0) {
        newState[targetPosition] = 'WQueen';
        recordMove(sourcePosition, targetPosition, 'WQueen', newState, false);
      } else {
        newState[targetPosition] = piece;
        recordMove(sourcePosition, targetPosition, piece, newState, false);
      }
      setIsWhiteTurn(false);
      return newState;
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
          if (piece === 'BPawn' && Math.floor(target / 8) === 0) {
            newState[target] = 'BQueen';
            recordMove(source, target, 'BQueen', newState, true);
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
        />
      );
    }
    return squares;
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <ImageBackground source={Chess_Background}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
          height: '100vh',
        }}
      >
        <div
          style={{
            border: '2px solid #333',
          }}
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(8, 1fr)',
              gridTemplateRows: 'repeat(8, 1fr)',
              width: '90vw',
              maxWidth: '500px',
              aspectRatio: '1/1',
            }}
          >
            {render()}
          </div>
          <div style={{ position: 'absolute', top: 10, left: 10, color: 'black' }}>
            {isThinking ? 'Thinking...' : `Evaluation: ${evaluation || 'N/A'}`}
          </div>
          <div style={{ position: 'fixed', right: 10, top: 10, maxWidth: 200, color: 'black', backgroundColor: 'grey', overflowY: 'auto', borderRadius: 4, padding: 8}}>
            <h3>Move History</h3>
            {moveHistory.map((move, index) => (
              <div key={index}>{`${move.piece}: ${positionToAlgebraic(move.from)} → ${positionToAlgebraic(move.to)}`}</div>
            ))}
          </div>
        </div>
      </div>
      </ImageBackground>
    </DndProvider>
  );
}
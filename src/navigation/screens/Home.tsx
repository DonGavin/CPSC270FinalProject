import React, { useState } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

const ItemTypes = {
  CHESS_PIECE: 'chess_piece',
};

function ChessPiece({
  piece,
  position, 
  onRemove
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
  }),[piece, position]); // added position to dependency to make sure drag works correctly

  return (
    <div
      ref={drag}
      style={{
        opacity: isDragging ? 0.5 : 1,
        cursor: 'grab',
        padding: '0.5rem',
        margin: '0.25rem',
        backgroundColor: piece[0] === 'W' ? 'white': 'black',
        color: piece[0] === 'W' ? 'black': 'white',
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
  const [{ isOver}, drop] = useDrop(() => ({
    accept: ItemTypes.CHESS_PIECE,
    drop: (item: { piece: string; sourcePosition: number}) => {
      onDrop(item.piece, position, item.sourcePosition);
      return {position}; // return position to be used in future chess tracking 
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }), [position, onDrop]); // added position to dependency to make sure drop works correctly

  return (
    <div
      ref={drop}
      style={{
        aspectRatio: '1/1',
        border: '1px solid black',
        backgroundColor: isOver ? 'lightgreen' : (Math.floor(position/8)+(position%8))%2 === 0  ? 'darkGray' : 'gray',
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
// Home will be the displayed board 
export function Home() {
  const [boardState, setBoardState] = useState<{ [key: number]: string | null}>({
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
    16: null, 17: null, 18: null, 19: null, 20: null, 
    21: null, 22: null, 23: null, 24: null, 25: null, 
    26: null, 27: null, 28: null, 29: null, 30: null, 
    31: null, 32: null, 33: null, 34: null, 35: null,
    36: null, 37: null, 38: null, 39: null, 40: null,
    41: null, 42: null, 43: null, 44: null, 45: null,
    46: null, 47: null,
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
  // Drop zones with array's that store the widgets dropped in them (Data for future Ai responses (stock fish and GPT))

  const [algebraicMove, setAlgebraicMove] = useState<string>(""); // Input for algebraic moves
  const [chatGPTResponse, setChatGPTResponse] = useState<string>(""); // ChatGPT response

  // Convert board position to algebraic notation (e.g., 0 -> "a8", 63 -> "h1")
  const positionToAlgebraic = (position: number): string => {
    const file = String.fromCharCode(97 + (position % 8)); // 'a' to 'h'
    const rank = 8 - Math.floor(position / 8); // 8 to 1
    return `${file}${rank}`;
  };

  // Handle Stockfish API call
  const handleStockfishMove = () => {
    console.log("Sending move to Stockfish:", algebraicMove);
    // Replace with actual Stockfish API call
    // Example:
    // fetch('/stockfish-api', { method: 'POST', body: JSON.stringify({ move: algebraicMove }) })
    //   .then(response => response.json())
    //   .then(data => console.log("Stockfish response:", data));
  };

  // Handle ChatGPT API call
  const handleChatGPTQuery = () => {
    console.log("Sending query to ChatGPT:", algebraicMove);
    // Replace with actual ChatGPT API call
    // Example:
    // fetch('/chatgpt-api', { method: 'POST', body: JSON.stringify({ query: algebraicMove }) })
    //   .then(response => response.json())
    //   .then(data => setChatGPTResponse(data.response));
  };


  function checkMove(sourcePosition: number, targetPosition: number, move: number): boolean {
    return targetPosition === sourcePosition - move;
  }

  function checkMoveBothDirections(sourcePosition: number, targetPosition: number, move: number): boolean {
    return checkMove(sourcePosition, targetPosition, move) || checkMove(sourcePosition, targetPosition, -move);
  }

  function isPawnMove(sourcePosition: number, targetPosition: number): boolean {
    //needs to change this so that it can move 2 spaces on first move
    //also needs movement to take other pawns
    //also needs en passant
    //also needs to promotion on other side of the board
    return checkMove(sourcePosition, targetPosition, 8) || checkMove(sourcePosition, targetPosition, 16);
  }

  function isInRow(sourcePosition: number, targetPosition: number): boolean {
    return Math.floor(sourcePosition / 8) === Math.floor(targetPosition / 8);
  }

  function isInColumn(sourcePosition: number, targetPosition: number): boolean {
    return sourcePosition % 8 === targetPosition % 8;
  }

  function isRookMove(sourcePosition: number, targetPosition: number): boolean {
    return  isInRow(sourcePosition, targetPosition) || isInColumn(sourcePosition, targetPosition);
  }

  function isInDiagonal(sourcePosition: number, targetPosition: number): boolean {
    return Math.abs(Math.floor(sourcePosition / 8) - Math.floor(targetPosition / 8)) === Math.abs(sourcePosition % 8 - targetPosition % 8);
  }

  function isBishopMove(sourcePosition: number, targetPosition: number): boolean {
    return isInDiagonal(sourcePosition, targetPosition);
  }

  function isKingMove(sourcePosition: number, targetPosition: number): boolean {
    return (checkMoveBothDirections(sourcePosition, targetPosition, 1)) || 
    (checkMoveBothDirections(sourcePosition, targetPosition, 7)) ||
    (checkMoveBothDirections(sourcePosition, targetPosition, 8)) ||
    (checkMoveBothDirections(sourcePosition, targetPosition, 9));
  }

  function isQueenMove(sourcePosition: number, targetPosition: number): boolean {
    return isBishopMove(sourcePosition, targetPosition) || isRookMove(sourcePosition, targetPosition);
  }

  function isKnightMove(sourcePosition: number, targetPosition: number): boolean {
    //17, 15, 10, 6, -6, -10, -15, -17
    return checkMove(sourcePosition, targetPosition, 17) ||
          checkMoveBothDirections(sourcePosition, targetPosition, 15) ||
          checkMoveBothDirections(sourcePosition, targetPosition, 10) ||
          checkMoveBothDirections(sourcePosition, targetPosition, 6);
  }

  function isValidMove(piece:string, sourcePosition: number, targetPosition: number): boolean {

    if(piece.slice(1) === 'Pawn') {
      return isPawnMove(sourcePosition, targetPosition);
    }
    if(piece.slice(1) === 'Rook') {
      return isRookMove(sourcePosition, targetPosition);
    }
    if(piece.slice(1) === 'Bishop') {
      return isBishopMove(sourcePosition, targetPosition);
    }
    if(piece.slice(1) === 'King') {
      return isKingMove(sourcePosition, targetPosition);
    }
    if(piece.slice(1) === 'Queen') {
      return isQueenMove(sourcePosition, targetPosition);
    }
    if(piece.slice(1) === 'Knight') {
      return isKnightMove(sourcePosition, targetPosition);
    }
    
    return false;
  }

  const handleDrop = (piece: string, targetPosition: number, sourcePosition: number) => {
    const sourceAlgebraic = positionToAlgebraic(sourcePosition);
    const targetAlgebraic = positionToAlgebraic(targetPosition);
    const move = `${sourceAlgebraic}-${targetAlgebraic}`;
    console.log("Move in algebraic notation:", move);
  
    setAlgebraicMove(move); // Update the algebraic move state
  
    setBoardState((prev) => {
      if (!isValidMove(piece, sourcePosition, targetPosition)) {
        console.error("Invalid move from", sourcePosition, "to", targetPosition);
        return prev; // Invalid move, return previous state
      }
      // Record new state
      const newState = { ...prev };
      newState[sourcePosition] = null;
      // Remove piece from old position (source)
      newState[targetPosition] = piece;
      // Update piece position, replacing any existing value (piece)
      return newState; // Return new board state
    });
  };
  // Handle removal (piece take)
  const handleRemove = (position: number) => {
    const positionAlgebraic = positionToAlgebraic(position); // Convert position to algebraic notation
    const piece = boardState[position]; // Get the piece being captured
  
    if (piece) {
      console.log(`${piece[1]}x${positionAlgebraic}`); // Log the capture in algebraic notation
    } else {
      console.error("No piece to capture at", positionAlgebraic); // Handle edge case
    }
  
    setBoardState((prev) => ({
      ...prev,
      [position]: null, // Remove piece from position
    }));
  };
  // create basic board with loop 
  const render = () => {
    const squares = [];
    for (let i = 0; i < 64; i++){
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
  }
  return (
    <DndProvider backend={HTML5Backend}>
      <div style={{
        display: 'flex', // Use flexbox to place the chessboard and side panel side by side
        justifyContent: 'center',
        alignItems: 'flex-start',
        width: '100%',
        height: '100vh',
        padding: '10px',
        boxSizing: 'border-box',
      }}>
        {/* Chessboard Section */}
        <div style={{
          width: '70%', // Adjust width as needed
          maxWidth: 'min(90vh, 90vw)',
          aspectRatio: '1',
          border: '2px solid #333',
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(8, 1fr)',
            gridTemplateRows: 'repeat(8, 1fr)',
            width: '100%',
            height: '100%',
          }}>
            {render()}
          </div>
        </div>
  
        {/* Side Panel Section */}
        <div style={{
          width: '30%', // Adjust width as needed
          marginLeft: '20px',
          padding: '10px',
          border: '2px solid #333',
          borderRadius: '5px',
          backgroundColor: '#f9f9f9',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
        }}>
          <h3>API Interaction</h3>
          {/* Stockfish Section */}
          <div>
            <h4>Stockfish</h4>
            <input
              type="text"
              value={algebraicMove}
              onChange={(e) => setAlgebraicMove(e.target.value)}
              placeholder="Enter move (e.g., e2-e4)"
              style={{
                width: '100%',
                padding: '5px',
                borderRadius: '5px',
                border: '1px solid #ccc',
                marginBottom: '10px',
              }}
            />
            <button onClick={handleStockfishMove}>Send to Stockfish</button>
          </div>
  
          {/* ChatGPT Section */}
          <div>
            <h4>ChatGPT</h4>
            <textarea
              placeholder="Ask ChatGPT about the game..."
              rows={5}
              value={algebraicMove}
              onChange={(e) => setAlgebraicMove(e.target.value)}
              style={{
                width: '100%',
                padding: '5px',
                borderRadius: '5px',
                border: '1px solid #ccc',
              }}
            />
            <button onClick={handleChatGPTQuery}>Ask ChatGPT</button>
            {chatGPTResponse && (
              <div style={{
                marginTop: '10px',
                padding: '10px',
                border: '1px solid #ccc',
                borderRadius: '5px',
                backgroundColor: '#fff',
              }}>
                <strong>ChatGPT Response:</strong>
                <p>{chatGPTResponse}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </DndProvider>
  );
}
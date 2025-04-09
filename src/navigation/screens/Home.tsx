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

  function isValidMove(piece:string, sourcePosition: number, targetPosition: number): boolean {

    if(piece.slice(1) === 'Pawn' && (targetPosition === sourcePosition - 8)) {
      return true;
    }
    if(piece.slice(1) === 'Rook' && (targetPosition === sourcePosition + 8)) {
      return true;
    }
    
    return false;
  }

  const handleDrop = (piece: string, targetPosition: number, sourcePosition: number) => {
    setBoardState((prev) => {
      if(!isValidMove(piece, sourcePosition, targetPosition)) {
        console.error("Invalid move from", sourcePosition, "to", targetPosition);
        return prev; // Invalid move, return previous state
      }
      // record new state
      const newState = {...prev};
      newState[sourcePosition] = null;
      // remove piece from old position (source)
      newState[targetPosition] = piece;
      // update piece position replaceing any existing value (piece)
      return newState; //return new board state 
    });
  };
  // Handle removal (piece take)
  const handleRemove = (position: number) => {
    setBoardState((prev)=> ({
      ...prev,
      [position]: null, // remove piece from position
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
        display: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        width: '25%',
        height: '25%',
      }}>
        <div style={{
          position: 'absolute',
          top: '1%',
          left: '25%',
          border: '2px solid #333',
        }}>
          <div style={{ 
            display: 'grid',
            gridTemplateColumns: 'repeat(8, 1fr)',
            gridTemplateRows: 'repeat(8, 1fr)',
            // width: '25%',
            // height: '25%',
            
          }}>
            {render()}
          </div>
        </div>
      </div>
    </DndProvider>
  );
}
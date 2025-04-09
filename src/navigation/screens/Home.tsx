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
        backgroundColor: 'lightgray',
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
        backgroundColor: isOver ? 'lightgreen' : (Math.floor(position/8)+(position%8))%2 === 0  ? 'white' : 'gray',
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
    0: "Rook",
    1: "Knight",
    2: "Bishop",
    3: "Queen",
    4: "King",
    5: "Bishop",
    6: "Knight",
    7: "Rook",
    8: "Pawn",
    9: "Pawn",
    10: "Pawn",
    11: "Pawn",
    12: "Pawn",
    13: "Pawn",
    14: "Pawn",
    15: "Pawn",
    16: null, 17: null, 18: null, 19: null, 20: null, 
    21: null, 22: null, 23: null, 24: null, 25: null, 
    26: null, 27: null, 28: null, 29: null, 30: null, 
    31: null, 32: null, 33: null, 34: null, 35: null,
    36: null, 37: null, 38: null, 39: null, 40: null,
    41: null, 42: null, 43: null, 44: null, 45: null,
    46: null, 47: null,
    48: "Pawn",
    49: "Pawn",
    50: "Pawn",
    51: "Pawn",
    52: "Pawn",
    53: "Pawn",
    54: "Pawn",
    55: "Pawn",
    56: "Rook",
    57: "Knight",
    58: "Bishop",
    59: "Queen",
    60: "King",
    61: "Bishop",
    62: "Knight",
    63: "Rook",
  });
  // Drop zones with array's that store the widgets dropped in them (Data for future Ai responses (stock fish and GPT))

  const handleDrop = (piece: string, targetPosition: number, sourcePosition: number) => {
    setBoardState((prev) => {
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
        width: '75%',
        height: '75%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '10px',
        boxSizing: 'border-box',
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
      }}>
        <div style={{
          width: '100%',
          maxWidth: 'min(90vh, 90vw)',
          aspectRatio: '1/1',
        }}>
          <div style={{ 
            display: 'grid',
            gridTemplateColumns: 'repeat(8, 1fr)',
            gridTemplateRows: 'repeat(8, 1fr)',
            width: '100%',
            height: '100%',
            border: '2px solid #333',
          }}>
            {render()}
          </div>
        </div>
      </div>
    </DndProvider>
  );
}
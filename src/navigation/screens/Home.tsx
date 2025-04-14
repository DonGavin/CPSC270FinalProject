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
  }),[piece, position]); 

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
      return {position}; 
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
  function piecesAhead(piece: string, sourcePosition: number, targetPosition: number): boolean {
    const targetPiece = boardState[targetPosition];
    // const currentPiece = boardState[sourcePosition];
    const sourceRow = Math.floor(sourcePosition / 8);
    const sourceCol = sourcePosition % 8;
    const targetRow = Math.floor(targetPosition / 8);
    const targetCol = targetPosition % 8;

    let step: number | null = null;

    // Horizontal movement.
    if (sourceRow === targetRow) {
      step = targetCol > sourceCol ? 1 : -1;
    }
    // Vertical movement.
    else if (sourceCol === targetCol) {
      step = targetRow > sourceRow ? 8 : -8;
    }
    // Diagonal movement.
    else if (Math.abs(sourceRow - targetRow) === Math.abs(sourceCol - targetCol)) {
      const rowStep = targetRow > sourceRow ? 1 : -1;
      const colStep = targetCol > sourceCol ? 1 : -1;
      step = rowStep * 8 + colStep;
    }
    // For non-straight and non-diagonal moves (e.g. knight), no iteration is needed.
    else {
      return false;
    }

    // Check every square between source and target (exclusive) 
    let current = sourcePosition + step;
    while (current !== targetPosition) {
      if (boardState[current] !== null) {
        return true; // There is a blocking piece in between.
      }
      current += step;
    }
    if(targetPiece === null) {
      return false; 
    }
    return targetPiece[0]==='W';
  }

  function checkMove(sourcePosition: number, targetPosition: number, move: number): boolean {
    return targetPosition === sourcePosition - move;
  }

  function checkMoveBothDirections(sourcePosition: number, targetPosition: number, move: number): boolean {
    return checkMove(sourcePosition, targetPosition, move) || checkMove(sourcePosition, targetPosition, -move);
  }

  function isPawnMove(sourcePosition: number, targetPosition: number): boolean {
    //also needs en passant
    
    //promotion in handle drop function
    
    //checks movement for attack
    if(boardState[targetPosition] !== null) {
      return checkMove(sourcePosition, targetPosition, 7) || checkMove(sourcePosition, targetPosition, 9);
    }
    //checks movement for normal move
    return checkMove(sourcePosition, targetPosition, 8) || 
    (checkMove(sourcePosition, targetPosition, 16)&&(Math.floor(sourcePosition/8) === 6));
  }

  function isInRow(sourcePosition: number, targetPosition: number): boolean {
    return Math.floor(sourcePosition / 8) === Math.floor(targetPosition / 8);
  }

  function isInColumn(sourcePosition: number, targetPosition: number): boolean {
    return sourcePosition % 8 === targetPosition % 8;
  }

  function isRookMove(sourcePosition: number, targetPosition: number): boolean {
    return  !piecesAhead('Rook', sourcePosition,targetPosition)&&(isInRow(sourcePosition, targetPosition) || isInColumn(sourcePosition, targetPosition));
  }

  function isInDiagonal(sourcePosition: number, targetPosition: number): boolean {
    return Math.abs(Math.floor(sourcePosition / 8) - Math.floor(targetPosition / 8)) === Math.abs(sourcePosition % 8 - targetPosition % 8);
  }

  function isBishopMove(sourcePosition: number, targetPosition: number): boolean {
    return !piecesAhead('Bishop',sourcePosition,targetPosition)&&isInDiagonal(sourcePosition, targetPosition);
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
    return checkMoveBothDirections(sourcePosition, targetPosition, 17) ||
          checkMoveBothDirections(sourcePosition, targetPosition, 15) ||
          checkMoveBothDirections(sourcePosition, targetPosition, 10) ||
          checkMoveBothDirections(sourcePosition, targetPosition, 6);
  }
 function disallowSelfCheck(piece: string, sourcePosition: number, targetPosition: number): {isSafe: boolean; isCheckMate: boolean} {
  // simulate/snapshot board when move is made to check if king is in check before move is made (examine potential for aysnch)
  const simulatedFutureBoardState = {...boardState}; 
  simulatedFutureBoardState[sourcePosition] = null;
  simulatedFutureBoardState[targetPosition] = piece;
  const simulatedKingPosition = piece === 'WKing'
  ? targetPosition: Object.keys(simulatedFutureBoardState).find(key => simulatedFutureBoardState[+key] === 'Wking');
  const simKingPosNum= +simulatedKingPosition!;
  for (const [pos, opponentPiece] of Object.entries(simulatedFutureBoardState)) {
    if (opponentPiece && opponentPiece[0] === 'B') {
      const opponentPos = +pos;
      if (isValidMove(opponentPiece, opponentPos, simKingPosNum)){
        return {isSafe: false, isCheckMate: false}; 
      }
    }
  }
  if (piece ==='WKing') {
    // front one space = cur pos - 8 
    //back one space = cur pos + 8
    // left one space = cur pos - 1
    //right one space = cur pos + 1
    // diagonal left = cur pos - 9
    // diagonal right = cur pos - 7
    //diagonal backLeft = cur pos + 7
    //diagonal backRight = cur pos + 9
    const potentialKingMoves = [
      simKingPosNum - 1, simKingPosNum + 1,
      simKingPosNum - 8, simKingPosNum + 8,
      simKingPosNum - 9, simKingPosNum - 7,
      simKingPosNum + 9, simKingPosNum + 7
    ];
    let hasValidMove = false;
    for (const move of potentialKingMoves){
      if (move < 0 || move >= 64) continue;
      const tempBoardState = {...simulatedFutureBoardState};
      tempBoardState[simKingPosNum] = null;
      tempBoardState[move] = 'WKing'; 
      let isMoveSafe = true;
      for (const [pos, opponentPiece] of Object.entries(tempBoardState)) {
        if (opponentPiece && opponentPiece[0] === 'B') {
          const opponentPos = +pos;
          if (isValidMove(opponentPiece, opponentPos, move)){
            isMoveSafe = false;
            break; //Move is valid, no point in continuing loop (maybe saves memory/more efficient use of state?)
          }
        }
      }
      if (isMoveSafe) {
        hasValidMove = true;
        console.log("Valid move found for King at position", move);
        break; // Move is safe, no need to continue loop (same as above)
      }
    }

    console.log("Final hasValidMove value after eval of potential moves", hasValidMove) //debugging and making sure function validates correctly
    
    if (!hasValidMove) {
      console.log("No valid moves for King at position", simKingPosNum);
      return {isSafe: false, isCheckMate: true}; // No valid moves available (i.e. checkmate!)
    }
  }
  return {isSafe: true, isCheckMate: false};
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
      if(boardState[targetPosition] && boardState[targetPosition][0] ==='W'){
        return false; 
      }
      return (
        isKingMove(sourcePosition, targetPosition) && 
        (() => {
          const {isSafe, isCheckMate} = disallowSelfCheck(piece, sourcePosition, targetPosition);
          if (isCheckMate) {
            console.log("Checkmate! Your cooked Pal!");
          }
          if (!isSafe) {
            console.log("Unsafe Move! You cannot move the King into check Bozo!")
          }
          if (isSafe){
            console.log("King is safe when moved from ", sourcePosition, "to", targetPosition);
          }
          return isSafe;
        })()
      );
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
    setBoardState((prev) => {
      if(!isValidMove(piece, sourcePosition, targetPosition)) {
        console.error("Invalid move from", sourcePosition, "to", targetPosition);
        return prev; 
      }
      const newState = {...prev};
      newState[sourcePosition] = null;
      newState[targetPosition] = piece;
      // update piece position replaceing any existing value (piece)
      if(piece === "WPawn" && Math.floor(targetPosition/8) === 0) {
        newState[targetPosition] = "WQueen";
      }
      return newState; //return new board state 
    });
  };

  const handleRemove = (position: number) => {
    setBoardState((prev)=> ({
      ...prev,
      [position]: null, 
    }));
  };

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
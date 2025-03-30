import { Button, Text } from '@react-navigation/elements';
import { Pressable, StyleSheet, View } from 'react-native';
import { useState, useEffect } from 'react';

function Title() {
  return <Text style={{ fontSize: 30 }}>Chess Game</Text>;
}

function Pawn({row, col, onMove}) {
  const [position, setPosition] = useState({row, col});
  function movePawn() {
    const newRow = position.row + (row === 1 ? 1: -1);
    if (onMove) onMove (position.row,position.col, newRow, position.col);
    setPosition({row: newRow, col: position.col});
  }
  const [Pcolor, setPColor] = useState(true)
  return (
    <View style={{ width: 25, height: 25}}><Pressable style={{ width: 25, height: 25, backgroundColor: Pcolor ? 'white' : 'blue', justifyContent: 'center', alignItems:'center'}} onPress={movePawn}><Text>P</Text></Pressable></View>
  );
}

function Rook() {
  const [Rcolor, setRColor] = useState(true)
  // let Rcolor = true
  return (
    <View ><Pressable style={{ width: 25, height: 25, backgroundColor: Rcolor ? 'white' : 'pink', justifyContent: 'center', alignItems:'center' }} onPress={()=>{setRColor(!Rcolor)}}><Text>R</Text></Pressable></View>
  );
}

function Bishop() {
  const [Bcolor, setBColor] = useState(true)
  return (
    <View ><Pressable style={{ width: 25, height: 25, backgroundColor: Bcolor ? 'white' : 'yellow', justifyContent: 'center', alignItems:'center' }} onPress={()=>{setBColor(!Bcolor)}}><Text>B</Text></Pressable></View>
  );
}

function Knight() {
  const [Kcolor, setKColor] = useState(true)
  return (
    <View ><Pressable style={{ width: 25, height: 25, backgroundColor: Kcolor ? 'white' : 'orange', justifyContent: 'center', alignItems:'center' }} onPress={()=>{setKColor(!Kcolor)}}><Text>N</Text></Pressable></View>
  );
}

  function Queen() {
    const [Qcolor, setQColor] = useState(true)
    return (
      <View ><Pressable style={{ width: 25, height: 25, backgroundColor: Qcolor ? 'white' : 'orange', justifyContent: 'center', alignItems:'center' }} onPress={()=>{setQColor(!Qcolor)}}><Text>Q</Text></Pressable></View>
    );
  }
  
  function King() {
    const [Kcolor, setKColor] = useState(true)
    return (
      <View ><Pressable style={{ width: 25, height: 25, backgroundColor: Kcolor ? 'white' : 'orange', justifyContent: 'center', alignItems:'center' }} onPress={()=>{setKColor(!Kcolor)}}><Text>K</Text></Pressable></View>
    );
  }

  function Board(){
    const squaresNumber = 8;
    const [pieces, setPieces] = useState({
      pawns: Array.from({ length: squaresNumber }, (_, i) => ({ row: 1, col: i })), // White pawns created for row 1
    });
    const [squares, setSquares] = useState(Array(squaresNumber).fill(null).map(()=>Array(squaresNumber).fill(null).map(() => Math.random() < 0.5)))
    const [color, setColor] = useState(true)
    // function to move piece 
    function movePiece(oldRow, oldCol, newRow, newCol){
      setPieces((prevPieces) => ({
        ...prevPieces,
        pawns: prevPieces.pawns.map((p) =>
          p.row === oldRow && p.col === oldCol ? { row: newRow, col: newCol } : p
        ),
      }));
    }
    // Function to generate a unique ID for each square
    function getSquareId(row, col) {
      // Common chess notation: a1, b2, etc.
      const colLetters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
      return `${colLetters[col]}${8-row}`;
    }
    
    // Function to render a square
    function renderSquare(row, col) {
      const isLight = (row + col) % 2 === 0;
      const pawn = pieces.pawns.find((p) => p.row === row && p.col === col);
      return (
        <View
          key={`${row}-${col}`}
          style={{
            width: 40,
            height: 40,
            backgroundColor: isLight ? "green" : "black",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {pawn && <Pawn row={row} col={col} onMove={movePiece} />}
        </View>
      );
    }
    
    return (
      <View style={{ flexWrap: "wrap", flexDirection: "row", width: 320 }}>
        {Array.from({ length: squaresNumber }).map((_, row) =>
        Array.from({ length: squaresNumber }).map((_, col) => renderSquare(row, col)))}      </View>
    )
  }

function Game(){
  return (
      <Board />
)
}








export function Home() {
  return (
    <View style={styles.container}>
      <Title />
      <Game />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
  },
});

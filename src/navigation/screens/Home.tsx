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
    const [squares, setSquares] = useState(Array(squaresNumber).fill(null).map(()=>Array(squaresNumber).fill(null).map(() => Math.random() < 0.5)))
    const [color, setColor] = useState(true)
    
    // Function to generate a unique ID for each square
    function getSquareId(row, col) {
      // Common chess notation: a1, b2, etc.
      const colLetters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
      return `${colLetters[col]}${8-row}`;
    }
    
    // Function to render a square
    function renderSquare(square, rowIndex, squareIndex) {
      const squareId = getSquareId(rowIndex, squareIndex);
      console.log(`Creating square: ${squareId} at row: ${rowIndex}, column: ${squareIndex}`);
      return (
        <View 
          key={squareId}
          accessibilityLabel={squareId}
          testID={squareId}
          style={{
            flex:1, 
            aspectRatio: 1, 
            backgroundColor: ((rowIndex+squareIndex)%2) == 1 ? 'green' : 'black', 
            justifyContent:'center', 
            alignItems:'center'
          }} 
        >
          {(Math.floor((((rowIndex)*8)+(squareIndex))/8)) == 1 || (Math.floor((((rowIndex)*8)+(squareIndex))/8)) == 6 ? <Pawn /> : 
          ((Math.floor((((rowIndex)*8)+(squareIndex))/8)) == 0 && squareIndex == 0) || ((Math.floor((((rowIndex)*8)+(squareIndex))/8)) == 0 && squareIndex == 7)  ? <Rook/> : 
          ((Math.floor((((rowIndex)*8)+(squareIndex))/8)) == 7 && squareIndex == 0) || ((Math.floor((((rowIndex)*8)+(squareIndex))/8)) == 7 && squareIndex == 7) ? <Rook/> : 
          ((Math.floor((((rowIndex)*8)+(squareIndex))/8)) == 0 && squareIndex == 1) || ((Math.floor((((rowIndex)*8)+(squareIndex))/8)) == 0 && squareIndex == 6) ? <Knight/> :
          ((Math.floor((((rowIndex)*8)+(squareIndex))/8)) == 7 && squareIndex == 1) || ((Math.floor((((rowIndex)*8)+(squareIndex))/8)) == 7 && squareIndex == 6) ? <Knight/> :
          ((Math.floor((((rowIndex)*8)+(squareIndex))/8)) == 0 && squareIndex == 2) || ((Math.floor((((rowIndex)*8)+(squareIndex))/8)) == 0 && squareIndex == 5) ? <Bishop/> :
          ((Math.floor((((rowIndex)*8)+(squareIndex))/8)) == 7 && squareIndex == 2) || ((Math.floor((((rowIndex)*8)+(squareIndex))/8)) == 7 && squareIndex == 5) ? <Bishop/> :
          ((Math.floor((((rowIndex)*8)+(squareIndex))/8)) == 0 && squareIndex == 3) || ((Math.floor((((rowIndex)*8)+(squareIndex))/8)) == 7 && squareIndex == 3) ? <Queen/> :
          ((Math.floor((((rowIndex)*8)+(squareIndex))/8)) == 0 && squareIndex == 4) || ((Math.floor((((rowIndex)*8)+(squareIndex))/8)) == 7 && squareIndex == 4) ? <King/> :
          null}
        </View>
      );
    }
    
    // Function to render a row
    function renderRow(row, rowIndex) {
      return (
        <View key={rowIndex} style={{flexDirection: 'row', flex: 1}}>
          {row.map((square, squareIndex) => renderSquare(square, rowIndex, squareIndex))}
        </View>
      );
    }
    
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'lightblue', width: '50%', height:'50%'}}>
        {squares.map((row, rowIndex) => renderRow(row, rowIndex))}
      </View>
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

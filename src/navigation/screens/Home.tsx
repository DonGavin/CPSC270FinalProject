import { Button, Text } from '@react-navigation/elements';
import { Pressable, StyleSheet, View } from 'react-native';
import { useState, useEffect } from 'react';

function Title() {
  return <Text style={{ fontSize: 30 }}>Chess Game</Text>;
}

function Pawn() {
  return (
    <View style={{ width: 25, height: 25, backgroundColor: 'red' }}></View>
  );
}

function Rook() {
  [color, setColor] = useState(true)
  return (
    <View ><Pressable style={{ width: 25, height: 25, backgroundColor: color ? 'blue' : 'green' }} onPress={()=>{setColor(!color)}}></Pressable></View>
  );
}

function Game(){
  const squaresNumber = 8;
  const [squares, setSquares] = useState(Array(squaresNumber).fill(null).map(()=>Array(squaresNumber).fill(null).map(() => Math.random() < 0.5)))
  const [color, setColor] = useState(true)
  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'lightblue', width: '50%', height:'50%'}}>
      {squares.map((row, rowIndex) => (
        <View key={rowIndex} style={{flexDirection: 'row', flex: 1}}>
          {row.map((square, squareIndex) => (
            <View id={(rowIndex+1)*(squareIndex+1)} key={squareIndex} style={{flex:1, aspectRatio: 1, backgroundColor: ((rowIndex+squareIndex)%2) == 1  ? 'green' : 'black', justifyContent:'center', alignItems:'center'}} >
              {(Math.floor((((rowIndex)*8)+(squareIndex))/8)) == 1 || (Math.floor((((rowIndex)*8)+(squareIndex))/8)) == 6 ? Pawn() : 
              ((Math.floor((((rowIndex)*8)+(squareIndex))/8)) == 0 && squareIndex == 0) || ((Math.floor((((rowIndex)*8)+(squareIndex))/8)) == 0 && squareIndex == 7)  ? Rook() : null}
            </View>
            
          ))}
        </View>
      ))}
    </View>
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

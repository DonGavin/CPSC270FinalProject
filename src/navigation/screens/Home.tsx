import { Button, Text } from '@react-navigation/elements';
import { StyleSheet, View } from 'react-native';
import { useState, useEffect } from 'react';

function Title() {
  return <Text style={{ fontSize: 30 }}>Chess Game</Text>;
} 

function Game(){
  const squaresNumber = 8;
  const [squares, setSquares] = useState(Array(squaresNumber).fill(null).map(()=>Array(squaresNumber).fill(null).map(() => Math.random() < 0.5)))
  const [color, setColor] = useState(true)
  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'lightblue', width: '50%', height:'50%'}}>
      {squares.map((row, rowIndex) => (
        <View key={rowIndex} style={{flexDirection: 'row'}}>
          {row.map((square, squareIndex) => (
            <View key={squareIndex} style={{width: `(${100/squaresNumber})%`, height: `(${100/squaresNumber})%`, backgroundColor: ((rowIndex+squareIndex)%2) == 1  ? 'white' : 'black'}}>
              <Text>{100/8}%</Text>
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

import { Button, Text } from '@react-navigation/elements';
import { StyleSheet, View } from 'react-native';
import { useState } from 'react';

function Title() {
  return <Text style={{ fontSize: 30 }}>Chess Game</Text>;
} 

function Game(){
  const squaresNumber = 8;
  const [squares, setSquares] = useState(Array(squaresNumber).fill(null).map(()=>Array(squaresNumber).fill(null).map(() => Math.random() < 0.5)))
  const [color, setColor] = useState(true)
  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'lightblue', width: '50%'}}>
      {squares.map((row, rowIndex) => (
        <View key={rowIndex} style={{flexDirection: 'row'}}>
          {row.map((square, squareIndex) => (
            <View key={squareIndex} style={{width: 50, height: 50, backgroundColor: ((squareIndex%2)+color) == 1  ? 'white' : 'black'}}/>
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

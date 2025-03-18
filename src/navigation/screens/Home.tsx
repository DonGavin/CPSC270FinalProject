import { Button, Text } from '@react-navigation/elements';
import { Pressable, StyleSheet, View } from 'react-native';
import { useState } from 'react';

export function Piece({pieceId}){
  // squares for each piece with their id as the value 
  const [notSelected, pieceSelected] = useState({
    pieces: {
      1: {name: "Pawn", selected:false, currentPos: 0},
      2: {name: "Knight", selected:false, currentPos: 0},
      3: {name: "Rook", selected:false, currentPos:0},
      4: {name: "Bishop", selected:false, currentPos: 0},
      5: {name: "Queen", selected: false, currentPos: 0},
      6: {name: "King", selected: false, currentPos:0}
    }
  });
  const onSelected = (pieceId) => {
    pieceSelected((prevState) => {
      const updatedPieces = { ...prevState.pieces };
      updatedPieces[pieceId].selected = true;
      return {
        ...prevState,
        pieces: updatedPieces,
      };
    });
    console.log(pieceId);
    console.log(notSelected);
  }
  return(
    <Pressable onPress={() => onSelected(pieceId)}>
      <Text>{pieceId}</Text>
    </Pressable>
  )
}  

export function Home() {
  return (
    <View style={styles.container}>
      <Piece pieceId={2}/>  
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

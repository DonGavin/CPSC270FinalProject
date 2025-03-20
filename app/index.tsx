// import { Text, View } from "react-native";

// export default function Index() {
//   return (
//     <View
//       style={{
//         flex: 1,
//         justifyContent: "center",
//         alignItems: "center",
//       }}
//     >
//       <Text>Edit app/index.tsx to edit this screen.</Text>
//     </View>
//   );
// }
import { Assets, Button, Text } from '@react-navigation/elements';
import { Pressable, StyleSheet, View, ScrollView, Image } from 'react-native';
import { useState, useEffect } from 'react';
import {DragDropContentView} from 'expo-drag-drop-content-view';
function Board(){
  const squaresNumber = 8;
  const [squares, setSquares] = useState(Array(squaresNumber).fill(null).map(()=>Array(squaresNumber).fill(null).map(() => Math.random() < 0.5)))
  const [color, setColor] = useState(true)
  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'lightblue', width: '50%', height:'50%'}}>
      {squares.map((row, rowIndex) => (
        <View key={rowIndex} style={{flexDirection: 'row', flex: 1}}>
          {row.map((square, squareIndex) => (
            <View id={(rowIndex+1)*(squareIndex+1)} key={squareIndex} style={{flex:1, aspectRatio: 1, backgroundColor: ((rowIndex+squareIndex)%2) == 1  ? 'green' : 'black', justifyContent:'center', alignItems:'center'}} >
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
          ))}
        </View>
      ))}
    </View>
  )
}
export default function Index() {
  const DraggablePiecesExample = () => {
    type DroppedPiece = { uri: string; id: string; width: number; height: number };
    const [droppedPieces, setDroppedPieces] = useState<DroppedPiece[]>([]);
    const [currentlyDragging, setCurrentlyDragging] = useState<string | null>(null);
    
    // Sample image URIs (replace with your actual images)
    const sampleImages = [
      'https://www.symbols.com/images/symbol/3404_white-king.png',
      'https://static.stands4.com/images/symbol/3405_white-queen.png',
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTzWlzHTV0gVrLokHRrecg3f_lnd7NttofrLw&s',
      'https://static.wikia.nocookie.net/chess/images/9/90/DarkQueen.png/revision/latest/scale-to-width/360?cb=20230320152652',
    ];
    
    const handleDrop = (assets) => {
      console.log('Dropped assets:', assets);
      
      // Process the dropped Pieces
      const newPieces = assets.filter(asset => 
        asset.type.startsWith('image')
      ).map(asset => ({
        uri: asset.uri || `data:${asset.type};base64,${asset.base64}`,
        id: Math.random().toString(),
        width: asset.width,
        height: asset.height
      }));
      
      setDroppedPieces([...droppedPieces, ...newPieces]);
    };
    // Drop Zone is board 
    const handleReorder = (draggedPieceId, dropZoneIndex) => {
      if (!draggedPieceId) return;
  // Can switch img.id to piece id
      const newBoard = [...droppedPieces];
      const draggedItemIndex = newBoard.findIndex(img => img.id === draggedPieceId);
      
      if (draggedItemIndex !== -1) {
        const [removed] = newBoard.splice(draggedItemIndex, 1);
        newBoard.splice(dropZoneIndex, 0, removed);
        setDroppedPieces(newBoard);
      }
    };
    
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Draggable Pieces Working</Text>
        {/* Board Drop Zone */}
        <DragDropContentView
          style={styles.galleryDropZone}
          onDrop={handleDrop}
          onEnter={() => console.log('Entered Drop Zone')}
          onExit={() => console.log('Exited Drop Zone')}
        >
          {droppedPieces.length === 0 ? (
            <Text style={styles.dropZoneText}>Drop pieces here</Text>
          ) : (
            <ScrollView contentContainerStyle={styles.galleryContainer}>
              {droppedPieces.map((image, index) => (
                <DragDropContentView
                  key={image.id}
                  style={styles.galleryImageContainer}
                  draggableSources={[{ type: 'image', value: image.uri }]}
                  onDragStart={() => setCurrentlyDragging(image.id)}
                  onDragEnd={() => setCurrentlyDragging(null)}
                  onDrop={() => handleReorder(currentlyDragging, index)}
                >
                  <Image
                    source={{ uri: image.uri }}
                    style={styles.galleryImage}
                  />
                </DragDropContentView>
              ))}
            </ScrollView>
          )}
        </DragDropContentView>
      </View>
    );
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 20,
      textAlign: 'center',
    },
    subtitle: {
      fontSize: 18,
      fontWeight: 'bold',
      marginTop: 20,
      marginBottom: 10,
    },
    galleryDropZone: {
      width: '100%',
      height: 400,
      borderWidth: 2,
      borderColor: '#007AFF',
      borderStyle: 'dashed',
      borderRadius: 10,
      justifyContent: 'center',
      backgroundColor: '#F0F0F0',
    },
    dropZoneText: {
      fontSize: 16,
      color: '#333',
      textAlign: 'center',
      padding: 20,
    },
    galleryContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      padding: 10,
    },
    galleryImageContainer: {
      width: '33%',
      aspectRatio: 1,
      padding: 5,
    },
    galleryImage: {
      width: '100%',
      height: '100%',
      borderRadius: 8,
    },
    sampleImagesContainer: {
      flexDirection: 'row',
      paddingVertical: 10,
    },
    sampleImageContainer: {
      width: 100,
      height: 100,
      marginRight: 10,
      borderRadius: 8,
      overflow: 'hidden',
    },
    sampleImage: {
      width: '100%',
      height: '100%',
    },
  });
  return(<View>
    <DraggablePiecesExample />
    </View>
)
}

import { Button, Text } from '@react-navigation/elements';
import { StyleSheet, View } from 'react-native';

function Title() {
  return <Text style={{ fontSize: 30 }}>Chess Game</Text>;
} 










export function Home() {
  return (
    <View style={styles.container}>
      <Title />
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

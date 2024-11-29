import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import ChatScreen from './screens/ChatScreen';
import { Provider } from 'react-redux';
import { store } from './redux/store';

export default function App() {
  return (
    <Provider store={store}>
      {/* <View style={styles.container}> */}
        <ChatScreen/>
        <StatusBar style="auto" />
      {/* </View> */}
    </Provider>
  );
}

const styles = StyleSheet.create({
  // container: {
    // flex: 1,
    // backgroundColor: '#fff',
    // alignItems: 'center',
    // justifyContent: 'center',
  // },
});

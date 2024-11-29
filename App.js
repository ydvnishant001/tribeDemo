import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';
import ChatScreen from './screens/ChatScreen';
import { useEffect } from 'react';
import { loadFonts } from './utilities/helper';
import * as NavigationBar from 'expo-navigation-bar';
import { Colors } from './utilities/appConstants';

export default function App() {
  useEffect(() => {
    const changeNavBarColor = async () => await NavigationBar.setBackgroundColorAsync(Colors.background);

    loadFonts()
    changeNavBarColor()
  }, [])

  return (
      <>
        <ChatScreen/>
        <StatusBar style='light' />
      </>
  );
}

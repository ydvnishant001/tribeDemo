import * as Font from 'expo-font'
import NetInfo from '@react-native-community/netinfo'

export const loadFonts = async () => {
    await Font.loadAsync({
      'Lato-Regular': require('../assets/fonts/Lato-Regular.ttf'),
      'Lato-Bold': require('../assets/fonts/Lato-Bold.ttf'),
    });
};

export const checkNetworkStatus = async () => {
  const state = await NetInfo.fetch();
  return state.isConnected;
};
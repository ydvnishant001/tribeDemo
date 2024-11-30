import * as Font from 'expo-font'
import NetInfo from '@react-native-community/netinfo'
import { Strings } from './appConstants';

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

export const handleInputChange = (text, allParticipants, setUserInput, setShowSuggestions, setSuggestions) => {
  setUserInput(text);
  const lastWord = text.split(' ').pop()

  if(lastWord.startsWith('@')) {
    setShowSuggestions(true);
    
    const suggestions = // show suggestions excluding user
      allParticipants.filter((participant) => (participant.name.toLowerCase().startsWith(lastWord.slice(1).toLowerCase()) && participant.name.toLowerCase() !== Strings.you))
        .map(participant => ({name: participant.name, avatarUrl: participant.avatarUrl}))
    
    setSuggestions(suggestions);
  }
  else setShowSuggestions(false)
};

export const handleMentionSelect = (userName, userInput, setUserInput, setShowSuggestions) => {//showing selected suggestion properly
  const words = userInput.split(' ')
  words[words.length - 1] = `@${userName} `
  setUserInput(words.join(' '))
  setShowSuggestions(false)
};
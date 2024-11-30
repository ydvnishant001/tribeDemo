import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, FlatList, TextInput, Modal, StyleSheet, Image, ActivityIndicator } from 'react-native'
import { getAllMessages, getAllParticipants, postMessage } from "../axios/api";
import {Colors, fontSizes, isIOS, SCREEN_HEIGHT, SCREEN_WIDTH, Strings, windowHeight, windowWidth } from "../utilities/appConstants";
import moment from "moment";
import { useStore } from "../zustand/store";
import BottomSheet from "../components/BottomSheet";
import MessageView from "../components/MessageView";
import { Icons } from "../assets/icons/Icons.js"
import AsyncStorage from "@react-native-async-storage/async-storage";
import { checkNetworkStatus } from "../utilities/helper.js";

const ChatScreen = () => {
    const [showBottomSheet, setShowBottomSheet] = useState({show: false, activeMessageIndex: 0, source: ''})
    const [userInput, setUserInput] = useState('')
    const [showSuggestions, setShowSuggestions] = useState(false)
    const [suggestions, setSuggestions] = useState([])
    const {allMessages, allParticipants, isLoading, getAllMessages: getAllMessagesAction, toggleLoading, getAllParticipants: getAllParticipantsAction} = useStore(state => state)

    const dismissBottomSheet = () => setShowBottomSheet({show: false, activeMessageIndex: 0, source: ''})
    
    const sendMessage = async () => {
        await postMessage(userInput)
        setUserInput("")
        fetchData()
    } 

    const fetchData = async (onRefresh) => {
        const isOnline = await checkNetworkStatus()
        let localStore = await AsyncStorage.getItem(Strings.tribeLocalStore)

        if(!onRefresh) toggleLoading({isLoading: true})//don't show loader on pull down for refresh
        
        if(!isOnline && localStore){//use local store
            localStore = JSON.parse(localStore)
            getAllMessagesAction({allMessages: localStore.allMessages})
            getAllParticipantsAction({allParticipants: localStore.allParticipants})
        }
        else{// call api's
            const messageResponse = await getAllMessages()
            const participantResponse = await getAllParticipants()
            
            if(messageResponse) getAllMessagesAction({allMessages: messageResponse})
            if(participantResponse) getAllParticipantsAction({allParticipants: participantResponse})
        }
    }

    const handleMentionSelect = (userName) => {//showing selected suggestion properly
        const words = userInput.split(' ')
        words[words.length - 1] = `@${userName} `
        setUserInput(words.join(' '))
        setShowSuggestions(false)
    };

    const renderSuggestions = ({item: suggestion}) => {
        return(
            <TouchableOpacity onPress={() => handleMentionSelect(suggestion.name)} style={styles.suggestionListItemTouch}>
                <Image source={{uri: suggestion.avatarUrl}} style={styles.profileImage} resizeMode={Strings.cover}/>
                <Text allowFontScaling={false} style={styles.suggestion}>{suggestion.name}</Text>
            </TouchableOpacity>
        )
    }

    const handleInputChange = (text) => {
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

    const renderAllMessages = ({item, index}) => {
        const isSameAuthor = index && item.authorUuid === allMessages[index-1].authorUuid
        const notSameDay = index && !(moment(item.sentAt).isSame(allMessages[index-1].sentAt, Strings.day))
        
        return <MessageView item={item} index={index} isSameAuthor={isSameAuthor} notSameDay={notSameDay} setShowBottomSheet={setShowBottomSheet}/>
    }

    useEffect(() => {
      fetchData()
    }, [])

    useEffect(() => {
        const syncLocalStore = async () => await AsyncStorage.setItem(Strings.tribeLocalStore, JSON.stringify({allParticipants, allMessages}))

        const timeout = setTimeout(syncLocalStore, 500)//debouncing local store sync

        return () => clearTimeout(timeout)
    }, [allMessages, allParticipants])

    return(
        <View style={styles.mainView}>
            <View style={styles.headerView}>
                <Icons.groupSvg width={windowWidth(30)} height={windowHeight(25)}/>
                <Text allowFontScaling={false} style={styles.headerText}>{Strings.tribe}</Text>
            </View>
                
            <View style={styles.messageListView}>
                <FlatList keyboardShouldPersistTaps={Strings.handled} data={allMessages} onRefresh={() => fetchData(true)} refreshing={false} renderItem={renderAllMessages}
                    keyExtractor={(_, index) => index.toString()}/>
            </View>
            
            <Modal visible={showBottomSheet.show} transparent={true} animationType={Strings.slide} hardwareAccelerated={true}
                onRequestClose={dismissBottomSheet}>
                    <BottomSheet allMessages={allMessages} showBottomSheet={showBottomSheet} dismissBottomSheet={dismissBottomSheet}/>
            </Modal>
            
            <View style={styles.footerView}>
                <View style={styles.inputView}>
                    {suggestions.length && showSuggestions &&
                    <View style={styles.suggestionListView}>
                        <FlatList keyboardShouldPersistTaps={Strings.handled} data={suggestions} renderItem={renderSuggestions} keyExtractor={(_, index) => index.toString()}/>
                    </View>
                    }

                    <TextInput value={userInput} style={styles.textInput} placeholderTextColor={Colors.placeholder} onChangeText={handleInputChange}
                        placeholder={Strings.message}/>
                </View>
                
                <TouchableOpacity disabled={!userInput} onPress={sendMessage} style={styles.sendTouch}>
                    <Icons.sendSvg width={windowWidth(20)} height={windowHeight(20)}/>
                </TouchableOpacity>
            </View>

            {isLoading &&
            <View style={styles.loaderView}>
                <ActivityIndicator size={Strings.large} color={Colors.replyName} />
            </View>
            }
        </View>
    )
}

const styles = StyleSheet.create({
    loaderView: {justifyContent: Strings.center, alignItems: Strings.center, position: Strings.absolute, alignSelf: Strings.center, top: SCREEN_HEIGHT/2, zIndex: 1,
        backgroundColor: Colors.white, height: 100, width: 100, borderRadius: 15},
    mainView: {flex: 1, backgroundColor: Colors.background},
    headerView: {paddingHorizontal: windowWidth(20), paddingTop: windowHeight(isIOS ? 40 : 15), paddingBottom: windowHeight(isIOS ? 10 : 15), flexDirection: Strings.row,
        alignItems: Strings.center, backgroundColor: Colors.messageBG, marginTop: windowHeight(isIOS ? 0 : 25)},
    headerText: {fontFamily: Strings.latoBold, color: Colors.replyName, fontSize: fontSizes.FONT20, marginLeft: windowWidth(15), lineHeight: 25},
    suggestionListItemTouch: {padding: 10, flexDirection: Strings.row, alignItems: Strings.center},
    profileImage: {height: windowHeight(30), width: windowWidth(33), borderRadius: 30},
    suggestion: {fontFamily: Strings.latoRegular, color: Colors.white, fontSize: fontSizes.FONT14, marginLeft: windowWidth(10)},
    messageListView: {marginBottom: windowHeight(50), flex: 1, backgroundColor: Colors.background},
    footerView: {position: Strings.absolute, bottom: 0, flexDirection: Strings.row, alignItems: Strings.center, left: 0, right: 0, height: windowHeight(isIOS ? 55 : 50),
        borderWidth: 1, backgroundColor: Colors.messageBG, paddingBottom: windowWidth(isIOS ? 15 : 0)},
    inputView: {borderRadius: 12, borderWidth: 1, marginLeft: windowWidth(30), width: SCREEN_WIDTH/1.4, height: windowHeight(35),
        backgroundColor: Colors.textInput},
    textInput: {paddingLeft: windowWidth(20), fontFamily: Strings.latoRegular, color: Colors.white, height: windowHeight(35)},
    suggestionListView: {position: Strings.absolute, bottom: windowHeight(35), left: 0, padding: 10, borderRadius: 12, borderWidth: 1, width: SCREEN_WIDTH/1.5,
        height: windowHeight(200), backgroundColor: Colors.background},
    sendTouch: {padding: 5, borderRadius: 30, marginLeft: windowWidth(20)}
})

export default ChatScreen
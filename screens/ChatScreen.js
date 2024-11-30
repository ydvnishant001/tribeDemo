import React, { useEffect, useRef, useState } from "react";
import { View, Text, TouchableOpacity, FlatList, TextInput, Modal, Image, ActivityIndicator, Keyboard } from 'react-native'
import { getAllMessages, getAllParticipants, postMessage } from "../axios/api";
import {Colors, isIOS, Strings, windowHeight, windowWidth } from "../utilities/appConstants";
import moment from "moment";
import { useStore } from "../zustand/store";
import BottomSheet from "../components/BottomSheet";
import MessageView from "../components/MessageView";
import { Icons } from "../assets/icons/Icons.js"
import AsyncStorage from "@react-native-async-storage/async-storage";
import { checkNetworkStatus, handleInputChange, handleMentionSelect } from "../utilities/helper.js";
import styles from "./styles.js";

const ChatScreen = () => {
    const [showBottomSheet, setShowBottomSheet] = useState({show: false, activeMessageIndex: 0, source: ''})
    const [userInput, setUserInput] = useState('')
    const [showSuggestions, setShowSuggestions] = useState(false)
    const [suggestions, setSuggestions] = useState([])
    const scrollRef = useRef(null);
    const {allMessages, allParticipants, isLoading, getAllMessages: getAllMessagesAction, toggleLoading, getAllParticipants: getAllParticipantsAction} = useStore(state => state)

    const dismissBottomSheet = () => setShowBottomSheet({show: false, activeMessageIndex: 0, source: ''})

    const onSuggestionPress = (userName) => handleMentionSelect(userName, userInput, setUserInput, setShowSuggestions)
    
    const onChangeText = (text) => handleInputChange(text, allParticipants, setUserInput, setShowSuggestions, setSuggestions)
    
    const sendMessage = async () => {
        await postMessage(userInput)
        setUserInput("")
        Keyboard.dismiss()
        fetchData(true, true)
    } 

    const fetchData = async (onRefresh, onMessageSent) => {
        const isOnline = await checkNetworkStatus()
        let localStore = await AsyncStorage.getItem(Strings.tribeLocalStore)

        if(!onRefresh) toggleLoading({isLoading: true})
        
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
        
        if(scrollRef.current && onMessageSent){//scroll to end on message post
            setTimeout(() => {
                scrollRef.current.scrollToEnd({animated: true});
            }, 300);
        }
    }

    const renderSuggestions = ({item: suggestion}) => {
        return(
            <TouchableOpacity onPress={() => onSuggestionPress(suggestion.name)} style={styles.suggestionListItemTouch}>
                <Image source={{uri: suggestion.avatarUrl}} style={styles.profileImage} resizeMode={Strings.cover}/>
                <Text allowFontScaling={false} numberOfLines={1} style={styles.suggestion}>{suggestion.name}</Text>
            </TouchableOpacity>
        )
    }


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

                <TouchableOpacity onPress={() => scrollRef.current && scrollRef.current.scrollToEnd({animated: true})} style={styles.scrollIcon}>
                    <Icons.scrollSvg width={windowWidth(30)} height={windowHeight(25)}/>
                </TouchableOpacity>
            </View>
                
            <View style={styles.messageListView}>
                <FlatList ref={scrollRef} keyboardShouldPersistTaps={Strings.handled} data={allMessages} onRefresh={() => fetchData(true)} refreshing={false}
                    renderItem={renderAllMessages} keyExtractor={(_, index) => index.toString()}/>
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

                    <TextInput value={userInput} style={styles.textInput} placeholderTextColor={Colors.placeholder} onChangeText={onChangeText} placeholder={Strings.message}/>
                </View>
                
                <TouchableOpacity onPress={sendMessage} style={styles.sendTouch}>
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

export default ChatScreen
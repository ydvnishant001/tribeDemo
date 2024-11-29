import React, { useState } from "react";
import { View, Text, TouchableOpacity, FlatList, TextInput, Modal, StyleSheet } from 'react-native'
import { getAllMessages, getAllParticipants, postMessage } from "../axios/api";
import {Colors, fontSizes, SCREEN_WIDTH, Strings, windowHeight, windowWidth } from "../utilities/appConstants";
import moment from "moment";
import { useStore } from "../zustand/store";
import BottomSheet from "../components/BottomSheet";
import MessageView from "../components/MessageView";
import { Icons } from "../assets/icons/Icons.js"

const ChatScreen = () => {
    const [showBottomSheet, setShowBottomSheet] = useState({show: false, activeMessageIndex: 0, source: ''})
    const [userInput, setUserInput] = useState('')
    const [showSuggestions, setShowSuggestions] = useState(false)
    const [suggestions, setSuggestions] = useState([])
    const {allMessages, allParticipants, getAllMessages: getAllMessagesAction, getAllParticipants: getAllParticipantsAction} = useStore(state => state)

    const sendMessage = async () => {
        await postMessage(userInput)
        setUserInput("")
        fetchData()
    }

    const fetchData = async () => {
        const messageResponse = await getAllMessages()
        const participantResponse = await getAllParticipants()

        if(messageResponse) getAllMessagesAction({allMessages: messageResponse})
        if(participantResponse) getAllParticipantsAction({allParticipants: participantResponse})
    }

    const handleMentionSelect = (userName) => {
        const words = userInput.split(' ')
        words[words.length - 1] = `@${userName} `
        setUserInput(words.join(' '))
        setShowSuggestions(false)
    };

    const renderSuggestions = ({item}) => <TouchableOpacity onPress={() => handleMentionSelect(item)} style={{padding: 10}}><Text>{item}</Text></TouchableOpacity>

    const handleInputChange = (text) => {
        setUserInput(text);
        const lastWord = text.split(' ').pop()
      
        if(lastWord.startsWith('@')) {
          setShowSuggestions(true);
          
          const suggestions = allParticipants.filter((participant) => participant.name.toLowerCase().startsWith(lastWord.slice(1).toLowerCase())).map(item => item.name)
          setSuggestions(suggestions);
        }
        else setShowSuggestions(false)
      };

    const renderAllMessages = ({item, index}) => {
        const isSameAuthor = index && item.authorUuid === allMessages[index-1].authorUuid
        const notSameDay = index && !(moment(item.sentAt).isSame(allMessages[index-1].sentAt, 'day'))
        
        return <MessageView item={item} index={index} isSameAuthor={isSameAuthor} notSameDay={notSameDay} setShowBottomSheet={setShowBottomSheet}/>
    }
    
    return(
        <View style={styles.mainView}>
            <TouchableOpacity style={{paddingHorizontal: windowWidth(20), paddingVertical: windowHeight(15), flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.messageBG, marginTop: windowHeight(25)}} onPress={fetchData}>
                <Icons.groupSvg width={windowWidth(30)} height={windowHeight(25)}/>
                <Text style={{fontFamily: Strings.latoBold, color: Colors.replyName, fontSize: fontSizes.FONT20, marginLeft: windowWidth(15)}}>Tribe</Text>
            </TouchableOpacity>
                
            <View style={styles.messageListView}>
                <FlatList data={allMessages} onRefresh={fetchData} refreshing={false} renderItem={renderAllMessages} keyExtractor={(_, index) => index.toString()}/>
            </View>
            
            <Modal visible={showBottomSheet.show} transparent={true} animationType="slide" hardwareAccelerated={true}
                onRequestClose={() => setShowBottomSheet({show: false, activeMessageIndex: 0, source: ''})}>
                    <BottomSheet allMessages={allMessages} showBottomSheet={showBottomSheet} setShowBottomSheet={setShowBottomSheet}/>
            </Modal>
            
            <View style={styles.footerView}>
                <View style={styles.inputView}>
                    {suggestions.length && showSuggestions &&
                    <View style={styles.suggestionListView}>
                        <FlatList data={suggestions} renderItem={renderSuggestions} keyExtractor={(_, index) => index.toString()}/>
                    </View>
                    }

                    <TextInput value={userInput} style={{paddingLeft: windowWidth(20), fontFamily: Strings.latoRegular, color: Colors.white}} placeholderTextColor={Colors.placeholder} onChangeText={handleInputChange} placeholder="Message"/>
                </View>
                
                <TouchableOpacity disabled={!userInput} onPress={sendMessage} style={styles.sendTouch}>
                    <Icons.sendSvg width={windowWidth(20)} height={windowHeight(20)}/>
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    mainView: {flex: 1, backgroundColor: Colors.background},
    messageListView: {marginBottom: windowHeight(50), flex: 1, backgroundColor: Colors.background},
    footerView: {position: 'absolute', bottom: 0, flexDirection: 'row', alignItems: 'center', left: 0, right: 0, height: windowHeight(45), borderWidth: 1,
        backgroundColor: Colors.messageBG},
    inputView: {borderRadius: 12, borderWidth: 1, marginLeft: windowWidth(30), width: SCREEN_WIDTH/1.4, height: windowHeight(35), backgroundColor: Colors.textInput},
    suggestionListView: {position: 'absolute', bottom: windowHeight(35), left: 0, padding: 10, borderRadius: 12, borderWidth: 1, width: SCREEN_WIDTH/1.5,
        backgroundColor: Colors.background},
    sendTouch: {padding: 5, borderRadius: 30, marginLeft: windowWidth(20)}
})

export default ChatScreen
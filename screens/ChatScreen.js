import React, { useEffect, useState } from "react";
import { View, StyleSheet, Text, TouchableOpacity, ScrollView, FlatList, Image, TextInput, Modal, KeyboardAvoidingView } from 'react-native'
import { getAllMessages, getAllParticipants, postMessage } from "../axios/api";
import { useDispatch, useSelector } from "react-redux";
import { getAllMessagesAction, getAllParticipantsAction } from "../redux/slices/messagesSlice";
import { SCREEN_HEIGHT, SCREEN_WIDTH, windowHeight, windowWidth } from "../utilities/appConstants";
import moment from "moment";
import { useStore } from "../zustand/store";

const ChatScreen = () => {
    const Dispatch = useDispatch()
    // const { allMessages, allParticipants } = useSelector(state => state.messages)
    const [showBottomSheet, setShowBottomSheet] = useState({show: false, activeMessageIndex: 0, source: ''})
    const [userInput, setUserInput] = useState('')
    const [showSuggestions, setShowSuggestions] = useState(false)
    const [suggestions, setSuggestions] = useState([])
    const {allMessages, allParticipants, getAllMessages: getAllMessagesAction , getAllParticipants: getAllParticipantsAction} = useStore(state => state)
    
    // console.log(allMessages.slice(0, 2), allParticipants.slice(0, 1), showBottomSheet, suggestions, 'herses')

    console.log(allMessages.find(item => item.reactions.length), 'hesses');
    

    const sendMessage = async () => {
        await postMessage(userInput)
        setUserInput("")
        fetchData()
    }

    const fetchData = async () => {
        const response = await getAllMessages()
        const responseTwo = await getAllParticipants()

        if(response) getAllMessagesAction({allMessages: response})
        if(responseTwo) getAllParticipantsAction({allParticipants: responseTwo})
    }

    const handleMentionSelect = (userName) => {
        const words = userInput.split(' ')
        words[words.length - 1] = `@${userName} `
        setUserInput(words.join(' '))
        setShowSuggestions(false)
    };

    const renderSuggestions = ({item}) => {
        return(
            <TouchableOpacity onPress={() => handleMentionSelect(item)} style={{padding: 10}}><Text>{item}</Text></TouchableOpacity>
        )
    }

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

    const renderBottomSheet = ({item}) => {
        return(
            <View style={{flexDirection: 'row'}}>
                <Image source={{uri: item.avatarUrl}} style={{height: windowHeight(30), width: windowWidth(30), borderRadius: 30}} resizeMode="stretch"/>
                <Text>{item.name}</Text>
                <Text>{item.value}</Text>
            </View>
        )
    }

    const BottomSheet = () => {
        const activeMessage = allMessages[showBottomSheet.activeMessageIndex]
        return(
            <View style={{zIndex: 1, height: SCREEN_HEIGHT/3, width: SCREEN_WIDTH, borderWidth: 1, backgroundColor: 'white', position: 'absolute', bottom: 0, flex: 1}}>
                {showBottomSheet.source === "reaction" ?
                <FlatList data={activeMessage.reactions} renderItem={renderBottomSheet} keyExtractor={(_, index) => index.toString()}/>
                : showBottomSheet.source === "name" ?
                <View>
                    <Text>{activeMessage.name}</Text>
                    <Text>{activeMessage.bio}</Text>
                    <Text>{activeMessage.jobTitle}</Text>
                    <Text>{activeMessage.email}</Text>
                </View>
                :
                <View style={{alignItems: 'center', marginTop: windowHeight(20)}}>
                <Image source={{uri: activeMessage.avatarUrl}} style={{height: windowHeight(170), width: windowWidth(190), borderRadius: 100}} resizeMode="stretch"/>
                </View>
                 }
            </View>
        )
    }

    const renderAllMessages = ({item, index}) => {
        const isSameAuthor = index && item.authorUuid === allMessages[index-1].authorUuid
        const notSameDay = index && !(moment(item.sentAt).isSame(allMessages[index-1].sentAt, 'day'))
        return(
            <>
            {index === 1 &&
            <View style={{}}>
                <Text style={{textAlign: 'center'}}>{moment(item.sentAt).format("MMMM DD, yyyy")}</Text>
            </View>
            }
            <View style={{borderRadius: 10, padding: 5, paddingBottom: windowHeight(15), marginBottom: windowHeight(10),
                marginTop: windowHeight(isSameAuthor ? -5 : 10), marginLeft: windowWidth(45), width: SCREEN_WIDTH/1.5, borderWidth: 1}}>
                {item.replyToMessage &&
                    <View style={{borderRadius: 12, borderWidth: 1, width: "95%", marginVertical: windowHeight(5), alignSelf: 'center', padding: 5}}>
                        <Text>
                            {item.replyToMessage.name}
                        </Text>
                        <Text>
                            {item.replyToMessage.text}
                        </Text>
                    </View>
                }
                
                {isSameAuthor ? null
                :
                <TouchableOpacity onPress={() => setShowBottomSheet({show: true, activeMessageIndex: index, source: 'profileImage'})} style={{position: 'absolute', left: windowWidth(-35)}}>
                    <Image source={{uri: item.avatarUrl}} style={{height: windowHeight(30), width: windowWidth(30), borderRadius: 30}} resizeMode="stretch"/>
                </TouchableOpacity>
                }
                
                <View>
                    {!isSameAuthor && <TouchableOpacity onPress={() => setShowBottomSheet({show: true, activeMessageIndex: index, source: 'name'})}><Text>{item.name}</Text></TouchableOpacity>}
                    {/* {item.attachments.length &&
                    <Image source={{uri: item.attachments[0].url}} style={{height: windowHeight(200), width: windowWidth(240), borderRadius: 12}} resizeMode="cover"/>
                    } */}
                    <Text>{item.text}</Text>
                </View>

                
                <View style={{position: 'absolute', right: windowWidth(5), bottom: 0}}>
                    <Text>{item.edited ? "Edited " + moment(item.sentAt).format("hh:mm a") : moment(item.sentAt).format("hh:mm a")}</Text>
                </View>

                {item.reactions.length &&
                <TouchableOpacity onPress={() => setShowBottomSheet({show: true, activeMessageIndex: index, source: 'reaction'})} style={{position: 'absolute', bottom: 0, left: 0}}>
                    <Text>{item.reactions.map(item => item.value)}</Text>
                </TouchableOpacity>
                }
            </View>
            </>
        )
    }
    
    return(
        <View style={{flex: 1, backgroundColor: 'white'}}>
            {/* <KeyboardAvoidingView keyboardVerticalOffset={500} style={{flex: 1, backgroundColor: 'white'}}> */}
            <TouchableOpacity style={{marginTop: 50}} onPress={fetchData}><Text>Populate</Text></TouchableOpacity>
            {/* <ScrollView nestedScrollEnabled style={{flex: 1, backgroundColor: 'white'}}> */}
                <View style={{marginBottom: windowHeight(50), flex: 1, backgroundColor: 'white'}}>
                <FlatList data={allMessages} onRefresh={fetchData} refreshing={false}
                    renderItem={renderAllMessages} keyExtractor={(_, index) => index.toString()}/>
                </View>
                {showBottomSheet.show && (
                    <Modal
                    visible={showBottomSheet.show}
                    transparent={true}
                    animationType="slide"
                    onRequestClose={() => setShowBottomSheet({show: false, activeMessageIndex: 0, source: ''})}
                    hardwareAccelerated={true}
                    >
                        <BottomSheet/>
                    </Modal>
                )}
            {/* </ScrollView> */}
            
            <View style={{position: 'absolute', bottom: 0, flexDirection: 'row', alignItems: 'center', left: 0, right: 0, height: windowHeight(45), borderWidth: 1, backgroundColor: 'white'}}>
                <View style={{borderRadius: 12, borderWidth: 1, marginLeft: windowWidth(20), width: SCREEN_WIDTH/1.5, height: windowHeight(35)}}>
                    {suggestions.length && showSuggestions &&
                    <View style={{position: 'absolute', bottom: windowHeight(35), left: 0, padding: 10, borderRadius: 12, borderWidth: 1, width: SCREEN_WIDTH/1.5, backgroundColor: 'white'}}>
                        <FlatList data={suggestions} renderItem={renderSuggestions} keyExtractor={(_, index) => index.toString()}/>
                    </View>}
                    <TextInput value={userInput} onChangeText={handleInputChange} style={{}} placeholder="Message"/>
                </View>
                <TouchableOpacity disabled={!userInput} onPress={sendMessage} style={{padding: 5, borderRadius: 30, marginLeft: windowWidth(20)}}>
                    <Text>send</Text>
                </TouchableOpacity>
            </View>
            {/* </KeyboardAvoidingView> */}
        </View>
    )
}

export default ChatScreen
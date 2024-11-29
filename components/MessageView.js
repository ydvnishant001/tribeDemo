import React from 'react'
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { Colors, fontSizes, SCREEN_WIDTH, Strings, windowHeight, windowWidth } from '../utilities/appConstants'
import moment from 'moment'

const MessageView = ({item, index, isSameAuthor, notSameDay, setShowBottomSheet}) => {
    return(
        <>
            {notSameDay &&
            <View style={{backgroundColor: Colors.messageBG, marginVertical: windowHeight(5), paddingVertical: windowHeight(5)}}>
                <Text style={styles.dateText}>{moment(item.sentAt).format("MMMM DD, yyyy")}</Text>
            </View>
            }

            <View style={styles.mainView(isSameAuthor, item.reactions.length)}>
                {item.replyToMessage &&
                <View style={styles.replyTextView}>
                    <Text style={{fontFamily: Strings.latoRegular, color: Colors.replyName, paddingVertical: windowHeight(5), fontSize: fontSizes.FONT13}}>{item.replyToMessage.name}</Text>
                    <Text style={{fontFamily: Strings.latoRegular, color: Colors.replyMessage, fontSize: fontSizes.FONT13}}>{item.replyToMessage.text}</Text>
                </View>
                }
                
                {isSameAuthor ? null
                :
                <TouchableOpacity onPress={() => setShowBottomSheet({show: true, activeMessageIndex: index, source: 'profileImage'})} style={styles.profileImageTouch}>
                    <Image source={{uri: item.avatarUrl}} style={styles.profileImage} resizeMode="cover"/>
                </TouchableOpacity>
                }
                
                <View>
                    {!isSameAuthor &&
                    <TouchableOpacity style={{paddingVertical: windowHeight(5)}} onPress={() => setShowBottomSheet({show: true, activeMessageIndex: index, source: 'name'})}>
                        <Text style={{fontFamily: Strings.latoRegular, color: Colors.replyName, fontSize: fontSizes.FONT14}}>{item.name}</Text>
                    </TouchableOpacity>}
                    {/* {item.attachments.length &&
                    <Image source={{uri: item.attachments[0].url}} style={styles.messageImage} resizeMode="cover"/>
                    } */}
                    <Text style={{fontFamily: Strings.latoRegular, color: Colors.white, fontSize: fontSizes.FONT14}}>{item.text}</Text>
                </View>

                <View style={styles.timeView}>
                    <Text style={{fontFamily: Strings.latoRegular, color: Colors.grey, fontSize: fontSizes.FONT11}}>{item.edited ? "Edited " + moment(item.sentAt).format("hh:mm a") : moment(item.sentAt).format("hh:mm a")}</Text>
                </View>

                {item.reactions.length &&
                <TouchableOpacity onPress={() => setShowBottomSheet({show: true, activeMessageIndex: index, source: 'reaction'})} style={styles.reactionTouch}>
                    <Text>{item.reactions.length > 2 ? item.reactions.map(item => item.value).slice(0, 2) : item.reactions.map(item => item.value)}
                        <Text style={{fontFamily: Strings.latoRegular, color: Colors.placeholder, fontSize: fontSizes.FONT12}}>
                            {item.reactions.length > 2 ? "  " + item.reactions.length : ""}
                            </Text>
                    </Text>
                </TouchableOpacity>
                }
            </View>
            </>
    )
}

const styles = StyleSheet.create({
    dateText: {textAlign: 'center', fontFamily: Strings.latoRegular, color: Colors.placeholder, fontSize: fontSizes.FONT12},
    mainView: (isSameAuthor, reactions) => ({borderRadius: 10, padding: 5, paddingBottom: windowHeight(20), marginBottom: windowHeight(reactions ? 15 : 10),
        marginTop: windowHeight(isSameAuthor ? 0 : 10), marginLeft: windowWidth(45), width: SCREEN_WIDTH/1.5, borderWidth: 1, backgroundColor: Colors.messageBG,
        paddingHorizontal: windowWidth(10)}),
    replyTextView: {borderRadius: 12, borderWidth: 1, width: "95%", marginVertical: windowHeight(5), alignSelf: 'center', padding: 5, backgroundColor: Colors.replyText,
        paddingHorizontal: windowWidth(10)},
    profileImageTouch: {position: 'absolute', left: windowWidth(-38)},
    profileImage: {height: windowHeight(30), width: windowWidth(33), borderRadius: 30},
    messageImage: {height: windowHeight(200), width: windowWidth(240), borderRadius: 12},
    timeView: {position: 'absolute', right: windowWidth(10), bottom: windowHeight(2)},
    reactionTouch: {position: 'absolute', bottom: windowHeight(-15), left: windowWidth(10), backgroundColor: Colors.messageBG, paddingVertical: windowHeight(2),
        paddingHorizontal: windowWidth(7), borderWidth: 1, borderRadius: 12}
})

export default MessageView
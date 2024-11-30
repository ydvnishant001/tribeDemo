import React from 'react'
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { Colors, fontSizes, isIOS, SCREEN_WIDTH, Strings, windowHeight, windowWidth } from '../utilities/appConstants'
import moment from 'moment'

const MessageView = ({item: message, index, isSameAuthor, notSameDay, setShowBottomSheet}) => {
    const reactionsLength = message.reactions.length
    return(
        <>
            {notSameDay &&
            <View style={styles.dateView}><Text allowFontScaling={false} style={styles.dateText}>{moment(message.sentAt).format(Strings.dateFormat)}</Text></View>
            }

            <View style={styles.mainView(isSameAuthor, reactionsLength, message.authorUuid)}>
                {message.replyToMessage &&
                <View style={styles.replyTextView(message.authorUuid)}>
                    <Text allowFontScaling={false} style={styles.replyName}>{message.replyToMessage.name}</Text>
                    <Text allowFontScaling={false} style={styles.replyMessage}>{message.replyToMessage.text}</Text>
                </View>
                }
                
                {isSameAuthor || message.authorUuid === Strings.you ? null
                :
                <TouchableOpacity onPress={() => setShowBottomSheet({show: true, activeMessageIndex: index, source: Strings.profileImage})} style={styles.profileImageTouch}>
                    <Image source={{uri: message.avatarUrl}} style={styles.profileImage} resizeMode={Strings.cover}/>
                </TouchableOpacity>
                }
                
                <View>
                    {!isSameAuthor && message.authorUuid !== Strings.you &&
                    <TouchableOpacity style={{paddingVertical: windowHeight(5)}} onPress={() => setShowBottomSheet({show: true, activeMessageIndex: index, source: Strings.name})}>
                        <Text allowFontScaling={false} style={styles.name}>{message.name}</Text>
                    </TouchableOpacity>
                    }
                    {message.attachments.length &&
                    <Image source={{uri: message.attachments[0].url}} style={styles.messageImage} resizeMode={Strings.cover}/>
                    }
                    <Text allowFontScaling={false} style={styles.text}>{message.text}</Text>
                </View>

                <View style={styles.timeView}>
                    <Text allowFontScaling={false} style={styles.time(message.authorUuid)}>
                        {message.edited ? Strings.edited + moment(message.sentAt).format(Strings.timeFormat) : moment(message.sentAt).format(Strings.timeFormat)}
                    </Text>
                </View>

                {reactionsLength &&
                <TouchableOpacity onPress={() => setShowBottomSheet({show: true, activeMessageIndex: index, source: Strings.reaction})} style={styles.reactionTouch}>
                    <Text allowFontScaling={false}>{reactionsLength > 2 ? message.reactions.map(reaction => reaction.value).slice(0, 2) : message.reactions.map(reaction => reaction.value)}
                        <Text allowFontScaling={false} style={styles.reactionCount}>{reactionsLength > 2 ? "  " + reactionsLength : ""}</Text>
                    </Text>
                </TouchableOpacity>
                }
            </View>
            </>
    )
}

const styles = StyleSheet.create({
    dateView: {backgroundColor: Colors.messageBG, marginVertical: windowHeight(5), paddingVertical: windowHeight(5)},
    dateText: {textAlign: Strings.center, fontFamily: Strings.latoRegular, color: Colors.placeholder, fontSize: fontSizes.FONT14},
    mainView: (isSameAuthor, reactions, id) => ({borderRadius: 10, padding: 5, alignSelf: id === Strings.you ? Strings.flexEnd : Strings.flexStart,
        paddingBottom: windowHeight(20), backgroundColor: id === Strings.you ? Colors.placeholder : Colors.messageBG, paddingHorizontal: windowWidth(10), borderWidth: 1,
        marginBottom: windowHeight(reactions ? 15 : 10), marginTop: windowHeight(isSameAuthor ? 0 : 10), marginLeft: windowWidth(50), width: SCREEN_WIDTH/1.5}),
    replyName: {fontFamily: Strings.latoRegular, color: Colors.replyName, paddingVertical: windowHeight(5), fontSize: fontSizes.FONT14},
    replyMessage: {fontFamily: Strings.latoRegular, color: Colors.replyMessage, fontSize: fontSizes.FONT14},
    replyTextView: (id) => ({borderRadius: 12, borderWidth: 1, width: "95%", marginVertical: windowHeight(5), alignSelf: Strings.center, padding: 5,
        paddingHorizontal: windowWidth(10), backgroundColor: id === Strings.you ? Colors.textInput : Colors.replyText}),
    profileImageTouch: {position: Strings.absolute, left: windowWidth(isIOS ? -43 : -41)},
    profileImage: {height: windowHeight(isIOS ? 29 : 30), width: windowWidth(isIOS ? 36 : 33), borderRadius: 30},
    name: {fontFamily: Strings.latoRegular, color: Colors.replyName, fontSize: fontSizes.FONT15},
    text: {fontFamily: Strings.latoRegular, color: Colors.white, fontSize: fontSizes.FONT15},
    time: (id) => ({fontFamily: Strings.latoRegular, color: id === Strings.you ? Colors.messageBG : Colors.grey, fontSize: fontSizes.FONT12}),
    messageImage: {height: windowHeight(200), width: windowWidth(227), marginBottom: windowHeight(10), marginTop: windowHeight(5), borderRadius: 12},
    timeView: {position: Strings.absolute, right: windowWidth(10), bottom: windowHeight(2)},
    reactionTouch: {position: Strings.absolute, bottom: windowHeight(-15), left: windowWidth(10), backgroundColor: Colors.messageBG, paddingVertical: windowHeight(2),
        paddingHorizontal: windowWidth(7), borderWidth: 1, borderRadius: 12},
    reactionCount: {fontFamily: Strings.latoRegular, color: Colors.placeholder, fontSize: fontSizes.FONT13}
})

export default MessageView
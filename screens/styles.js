import { StyleSheet } from 'react-native'
import {Colors, fontSizes, isIOS, SCREEN_HEIGHT, SCREEN_WIDTH, Strings, windowHeight, windowWidth } from "../utilities/appConstants";

export default styles = StyleSheet.create({
    loaderView: {justifyContent: Strings.center, alignItems: Strings.center, position: Strings.absolute, alignSelf: Strings.center, top: SCREEN_HEIGHT/2, zIndex: 1,
        backgroundColor: Colors.white, height: 100, width: 100, borderRadius: 15},
    mainView: {flex: 1, backgroundColor: Colors.background},
    headerView: {paddingHorizontal: windowWidth(20), paddingTop: windowHeight(isIOS ? 40 : 15), paddingBottom: windowHeight(isIOS ? 10 : 15), flexDirection: Strings.row,
        alignItems: Strings.center, backgroundColor: Colors.messageBG, marginTop: windowHeight(isIOS ? 0 : 25)},
    headerText: {fontFamily: Strings.latoBold, color: Colors.replyName, fontSize: fontSizes.FONT20, marginLeft: windowWidth(15), width: windowWidth(55)},
    suggestionListItemTouch: {padding: 10, flexDirection: Strings.row, alignItems: Strings.center},
    profileImage: {height: windowHeight(30), width: windowWidth(33), borderRadius: 30},
    suggestion: {fontFamily: Strings.latoRegular, color: Colors.white, fontSize: fontSizes.FONT14, marginLeft: windowWidth(10), width: windowWidth(150)},
    messageListView: {marginBottom: windowHeight(50), flex: 1, backgroundColor: Colors.background},
    footerView: {position: Strings.absolute, bottom: 0, flexDirection: Strings.row, alignItems: Strings.center, left: 0, right: 0, height: windowHeight(isIOS ? 55 : 50),
        borderWidth: 1, backgroundColor: Colors.messageBG, paddingBottom: windowWidth(isIOS ? 15 : 0)},
    inputView: {borderRadius: 12, borderWidth: 1, marginLeft: windowWidth(30), width: SCREEN_WIDTH/1.4, height: windowHeight(35),
        backgroundColor: Colors.textInput},
    textInput: {paddingLeft: windowWidth(20), fontFamily: Strings.latoRegular, color: Colors.white, height: windowHeight(35)},
    suggestionListView: {position: Strings.absolute, bottom: windowHeight(35), left: 0, padding: 10, borderRadius: 12, borderWidth: 1, width: SCREEN_WIDTH/1.5,
        height: windowHeight(200), backgroundColor: Colors.background},
    sendTouch: {padding: 5, borderRadius: 30, marginLeft: windowWidth(20)},
    scrollIcon: {padding: 5, position: Strings.absolute, right: windowWidth(10), top: windowHeight(isIOS ? 35 : 13)}
})
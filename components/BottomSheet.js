import React from "react";
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Colors, fontSizes, isIOS, SCREEN_HEIGHT, SCREEN_WIDTH, Strings, windowHeight, windowWidth } from "../utilities/appConstants";
import { Icons } from "../assets/icons/Icons";

const BottomSheet = ({allMessages, showBottomSheet, dismissBottomSheet}) => {
    const activeMessage = allMessages[showBottomSheet.activeMessageIndex]
    
    const renderBottomSheet = ({item}) => {
        return(
            <View style={styles.reactionView}>
                <Image source={{uri: item.avatarUrl}} style={styles.reactorImage} resizeMode={Strings.cover}/>
                <Text allowFontScaling={false} style={styles.reactorName}>{item.name}</Text>
                <Text allowFontScaling={false}>{item.value}</Text>
            </View>
        )
    }

        return(
            <View style={styles.mainView}>
                <>
                <TouchableOpacity onPress={dismissBottomSheet} style={styles.closeTouch}>
                    <Icons.closeSvg width={windowWidth(30)} height={windowWidth(30)}/>
                </TouchableOpacity>
                
                {showBottomSheet.source === Strings.reaction ?
                <FlatList data={activeMessage.reactions} renderItem={renderBottomSheet} keyExtractor={(_, index) => index.toString()}/>
                : showBottomSheet.source === Strings.name ?
                <View style={{marginLeft: windowWidth(isIOS ? 20 : 10), paddingBottom: windowHeight(10)}}>
                    <Text allowFontScaling={false} numberOfLines={1} style={styles.info}>{activeMessage.name}
                        <Text allowFontScaling={false} style={styles.bio}>{` (${activeMessage.bio})`}</Text>
                    </Text>
                    <Text allowFontScaling={false} numberOfLines={1} style={styles.info}>{activeMessage.jobTitle}</Text>
                    <Text allowFontScaling={false} numberOfLines={1} style={styles.email}>{activeMessage.email}</Text>
                </View>
                :
                <View style={styles.profileImageView}>
                    <Image source={{uri: activeMessage.avatarUrl}} style={styles.profileImage} resizeMode={Strings.cover}/>
                </View>
                }
                </>
            </View>
        )
}

const styles = StyleSheet.create({
    mainView: { width: SCREEN_WIDTH, borderWidth: 1, backgroundColor: Colors.background, position: Strings.absolute, bottom: 0, flex: 1,
        paddingBottom: windowHeight(20), paddingTop: windowHeight(25), paddingHorizontal: windowWidth(15)},
    closeTouch: {position: Strings.absolute, top: 0, right: windowWidth(5), paddingBottom: windowHeight(3), paddingHorizontal: windowWidth(5)},
    info: {fontFamily: Strings.latoRegular, color: Colors.white, fontSize: fontSizes.FONT15, marginBottom: windowHeight(10)},
    bio: {fontFamily: Strings.latoRegular, color: Colors.placeholder, fontSize: fontSizes.FONT15, marginBottom: windowHeight(10)},
    email: {fontFamily: Strings.latoRegular, color: Colors.white, fontSize: fontSizes.FONT15},
    profileImageView: {alignItems: Strings.center, marginTop: windowHeight(5)},
    profileImage: {height: windowHeight(170), width: windowWidth(isIOS ? 210 : 190), borderRadius: 200},
    reactionView: {flexDirection: Strings.row, alignItems: Strings.center, marginBottom: windowHeight(10)},
    reactorImage: {height: windowHeight(isIOS ? 29 : 30), width: windowWidth(isIOS ? 36 : 33), borderRadius: 30},
    reactorName: {fontFamily: Strings.latoRegular, color: Colors.white, fontSize: fontSizes.FONT15, marginHorizontal: windowWidth(10)},
})

export default BottomSheet
import React from "react";
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Colors, fontSizes, SCREEN_HEIGHT, SCREEN_WIDTH, Strings, windowHeight, windowWidth } from "../utilities/appConstants";
import { Icons } from "../assets/icons/Icons";

const BottomSheet = ({allMessages, showBottomSheet, setShowBottomSheet}) => {
    const activeMessage = allMessages[showBottomSheet.activeMessageIndex]
    
    const renderBottomSheet = ({item}) => {
        return(
            <View style={{flexDirection: 'row'}}>
                <Image source={{uri: item.avatarUrl}} style={{height: windowHeight(30), width: windowWidth(33), borderRadius: 30}} resizeMode="cover"/>
                <Text style={{fontFamily: Strings.latoRegular, color: Colors.white, fontSize: fontSizes.FONT12}}>{item.name}</Text>
                <Text>{item.value}</Text>
            </View>
        )
    }

        return(
            <View style={styles.mainView}>
                <>
                <TouchableOpacity onPress={() => setShowBottomSheet({show: false, activeMessageIndex: 0, source: ''})} style={{position: 'absolute', top: 0, right: windowWidth(5), paddingBottom: windowHeight(3), paddingHorizontal: windowWidth(5)}}>
                    <Icons.closeSvg width={windowWidth(30)} height={windowWidth(30)}/>
                </TouchableOpacity>
                {showBottomSheet.source === "reaction" ?
                <FlatList data={activeMessage.reactions} renderItem={renderBottomSheet} keyExtractor={(_, index) => index.toString()}/>
                : showBottomSheet.source === "name" ?
                <View style={{}}>
                    <Text numberOfLines={1} style={{fontFamily: Strings.latoRegular, color: Colors.white, fontSize: fontSizes.FONT15, marginBottom: windowHeight(10)}}>{activeMessage.name}
                        <Text style={{fontFamily: Strings.latoRegular, color: Colors.placeholder, fontSize: fontSizes.FONT15, marginBottom: windowHeight(10)}}>
                            {` (${activeMessage.bio})`}
                            </Text>
                    </Text>
                    <Text numberOfLines={1} style={{fontFamily: Strings.latoRegular, color: Colors.white, fontSize: fontSizes.FONT15, marginBottom: windowHeight(10)}}>{activeMessage.jobTitle}</Text>
                    <Text numberOfLines={1} style={{fontFamily: Strings.latoRegular, color: Colors.white, fontSize: fontSizes.FONT15}}>{activeMessage.email}</Text>
                </View>
                :
                <View style={styles.profileImageView}>
                    <Image source={{uri: activeMessage.avatarUrl}} style={styles.profileImage} resizeMode="cover"/>
                </View>
                 }
                 </>
            </View>
        )
}

const styles = StyleSheet.create({
    mainView: { width: SCREEN_WIDTH, borderWidth: 1, backgroundColor: Colors.background, position: 'absolute', bottom: 0, flex: 1,
        paddingBottom: windowHeight(20), paddingTop: windowHeight(25), paddingHorizontal: windowWidth(15)},
    profileImageView: {alignItems: 'center', marginTop: windowHeight(20)},
    profileImage: {height: windowHeight(170), width: windowWidth(190), borderRadius: 100}
})

export default BottomSheet
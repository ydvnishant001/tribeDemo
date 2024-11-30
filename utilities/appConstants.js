import { Dimensions, PixelRatio, Platform } from "react-native";

export const SCREEN_HEIGHT = Dimensions.get("window").height;
export const SCREEN_WIDTH = Dimensions.get("window").width;

export const windowHeight = (height) => {
  let tempHeight = SCREEN_HEIGHT * parseFloat(height / 667);
  return PixelRatio.roundToNearestPixel(tempHeight);
};

export const windowWidth = (width) => {
  let tempWidth = SCREEN_WIDTH * parseFloat(width / 375);
  return PixelRatio.roundToNearestPixel(tempWidth);
};

export const isIOS = Platform.OS === 'ios' ? true : false

export const fontSizes = {
  FONT11: windowWidth(11),
  FONT12: windowWidth(12),
  FONT13: windowWidth(13),
  FONT14: windowWidth(14),
  FONT15: windowWidth(15),
  FONT20: windowWidth(20),
};

export const Strings = {
  latoRegular: "Lato-Regular",
  latoBold: "Lato-Bold",
  dateFormat: "MMMM DD, yyyy",
  timeFormat: "hh:mm A",
  you: "you",
  profileImage: "profileImage",
  cover: "cover",
  name: "name",
  reaction: "reaction",
  edited: "Edited  ",
  center: "center",
  absolute: "absolute",
  flexEnd: "flex-end",
  flexStart: "flex-Start",
  day: "day",
  tribe: "Tribe",
  slide: "slide",
  message: "Message",
  row: "row",
  handled: "handled",
  tribeLocalStore: "tribeLocalStore",
  large: "large"
}

export const Colors = {
  background: "#0A141A",
  white: "#ffffff",
  grey: "#A6ABAD",
  messageBG: "#1F2C33",
  textInput: "#2A3942",
  placeholder: "#8696A0",
  replyText: "#1D282F",
  replyMessage: "#A4A9AB",
  replyName: "#52BDEB",
}

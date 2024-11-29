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

export const HaveNotch = Platform.OS && SCREEN_HEIGHT >= 812;

export const isIOS = Platform.OS === 'ios' ? true : false

export const isAndroid = Platform.OS === 'android' ? true : false

export const fontSizes = {
  FONT6: windowWidth(6),
  FONT8: windowWidth(8),
  FONT9: windowWidth(9),
  FONT10: windowWidth(10),
  FONT11: windowWidth(11),
  FONT12: windowWidth(12),
  FONT12_5: windowWidth(12.5),
  FONT13: windowWidth(13),
  FONT14: windowWidth(14),
  FONT15: windowWidth(15),
  FONT16: windowWidth(16),
  FONT17: windowWidth(17),
  FONT18: windowWidth(18),
  FONT19: windowWidth(19),
  FONT20: windowWidth(20),
  FONT22: windowWidth(22),
  FONT23: windowWidth(23),
  FONT24: windowWidth(24),
  FONT25: windowWidth(25),
  FONT26: windowWidth(26),
  FONT28: windowWidth(28),
  FONT30: windowWidth(30),
  FONT32: windowWidth(32),
  FONT34: windowWidth(34),
  FONT35: windowWidth(35),
  FONT36: windowWidth(36),
  FONT38: windowWidth(38),
  FONT42: windowWidth(42),
  FONT44: windowWidth(44),
  FONT50: windowWidth(50),
  FONT100: windowWidth(100),
  FONT120: windowWidth(120),
};

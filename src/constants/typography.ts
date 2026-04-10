import { Platform } from 'react-native';

export const fontFamily = {
  pretendard: {
    bold: Platform.select({ ios: 'Pretendard-Bold', android: 'Pretendard-Bold' }),
    extraBold: Platform.select({ ios: 'Pretendard-ExtraBold', android: 'Pretendard-ExtraBold' }),
    semiBold: Platform.select({ ios: 'Pretendard-SemiBold', android: 'Pretendard-SemiBold' }),
    medium: Platform.select({ ios: 'Pretendard-Medium', android: 'Pretendard-Medium' }),
    regular: Platform.select({ ios: 'Pretendard-Regular', android: 'Pretendard-Regular' }),
  },
  urbanist: {
    bold: Platform.select({ ios: 'Urbanist-Bold', android: 'Urbanist-Bold' }),
    extraBold: Platform.select({ ios: 'Urbanist-ExtraBold', android: 'Urbanist-ExtraBold' }),
    semiBold: Platform.select({ ios: 'Urbanist-SemiBold', android: 'Urbanist-SemiBold' }),
    medium: Platform.select({ ios: 'Urbanist-Medium', android: 'Urbanist-Medium' }),
    regular: Platform.select({ ios: 'Urbanist-Regular', android: 'Urbanist-Regular' }),
  },
} as const;

export const typography = {
  display1: { fontSize: 32, fontFamily: fontFamily.pretendard.bold },
  display2: { fontSize: 28, fontFamily: fontFamily.pretendard.extraBold },
  display3: { fontSize: 28, fontFamily: fontFamily.pretendard.bold },
  display4: { fontSize: 28, fontFamily: fontFamily.pretendard.semiBold },
  display5: { fontSize: 24, fontFamily: fontFamily.pretendard.bold },
  display6: { fontSize: 24, fontFamily: fontFamily.pretendard.semiBold },
  display7: { fontSize: 24, fontFamily: fontFamily.pretendard.medium },

  body1: { fontSize: 20, fontFamily: fontFamily.pretendard.bold },
  body2: { fontSize: 20, fontFamily: fontFamily.pretendard.semiBold },
  body3: { fontSize: 16, fontFamily: fontFamily.pretendard.bold },
  body4: { fontSize: 16, fontFamily: fontFamily.pretendard.bold },
  body5: { fontSize: 16, fontFamily: fontFamily.pretendard.semiBold },
  body6: { fontSize: 16, fontFamily: fontFamily.pretendard.medium },
  body7: { fontSize: 14, fontFamily: fontFamily.pretendard.bold },
  body8: { fontSize: 14, fontFamily: fontFamily.pretendard.semiBold },
  body9: { fontSize: 14, fontFamily: fontFamily.pretendard.medium },

  label1: { fontSize: 12, fontFamily: fontFamily.pretendard.semiBold },
  label2: { fontSize: 12, fontFamily: fontFamily.pretendard.medium },
  label3: { fontSize: 12, fontFamily: fontFamily.pretendard.regular },
} as const;

export type Typography = typeof typography;
'use strict';
import { Platform, StyleSheet } from 'react-native';

export default StyleSheet.create({
  /* --CONTAINERS-- */
  container: {
    backgroundColor: '#F3F3F3',
    flex: 1,
  },
  centeredContent: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  mainContent: {
    alignItems: 'center',
    flex: 1,
  },
  horizontalPaddedContainer: {
    paddingHorizontal: 16
  },
  leftPaddedContainer: {
    paddingLeft: 16
  },
  topPaddedContainer: {
    paddingTop: 16
  },

  /* --HEADER-- */
  header: {
    fontSize: 20,
    fontWeight: '700',
    fontFamily: 'System',
    textAlign: 'center',
  },

  /* --FLEX-- */
  flexCenter: {
    alignItems: 'center'
  },
  flexEnd: {
    alignItems: 'flex-end'
  },
  flexStart: {
    alignItems: 'flex-start'
  },

  /* --BUTTONS-- */
  dangerButton: {
    alignItems: 'center',
    backgroundColor: '#E30425',
    justifyContent: 'center',
  },
  defaultButton: {
    alignItems: 'center',
    backgroundColor: '#8E9092',
    justifyContent: 'center',
  },
  violetButton: {
    alignItems: 'center',
    backgroundColor: '#5856D6',
    justifyContent: 'center',
  },
  bottomPrimaryButtonText: {
    paddingVertical: 15
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontFamily: 'System',
    fontSize: 14,
    textAlign: 'center',
  },

  /* --BACKGROUND COLORS-- */
  standardBackground: {
    backgroundColor: '#F3F3F3'
  },
  whiteBackground: {
    backgroundColor: '#F9F9F9'
  },

  /* --BORDERS-- */
  darkGrayBorder: {
    borderColor: '#8E9092',
    borderRadius: 5,
    borderWidth: 1,
  },
  darkGrayBorderBottom: {
    borderBottomColor: '#8E9092',
    borderBottomWidth: 1
  },
  darkGrayBorderTop: {
    borderTopColor: '#8E9092',
    borderTopWidth: 1
  },
  grayBorder: {
    borderColor: '#E3E3E3',
    borderRadius: 5,
    borderWidth: 1,
  },
  grayBorderBottom: {
    borderBottomColor: '#E3E3E3',
    borderBottomWidth: 1
  },
  grayBorderTop: {
    borderTopColor: '#E3E3E3',
    borderTopWidth: 1
  },
  lightGrayBorder: {
    borderColor: '#C6C7CA',
    borderRadius: 5,
    borderWidth: 1,
  },
  lightGrayBorderBottom: {
    borderBottomColor: '#C6C7CA',
    borderBottomWidth: 1,
  },
  lightGrayBorderTop: {
    borderTopColor: '#C6C7CA',
    borderTopWidth: 1
  },

  /* --TEXTS-- */
  largeText: {
    fontFamily: 'System',
    fontSize: 24,
  },
  regularMediumText: {
    fontFamily: 'System',
    fontSize: 17
  },
  regularText: {
    fontFamily: 'System',
    fontSize: 16
  },
  smallText: {
    fontFamily: 'System',
    fontSize: 14
  },
  smallestText: {
    fontFamily: 'System',
    fontSize: 12,
  },
  strongestText: {
    fontWeight: '900'
  },
  strongerText: {
    fontWeight: '700'
  },
  strongText: {
    fontWeight: '600'
  },
  centerText: {
    textAlign: 'center'
  },
  rightText: {
    textAlign: 'right'
  },
  formLabel: {
    marginTop: 15
  },

  /* --TEXT COLORS-- */
  blackText: {
    color: '#000000'
  },
  blueText: {
    color: '#007AFF'
  },
  darkText: {
    color: '#3A3F43'
  },
  darkBlueText: {
    color: '#5856D6'
  },
  darkGreenText: {
    color: '#689F39'
  },
  darkGrayText: {
    color: '#535353'
  },
  darkerGrayText: {
    color: '#1A2125'
  },
  grayText: {
    color: '#8E9092'
  },
  greenText: {
    color: '#86C232'
  },
  lightBlueText: {
    color: '#019AE8'
  },
  pinkText: {
    color: '#FF2D55'
  },
  redText: {
    color: '#FF3B30'
  },
  violetText: {
    color: '#5856D6'
  },
  whiteText: {
    color: '#FFFFFF'
  },

  /* --TEXT INPUTS-- */
  textInput: {
    padding: 10,
    width: '100%'
  },
  textInputLeftContainer: {
    position: 'absolute',
    right: 5,
    top: 9
  },
  iconTextInput: {
    flex: 1,
    paddingLeft: 30
  },
  iconTextInputContainer: {
    flex: 1,
    flexDirection: 'row'
  },


  /* --SELECT-- */
  selectInput: {
    backgroundColor: 'transparent',
    flexDirection: 'row',
    height: 42,
    paddingLeft: 7,
    paddingVertical: 12,
    width: '100%'
  },
  selectInputAndroid: {
    height: 42,
    width: '92%'
  },
  selectInputLabel: {
    // color: '#3A3F43',
    // fontSize: 14,
    // fontFamily: 'System',
    // textAlign: 'right',
  },
  selectInputBoxArrowDown: {
    position: 'absolute',
    right: 10,
    top: 10
  },

  /* --ERROR-- */
  error: {
    color: 'red',
    fontFamily: 'System',
    fontSize: 14,
    paddingVertical: 5
  },

  /* --Components-- */
  marginedContent: {
    marginHorizontal: 20,
    marginVertical: 20
  },
  marginedHorizontalContent: {
    marginHorizontal: 16
  },
  paddedContent: {
    paddingHorizontal: 20,
    paddingVertical: 20
  },
  paddedVerticalContent: {
    paddingVertical: 20
  },
  tokenItemComponent: {
    backgroundColor: '#FFF',
    borderRadius: 5,
    marginBottom: 10,
    padding: 10,
    shadowOffset:{  height: 5,  width: 5,  },
    shadowColor: '#ccc',
    shadowOpacity: 0.5,
    width: '100%',
  },
  tokenItemContainer: {
    flexDirection: 'row',
    marginVertical: 5,
    // marginBottom: 10
  },

  /* --Platform Specific-- */
  ...Platform.select({
    android: {
      /* --BUTTON-- */
      primaryButton: {
        alignItems: 'center',
        backgroundColor: '#019AE8',
        justifyContent: 'center',
      },

      /* --TEXT-- */
      largestText: {
        fontFamily: 'System',
        fontSize: 24
      },
      mediumText: {
        fontFamily: 'System',
        fontSize: 18,
      },

      /* --TEXT INPUT-- */
      textInput: {
        borderBottomColor: '#C6C7CA',
        borderBottomWidth: 1,
        color: '#3A3F43',
        fontFamily: 'System',
        fontSize: 16,
        padding: 10,
        paddingTop: 5,
        paddingBottom: 10,
        width: '100%'
      },
      textInputContainer: {
        borderBottomColor: '#C6C7CA',
        borderBottomWidth: 1,
        padding: 10,
        paddingTop: 5,
        paddingBottom: 10,
        width: '100%'
      },
      iconTextInputLeft: {
        position: 'absolute',
        left: 10,
        top: 10
      },

      /* --SELECT BOX-- */
      selectInputBox: {
        borderBottomColor: '#C6C7CA',
        borderBottomWidth: 1,
        flex: 0,
        flexDirection: 'row',
      },
      selectInputIcon: {
        paddingLeft: 10,
        paddingTop: 15
      },

      /* --CUSTOM-- */
      qrContainer: {
        position: 'absolute',
        right: 10,
        top: 0,
      },
    },

    ios: {
      /* --BUTTON-- */
      primaryButton: {
        alignItems: 'center',
        backgroundColor: '#007AFF',
        justifyContent: 'center',
      },

      /* --TEXT-- */
      largestText: {
        fontFamily: 'System',
        fontSize: 30
      },
      largerText: {
        fontFamily: 'System',
        fontSize: 24,
      },
      mediumText: {
        fontFamily: 'System',
        fontSize: 20,
      },

      /* --TEXT INPUT-- */
      textInput: {
        borderColor: '#C6C7CA',
        borderWidth: 1,
        borderRadius: 5,
        color: '#3A3F43',
        fontFamily: 'System',
        fontSize: 14,
        marginTop: 5,
        padding: 10,
        paddingTop: 15,
        paddingBottom: 15,
        width: '100%'
      },
      textInputContainer: {
        borderColor: '#C6C7CA',
        borderWidth: 1,
        borderRadius: 5,
        marginTop: 5,
        padding: 10,
        paddingTop: 15,
        paddingBottom: 15,
        width: '100%'
      },
      iconTextInputLeft: {
        position: 'absolute',
        left: 10,
        top: 20
      },

      /* --SELECT BOX-- */
      selectInputBox: {
        borderColor: '#C6C7CA',
        borderRadius: 5,
        borderWidth: 1,
        flex:0,
        flexDirection: 'row',
        marginTop: 10,
        paddingLeft: 10,
        paddingRight: 40,
      },
      selectInputIcon: {
        paddingTop: 12
      },

      /* --CUSTOM-- */
      qrContainer: {
        position: 'absolute',
        right: 10,
        top: 11
      }
    },
  })
});

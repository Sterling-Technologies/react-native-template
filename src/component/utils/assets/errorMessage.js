'use strict';
import { Dimensions, Platform, StyleSheet } from 'react-native';

// Get device width
const deviceWidth = Dimensions.get('window').width;
// Get device height
const deviceHeight = Dimensions.get('window').height;

export default StyleSheet.create({
  defaultButtonStyle: {
    borderRadius: 5
  },

  defaultButtonContainerStyle: {
    width: deviceWidth
  },

  defaultContentStyle: {
    marginBottom: 15
  },

  defaultImageStyle: {
    height: 160, 
    marginBottom: 15,
    width: 160, 
  },

  defaultTitleStyle: {
    fontFamily: 'System',
    fontSize: 32, 
    marginBottom: 15
  },
});

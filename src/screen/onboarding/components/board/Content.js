// Dependencies
import React, { Component } from 'react';

// Native dependencies
import {
  Dimensions,
  Image,
  StyleSheet,
  TouchableOpacity,
  Text,
  View
} from 'react-native';

// Expo
import { Constants } from 'expo';

// Get device width
const deviceWidth = Dimensions.get('window').width;
// Get device height
const deviceHeight = Dimensions.get('window').height;

// Defaults
const defaults = {
  nextColor: '#FFF',
  nextBackground: 'transparent',
  nextText: 'Next'
}

/**
 * Board Content Component
 *
 * @type {*Object}
 */
class Content extends Component {
  /**
   * Initialize props and state
   *
   * @param {Object} props
   */
  constructor(props) {
    super(props);

    this.state = {
      backgroundColor: props.backgroundColor ? props.backgroundColor : '#FFF',
      titleColor: props.titleColor ? props.titleColor : '#000',
      subtitleColor: props.subtitleColor ? props.subtitleColor : '#000',
      image: props.image,
      title: props.title,
      subtitle: props.subtitle,
      nextBackground: props.nextBackground ? props.nextBackground : defaults.nextBackground,
      nextColor: props.nextColor ? props.nextColor : defaults.nextColor,
      nextText: props.nextText ? props.nextText : defaults.nextText,
    }
  }

  /**
   * Renders the component
   */
  render() {
    return (
      <View style={[styles.container, { backgroundColor: this.state.backgroundColor }]}>
        <Image
          style={styles.image}
          resizeMode='contain'
          source={this.state.image}
        />
        <Text style={[styles.title, { color: this.state.titleColor }]}>{this.state.title}</Text>
        <Text style={[styles.subtitle, { color: this.state.subtitleColor }]}>{this.state.subtitle}</Text>

        <TouchableOpacity
          style={[styles.nextButton, {
            backgroundColor: this.state.nextBackground
          }]}
          onPress={this.props.onNext}
        >
          <View>
            <Text
              style={{
                color: this.state.nextColor,
                fontSize: 12
              }}
            >{this.state.nextText}</Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    height: deviceHeight,
    justifyContent: 'center',
    paddingTop: Constants.statusBarHeight,
    position: 'relative',
    width: deviceWidth
  },
  image: {
    height: 300,
    marginTop: -80,
    marginBottom: deviceHeight < 640 ? 20 : 50,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 15,
    marginBottom: deviceHeight < 640 ? 25 : 40,
    textAlign: 'center',
    width: 220
  },
  subtitle: {
    fontSize: 11,
    textAlign: 'center',
    width: 280
  },
  nextButton: {
    alignItems: 'center',
    borderRadius: 5,
    bottom: 40,
    justifyContent: 'center',
    padding: 10,
    position: 'absolute',
    width: '90%'
  }
});

export default Content;

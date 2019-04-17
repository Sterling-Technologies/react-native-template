// Dependencies
import React, { Component } from 'react';

// React Native
import {
  Alert,
  ActivityIndicator,
  Image,
  Platform,
  StyleSheet,
  TouchableOpacity,
  Text,
  View
} from 'react-native';

// Expo
import { Constants, LocalAuthentication } from 'expo';

// Status icon list
const icons = {
  default: require('./assets/android-fingerprint.png'),
  error: require('./assets/android-not-recognized.png'),
  success: require('./assets/android-recognized.png')
};

// Status messages
const messages = {
  default: 'Touch Sensor',
  too_fast: 'That was too fast!',
  insufficient: 'Make sure to cover the entire sensor',
  fail: 'An error occured, please try again',
  success: 'Fingerprint recognized',
  error: 'Fingerprint not recognized. Try again'
};

// Noop
const noop = () => {};

// Defaults
const defaults = {
  title: 'Fingerprint Login',
  subtitle: 'Use your fingerprint for faster easier access to your account',
  iosSubtitle: 'Activate touch ID for this App'
};

/**
 * Finger Print / Touch ID Scanner Component
 */
class FingerPrint extends Component {
  /**
   * Initialize state and props
   *
   * @param {*Object} props
   */
  constructor(props) {
    super(props);

    this.state = {
      error: false,
      message: messages.default,
      icon: icons.default,
      success: false,
      load: false,
      scanning: false
    };
  }

  /**
   * On component receive props
   *
   * @param {*Object} props
   */
  componentWillReceiveProps(props) {
    // Load changed?
    if (this.state.load !== props.load) {
      // Update load status
      this.setState({ load: props.load });
    }

    // Should we load?
    if (props.load === true && !this.state.scanning) {
      // Start scanning
      this._scanFingerprint();
      // Set scanning state
      this.setState({ scanning: true });
    } else if (props.load === false) {
      // Set scanning state
      this.setState({ scanning: false });
    }
  }

  /**
   * Renders the Component
   */
  render() {
    // Should we load?
    if (this.state.load === false) {
      return (null);
    }

    return (
      <View style={styles.container}>
        {Platform.OS === 'ios' ? this._renderIOS() : this._renderAndroid()}
      </View>
    );
  }

  /**
   * Handles fingerprint scanning
   *
   * @return {Object}
   */
  async _scanFingerprint() {
    // If we are already scanning
    if (this.state.scanning) {
      return false;
    }

    // Authenticate fingerprint
    let result = await LocalAuthentication.authenticateAsync(
      this.props.iosSubtitle ? this.props.iosSubtitle : defaults.iosSubtitle
    );

    console.log('[Authentication Result]', result);

    // If IOS
    if (Platform.OS === 'ios') {
      // Success?
      if (result.success) {
        // Trigger success
        return this.props.onSuccess();
      }

      // Cancel?
      if (result.error === 'user_cancel'
      || result.error === 'app_cancel') {
        // Trigger cancel
        return this.props.onCancel();
      }

      // Unknown error?
      if (result.error === 'unknown') {
        // Just show an alert, call on cancel
        Alert.alert('Error', 'An unknown error occured', [
          {
            text: 'OK',
            onPress: this.props.onError ? this.props.onError : noop
          }
        ]);
      }

      // skip actions below
      return;
    }

    // Initial fingerprint state
    let state = {};

    // Switch between errors
    switch (result.error) {
      // BUG: Expo / Android Core tends to
      // automatically cancel fingerprint
      // initialization when there is too much
      // fingerprint scanning failure. In that
      // case we have to restart the Expo and the App.
      case 'app_cancel':
      case 'user_cancel':
        state.message = messages.fail;
        break;

      // Too fast?
      case 'too_fast':
        state.message = messages.too_fast;
        break;

      // Does not cover the entire sensor?
      case 'partial':
      case 'insufficient':
        state.message = messages.insufficient;
        break;

      // Does not match?
      case 'authentication_failed':
        state.message = messages.error;
        break;
    }

    // On failure
    if (!result.success) {
      // Set error
      state.error = true;
      // Set error icon
      state.icon = icons.error;

      // Update state
      this.setState(state);

      // Slight timeout
      setTimeout(() => {
        // Update to default state
        this.setState({
          error: false,
          message: messages.default,
          icon: icons.default,
          scanning: false
        });

        // Re-initialize fingerprint
        this._scanFingerprint();
      }, 2000);

      return;
    }

    // Update success state
    this.setState({
      error: false,
      message: messages.success,
      icon: icons.success,
      success: true,
      scanning: false
    });

    // Call on success callback
    setTimeout(() => {
      // Call success
      this.props.onSuccess();
    }, 2000);
  }

  _renderButtons() {
    // Do we have custom buttons?
    let customButtons = this.props.customButtons ? this.props.customButtons : [];

    // Map out custom buttoms
    let buttons = customButtons.map((value, index) => {
      return (
        <TouchableOpacity
          key={index}
          style={{ marginRight: 20 }}
          onPress={value.onPress ? value.onPress : noop}
        >
          <Text style={styles.buttonText}>{
            value.text ? value.text : 'CUSTOM'}
          </Text>
        </TouchableOpacity>
      );
    });

    return (
      <View style={styles.buttons}>
        {buttons}

        <TouchableOpacity
          onPress={this.props.onCancel ? this.props.onCancel : noop}
        >
          <Text style={styles.buttonText}>CANCEL</Text>
        </TouchableOpacity>
      </View>
    );
  }

  /**
   * Renders android specific
   * fingerprint modal.
   *
   * @return {JSX.Element}
   */
  _renderAndroid() {
    return (
      <View style={styles.modal}>
        <Text style={styles.title}>
          {this.props.title ? this.props.title : defaults.title}
        </Text>
        <Text style={styles.subtitle}>
          {this.props.subtitle ? this.props.subtitle : defaults.subtitle}
        </Text>

        <Text style={styles.confirm}>Confirm fingerprint to continue</Text>

        <View style={styles.status}>
          <Image
            source={this.state.icon}
            resizeMode='contain'
          />

          <Text style={styles.statusText}>{this.state.message}</Text>
        </View>

        {!this.state.success && this._renderButtons()}
      </View>
    )
  }

  /**
   * Renders IOS Touch ID
   *
   * @return {null}
   */
  _renderIOS() {
    return (
      <ActivityIndicator animating={true} />
    );
  }
}

const styles = StyleSheet.create({
  container: Platform.select({
    android: {
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.6)',
      flex: 1,
      height: '100%',
      justifyContent: 'center',
      left: 0,
      position: 'absolute',
      top: Constants.statusBarHeight,
      width: '100%'
    },

    ios: {
      alignItems: 'center',
      flex: 1,
      height: '100%',
      justifyContent: 'center',
      left: 0,
      position: 'absolute',
      top: 0,
      width: '100%'
    }
  }),

  modal: {
    backgroundColor: '#FFFFFF',
    borderRadius: 3,
    padding: 20,
    width: '80%',
    zIndex: 1
  },

  title: {
    color: '#222629',
    fontSize: 20,
    marginBottom: 10
  },

  subtitle: {
    color: '#8E9092',
    fontSize: 16,
    marginBottom: 15
  },

  confirm: {
    color: '#8E9092',
    fontSize: 16
  },

  status: {
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: 12,
    marginBottom: 15
  },

  statusText: {
    color: '#8E9092',
    fontSize: 12,
    marginLeft: 10
  },

  buttons: {
    alignItems: 'flex-end',
    flexDirection: 'row',
    justifyContent: 'flex-end'
  },

  buttonText: {
    color: '#007AFF',
    fontWeight: '500',
    fontSize: 14
  }
});

export default FingerPrint;

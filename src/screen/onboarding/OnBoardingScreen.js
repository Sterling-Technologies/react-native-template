import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  TouchableOpacity,
  Text,
  View
} from 'react-native';
import { Constants } from 'expo';

// components
import Link from './components/link';
import {Board} from './components/board';

// utils
import Storage from '@library/Storage';
import styles from './assets/styles';

/**
 * Onboarding Component
 */
class OnBoardingScreen extends Component {
  /**
   * Initialize props and state
   *
   * @param {Object} props
   */
  constructor(props) {
    super(props);

    // instantiate
    this.storage = new Storage();

    // Initial state
    this.state = {
      processing: {
        cognito: false,
        session: false
      },
      terms: false
    };

    // Bind events
    this._generateDeviceId        = this._generateDeviceId.bind(this);
    this._handleModalContinue     = this._handleModalContinue.bind(this);
    this._handleModalClose        = this._handleModalClose.bind(this);
    this._handleEnd               = this._handleEnd.bind(this);
  }

  /**
   * Will run once the component is loaded.
   */
  componentDidMount() {
    // generate a session device id
    this._generateDeviceId();
  }

  /**
   * Renders the component
   */
  render() {
    let { processing } = this.state;

    return (
        <View style={styles.container}>
          <Board
            pages={[
              {
                backgroundColor: '#FFFFFF',
                image: require('./assets/onboarding-1.png'),
                title: 'Welcome to Monico',
                subtitle: 'Build your cryptocurrency and token portfolio quickly, easily, and safely.',
                titleColor: '#007AFF',
                subtitleColor: '#3A3F43',
                nextColor: '#007AFF',
                nextText: 'Skip'
              },
              {
                backgroundColor: '#FFFFFF',
                image: require('./assets/onboarding-2.png'),
                title: 'Only the best projects here',
                subtitle: 'Companies and team members have been thoroughly vetted and audited by independent auditors and Monico staff.',
                titleColor: '#007AFF',
                subtitleColor: '#3A3F43',
                nextColor: '#007AFF',
                nextText: 'Skip'
              },
              {
                backgroundColor: '#FFFFFF',
                image: require('./assets/onboarding-3.png'),
                title: 'Your funds secured',
                subtitle: 'Your phone is your cold wallet - no private keys are ever sent over the internet.',
                titleColor: '#007AFF',
                subtitleColor: '#3A3F43',
                nextColor: '#007AFF',
                nextText: 'Skip'
              },
              {
                backgroundColor: '#FFFFFF',
                image: require('./assets/onboarding-4.png'),
                title: 'Manage your funds',
                subtitle: 'Purchase, view, and trade your tokens all within the app. Link your other payment apps for more ways to participate in projects.',
                titleColor: '#007AFF',
                subtitleColor: '#3A3F43',
                nextBackground: '#007AFF',
                nextText: 'GET STARTED'
              }
            ]}
            dotColor={'#007AFF'}
            dotActiveColor={'#007AFF'}
            onEnd={this._handleEnd}
          />

          {this.state.terms &&
            <View style={styles.overlay}>
              <View style={styles.modal}>
                <Text style={styles.title}>Confirmation</Text>

                <View style={styles.message}>
                  <Text> By continuing, you agree to our</Text>
                  <Link
                    src='https://www.moni.co/terms.html'
                    contentStyle={styles.link}
                    type='text'
                    content='Terms and Conditions'
                  />

                  <Text> and </Text>

                  <Link
                    src='https://www.moni.co/privacy-policy.html'
                    contentStyle={styles.link}
                    type='text'
                    content='Privacy Policy'
                  />
                </View>

                <View style={styles.buttons}>
                  <TouchableOpacity
                    onPress={this._handleModalContinue}
                    style={styles.continue}
                  >
                    <Text style={styles.continueButtonText}>CONTINUE</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={this._handleModalClose}
                  >
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          }
        </View>
    );
  }

  /**
   * Fetches the device constants and save it to the storage.
   */
  async _generateDeviceId() {
    // save the details in the storage
    await this.storage.setItem('device_id', Constants.deviceId);
    await this.storage.setItem('device_info', JSON.stringify({
      model: (Platform.OS === 'android') ?
          Constants.deviceName : Constants.platform.ios.model,
      id: Constants.deviceId
    }));
  }

  /**
   * On onboard end
   */
  _handleEnd() {
    // Show terms modal
    this.setState({ terms : true });
  }

  /**
   * On modal continue
   */
  _handleModalContinue() {
    // Set onboarding flag
    this.storage.setItem('onboarded', 'true');

    // redirect to the create pin stack
    this.props.navigation.navigate('PINStack');
  }

  /**
   * On modal close
   */
  _handleModalClose() {
    // Hide modal
    this.setState({ terms : false });
  }
}

export default OnBoardingScreen

// const mapStateToProps = (state) => {
//   return {}
// };

// export default connect(mapStateToProps, {
// })(Onboarding);

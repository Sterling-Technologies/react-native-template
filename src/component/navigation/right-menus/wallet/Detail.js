// dependencies
import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  Alert,
  Platform,
  TouchableOpacity,
  View
} from 'react-native';

// components
import Icon  from '@components/Icon';
import { AndroidActionModal } from '@components/modal';
import { IOSActionSheet } from '@components/action-sheet';

// redux
import { getWallets, deleteWallet, setActiveWallet, updateWallet } from '@redux/actions';

// styles
import baseStyle from '@assets/styles/base';

const styles = { ...baseStyle };

/**
 * Navigation Right Menu Wallet Detail Component
 */
class Detail extends Component {
  /**
   * Navigation Right Menu Wallet Detail Component Constructor
   */
  constructor(props) {
    super(props);

    // state components
    this.state = {
      modalVisible: false,
      processing: false,
    };

    // component methods
    this._deleteWallet = this._deleteWallet.bind(this);
    this._handlePostDeletion = this._handlePostDeletion.bind(this);
    this._renderAndroid = this._renderAndroid.bind(this);
    this._renderIOS = this._renderIOS.bind(this);
    this._toggleModal = this._toggleModal.bind(this);
  }

  /**
   * Will run once the component is loaded.
   */
  componentDidMount() {}


  /**
   * Listens for incoming changes in the props.
   */
  componentWillReceiveProps(nextProps) {
    // state objects
    let { processing } = this.state;

    // are we still processing?
    if (processing) {
      if (!nextProps.wallet.processing
        && nextProps.wallet.success
      ) {
        // get the wallets again to refresh the list
        this.props.getWallets();

        // handle post deletion action
        this._handlePostDeletion(nextProps);
      }
    }
  }

  render() {
    if (Platform.OS === 'ios') {
      return this._renderIOS();
    } else {
      console.log('android')
      return this._renderAndroid();
    }
  }

  /**
   * Deletes the wallet from the storage.
   */
  _deleteWallet() {
    // wallet
    const wallet = this.props.navigation.state.params.wallet;

    // set to processing
    this.setState({ processing: true }, () => {
      this.props.deleteWallet(wallet.wallet_id);
    });
  }

  _handlePostDeletion(props) {
    // wallet props
    const { wallets } = this.props.wallet;

    // store the active wallet
    let activeWallet = {};

    // loop for the wallets
    for (let w in wallets) {
      if (wallets[w].wallet_active === 1) {
        // set the active wallet
        activeWallet = wallets[w];
        break;
      }
    }

    // do we have an active wallet?
    if (!activeWallet || !activeWallet.wallet_id) {
      // set the first wallet as active wallet
      activeWallet = wallets[0];
    }

    // update
    this.props.updateWallet(
      {'wallet_active': 1},
      {'wallet_id': activeWallet.wallet_id}
    );

    // set in the state
    this.props.setActiveWallet(activeWallet);

    // redirect
    this.props.navigation.popToTop();
  }

  /**
   * Renders the wallet detail menu for android devices.
   */
  _renderAndroid() {
    // wallet
    const wallet = this.props.navigation.state.params.wallet;

    // action modal options
    let options = [
      {
        name: 'Edit Wallet Label',
        onPress: () => {
          // close the modal first
          setTimeout(() => {
            this._toggleModal(false);
          }, 200);

          this.props.navigation.navigate('Edit', {
            onBack: this.props.navigation.state.params.onBack,
            wallet
          })
        },
      },
      {
        name: 'Delete Wallet',
        onPress: () => {
          // close the modal first
          setTimeout(() => {
            this._toggleModal(false);
          }, 200);

          Alert.alert(
            'Are you sure?',
            'There is no turning back once you proceed. Make sure you export this wallet first.',
            [{
              onPress: this._deleteWallet,
              style: 'destructive',
              text: 'Delete',
            },
            {
              style: 'cancel',
              text: 'Cancel',
            }]
          )
        },
        optionNameStyle: styles.redText
      },
    ]

    return (
      <View>
        <TouchableOpacity
          onPress={() => {
            this._toggleModal(true)
          }}
        >
          <Icon
            android="md-more"
            color={"#FFFFFF"}
            size={28}
            source={"ionicons"}
            style={{ marginHorizontal: 15 }}
          />
        </TouchableOpacity>

        <AndroidActionModal
          cancelable={true}
          isHidden={() => {this._toggleModal(false)}}
          isVisible={this.state.modalVisible}
          options={options}
        />
        </View>
    );
  }

  /**
   * Renders the wallet detail menu for IOS devices.
   */
  _renderIOS() {
    // wallet
    const wallet = this.props.navigation.state.params.wallet;

    // action sheet options
    let options = [
      {
        name: 'Edit Wallet Label',
        onPress: () => {
          this.props.navigation.navigate('Edit', {
            onBack: this.props.navigation.state.params.onBack,
            wallet
          })
        }
      },
      {
        name: 'Delete Wallet',
        destructive: true,
        onPress: () => {
          Alert.alert(
            'Are you sure?',
            'There is no turning back once you proceed. Make sure you export this wallet first.',
            [{
              onPress: this._deleteWallet,
              style: 'destructive',
              text: 'Delete',
            },
            {
              style: 'cancel',
              text: 'Cancel',
            }]
          )
        }
      }
    ];

    return (
      <IOSActionSheet
        cancelable={true}
        icon="md-more"
        navigation={this.props.navigation}
        options={options}
      />
    );
  }

  /**
   * Sets the visibility of the modal.
   */
  _toggleModal(visible) {
    this.setState({ modalVisible: visible });
  }
}

const mapStateToProps = (state) => {
  return {
    wallet: state.wallet
  }
};

export default connect(mapStateToProps, {
  deleteWallet,
  getWallets,
  setActiveWallet,
  updateWallet
})(Detail);

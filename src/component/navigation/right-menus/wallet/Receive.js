// dependencies
import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  Platform,
  Share,
  TouchableOpacity,
  View
} from 'react-native';

// components
import Icon  from '@components/Icon';
import { AndroidActionModal } from '@components/modal';
import { IOSActionSheet } from '@components/action-sheet';

// redux
// import { getWallets, deleteWallet, setActiveWallet, updateWallet } from '@redux/actions';

/**
 * Navigation Right Menu Receive Funds Component
 */
class Receive extends Component {
  /**
   * Navigation Right Menu Receive Funds Component Constructor
   */
  constructor(props) {
    super(props);

    // state components
    this.state = {
      modalVisible: false,
      processing: false,
      wallet: {}
    };

    // component methods
    this._handleShowShareWalletScreen = this._handleShowShareWalletScreen.bind(this);
    this._renderAndroid = this._renderAndroid.bind(this);
    this._renderIOS = this._renderIOS.bind(this);
    this._toggleModal = this._toggleModal.bind(this);
  }

  /**
   * Will run once the component is loaded.
   */
  componentDidMount() {
    // get the wallet from the navigation
    const wallet = this.props.navigation.state.params.wallet;

    // set the wallet
    this.setState({ wallet });
  }

  /**
   * Listens for incoming changes in the props.
   */
  componentWillReceiveProps(nextProps) {
    // // state objects
    // let { processing } = this.state;

    // // are we still processing?
    // if (processing) {
    //   if (!nextProps.wallet.processing
    //     && nextProps.wallet.success
    //   ) {
    //     // get the wallets again to refresh the list
    //     this.props.getWallets();
    //   }
    // }
  }

  render() {
    if (Platform.OS === 'ios') {
      return this._renderIOS();
    } else {
      return this._renderAndroid();
    }
  }

  /**
   * Opens up the native Share Action Sheet (for sharing wallet screen)
   */
  _handleShowShareWalletScreen() {
    let { wallet } = this.state;

    Share.share({
      message: wallet.wallet_address,
      title: wallet.wallet_address
    }, {
      dialogTitle: wallet.wallet_address
    });
  }

  /**
   * Renders the wallet detail menu for android devices.
   */
  _renderAndroid() {
    // state objects
    let { wallet } = this.state;

    // action modal options
    let options = [
      {
        name: 'Share Wallet Address',
        onPress: this._handleShowShareWalletScreen
      }
    ];

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
    // action sheet options
    let options = [
      {
        name: 'Share Wallet Address',
        onPress: this._handleShowShareWalletScreen
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
  // deleteWallet,
  // getWallets,
  // setActiveWallet,
  // updateWallet
})(Receive);

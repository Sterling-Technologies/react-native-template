// dependencies
import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
    Alert,
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

// styles
import baseStyle from '@assets/styles/base';

const styles = { ...baseStyle };

/**
 * Navigation Right Menu Token Detail Component
 */
class Detail extends Component {
  /**
   * Navigation Right Menu Token Detail Component Constructor
    */
    constructor(props) {
        super(props);

        // state components
        this.state = {
            modalVisible: false
        };

        // component methods
        this._handleShowShareScreen = this._handleShowShareScreen.bind(this);
    }

    /**
    * Will run once the component is loaded.
    */
    componentDidMount() {
    }

    /**
    * Listens for incoming changes in the props.
    */
    componentWillReceiveProps(nextProps) {
    }

    render() {
        if (Platform.OS === 'ios') {
            return this._renderIOS();
        } else {
            return this._renderAndroid();
        }
    }

    /**
    * Opens up the native Share Action Sheet.
    */
    _handleShowShareScreen() {
        // token props object
        const { token } = this.props.token;

        Share.share({
            message: 'Hey, take a look at the '+ token.token_name
                +' project on Monico! Get the app at https://www.moni.co to check it out.',
            url: 'https://www.moni.co/token/detail/' + token.token_id,
            title: 'Check out the ' + token.token_name + ' Project on Monico!'
        }, {
            dialogTitle: 'Check out the ' + token.token_name + ' Project on Monico!'
        });
    }

    /**
    * Renders the wallet detail menu for android devices.
    */
    _renderAndroid() {
        // action modal options
        let options = [
            {
                name: 'Share',
                onPress: this._handleShowShareScreen
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
        // // state objects
        // let { wallet } = this.state;

        // action sheet options
        let options = [
            {
                name: 'Share Wallet Address',
                onPress: this._handleShowShareScreen
            },
            {
                name: 'Add To Watchlist',
                onPress: () => {
                    // close the modal first
                    setTimeout(() => {
                        this._toggleModal(false);
                    }, 200);

                    Alert.alert(
                        'Are you sure?',
                        'There is no turning back once you proceed.',
                        [{
                            onPress: this._deleteWallet,
                            // style: 'destructive',
                            text: 'Add',
                        },
                        {
                            style: 'cancel',
                            text: 'Cancel',
                        }]
                    )
                },
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
        global: state.global,
        token: state.token
    }
};

export default connect(mapStateToProps, {
})(Detail);

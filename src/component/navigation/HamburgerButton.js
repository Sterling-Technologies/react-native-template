import React, { Component } from 'react';
import {
  Platform,
  TouchableOpacity
} from 'react-native';

// component
import Icon from '@components/utils/Icon';

/**
 * Hamburger Button Component
 *
 * @extends Component
 */
class HamburgerButton extends Component {
    render() {
        return (
            <TouchableOpacity
                onPress={this.props.onPress}
                style={this.props.buttonStyle}
            >
                {Platform.OS === 'android' ?
                (
                    <Icon
                        color="#FFFFFF"
                        android="md-menu"
                        size={this.props.androidSize || 26}
                        source="ionicons"
                        style={this.props.androidStyle} />
                ) : (
                    <Icon
                        color="#007AFF"
                        ios="ios-menu"
                        size={this.props.iosSize || 28}
                        source="ionicons"
                        style={this.props.iosStyle || {margin: 5, marginBottom: 0, marginLeft: -2}} />
                )}
            </TouchableOpacity>
        )
    }
}

export default HamburgerButton;

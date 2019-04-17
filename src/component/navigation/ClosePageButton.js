import React, { Component } from 'react';
import {
  Platform,
  TouchableOpacity
} from 'react-native';

// component
import Icon from '@components/utils/Icon';

// styles
import baseStyle from '@assets/styles/base';

const styles = { ...baseStyle };

/**
 * Close Page Button Component
 *
 * @extends Component
 */
class ClosePageButton extends Component {
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
                        android="md-close"
                        size={this.props.androidSize || 26}
                        source="ionicons"
                        style={this.props.androidStyle || {marginHorizontal: 21}} />
                ) : (
                    <Icon
                        color="#007AFF"
                        ios="ios-close"
                        size={this.props.iosSize || 38}
                        source="ionicons"
                        style={this.props.iosStyle || {marginHorizontal: 10}} />
                )}
            </TouchableOpacity>
        )
    }
}

export default ClosePageButton;

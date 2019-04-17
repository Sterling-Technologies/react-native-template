import React, { Component } from 'react';
import { Platform, TouchableOpacity } from 'react-native';

// component
import Icon from '@components/utils/Icon';

/**
 * Add Button Component
 *
 * @extends Component
 */
class AddButton extends Component {
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
                        android="md-add"
                        size={this.props.androidSize || 26}
                        source="ionicons"
                        style={this.props.androidStyle || {marginHorizontal: 21}} />
                ) : (
                    <Icon
                        color="#007AFF"
                        ios="ios-add"
                        size={this.props.iosSize || 38}
                        source="ionicons"
                        style={this.props.iosStyle || {marginHorizontal: 10}} />
                )}
            </TouchableOpacity>
        );
    }
}

export default AddButton;

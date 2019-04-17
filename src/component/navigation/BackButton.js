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
 * Back Button Component
 *
 * @extends Component
 */
class BackButton extends Component {
    render() {
        return (
            <TouchableOpacity
                onPress={this.props.onPress}
                style={this.props.buttonStyle}
            >
                {Platform.OS === 'android' ?
                (
                    <Icon
                        color={this.props.androidColor || "#FFFFFF"}
                        android="arrow-left"
                        size={this.props.androidSize || 26}
                        source="material-community-icons"
                        style={this.props.androidStyle || {marginHorizontal: 14}} />
                ) : (
                    <Icon
                        color={this.props.iosColor || "#007AFF"}
                        ios="chevron-left"
                        size={this.props.iosSize || 35}
                        source="feather"
                        style={this.props.iosStyle || {marginLeft: -2, marginTop: -1, marginRight: 2}} />
                )}
            </TouchableOpacity>
        )
    }
}

export default BackButton;

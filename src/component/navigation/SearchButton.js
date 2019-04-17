import React, { Component } from 'react';
import {
  Platform,
  TouchableOpacity
} from 'react-native';

// component
import Icon from '@components/utils/Icon';

/**
 * Search Button Component
 *
 * @extends Component
 */
class SearchButton extends Component {
    render() {
        return (
            <TouchableOpacity
                onPress={this.props.onPress}
                style={this.props.buttonStyle}
            >
                {Platform.OS === 'android' ?
                (
                    <Icon
                        android="md-search"
                        color={"#ffffff"}
                        size={this.props.size || 26}
                        source="ionicons"
                        style={this.props.style} />
                ) : (
                    <Icon
                        color={'#007AFF'}
                        ios="ios-search"
                        size={this.props.size || 28}
                        source="ionicons"
                        style={this.props.style || {margin: 5, marginBottom: 0, marginRight: -2}}
                        />
                )}
            </TouchableOpacity>
        )
    }
}

export default SearchButton;

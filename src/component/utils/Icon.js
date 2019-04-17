// dependencies
import React, { Component } from 'react';
import { Platform } from 'react-native';
import {
    Entypo,
    EvilIcons,
    Feather,
    FontAwesome,
    Foundation,
    Ionicons,
    MaterialCommunityIcons,
    MaterialIcons,
    Octicons,
    SimpleLineIcons,
    Zocial
} from '@expo/vector-icons';

/**
 * Icon Component
 *
 * @extends Component
 */
export default class Icon extends Component {
    render() {
        let iconName;

        // determine first the platform of this device
        if (Platform.OS === 'ios') {
            // get the ios icon
            iconName = this.props.ios;
        } else {
            // get the android
            iconName = this.props.android;
        }

        // where are we going to get the icon?
        switch (this.props.source) {
            case 'entypo':
                return (
                    <Entypo
                        name={iconName}
                        size={this.props.size || 25}
                        color={this.props.color || '#000000'}
                        style={this.props.style} />
                );

            case 'evilicons':
                return (
                    <EvilIcons
                        name={iconName}
                        size={this.props.size || 25}
                        color={this.props.color || '#000000'}
                        style={this.props.style} />
                );

            case 'feather':
                return (
                    <Feather
                        name={iconName}
                        size={this.props.size || 25}
                        color={this.props.color || '#000000'}
                        style={this.props.style} />
                );

            case 'font-awesome':
                return (
                    <FontAwesome
                        name={iconName}
                        size={this.props.size || 25}
                        color={this.props.color || '#000000'}
                        style={this.props.style} />
                );

            case 'foundation':
                return (
                    <Foundation
                        name={iconName}
                        size={this.props.size || 25}
                        color={this.props.color || '#000000'}
                        style={this.props.style} />
                );

            case 'ionicons':
                return (
                    <Ionicons
                        name={iconName}
                        size={this.props.size || 25}
                        color={this.props.color || '#000000'}
                        style={this.props.style} />
                );

            case 'material-community-icons':
                return (
                    <MaterialCommunityIcons
                        name={iconName}
                        size={this.props.size || 25}
                        color={this.props.color || '#000000'}
                        style={this.props.style} />
                );

            case 'material-icons':
                return (
                    <MaterialIcons
                        name={iconName}
                        size={this.props.size || 25}
                        color={this.props.color || '#000000'}
                        style={this.props.style} />
                );

            case 'octicons':
                return (
                    <Octicons
                        name={iconName}
                        size={this.props.size || 25}
                        color={this.props.color || '#000000'}
                        style={this.props.style} />
                );

            case 'Zocial':
                return (
                    <Zocial
                        name={iconName}
                        size={this.props.size || 25}
                        color={this.props.color || '#000000'}
                        style={this.props.style} />
                );

            default:
                return (
                    <Ionicons
                        name={iconName}
                        size={this.props.size || 25}
                        color={this.props.color || '#000000'}
                        style={this.props.style} />
                );
        }
    }
}

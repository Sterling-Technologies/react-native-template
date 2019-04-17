// dependencies
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { KeyboardAvoidingView, View, ViewPropTypes } from 'react-native';
import { isIphoneX, getStatusBarHeight } from 'react-native-iphone-x-helper';

const viewPropTypes = ViewPropTypes || View.propTypes

/**
 * Keyboard Avoid View Component
 *
 * @extends Component
 */
export default class KeyboardAvoidView extends Component {
    static propTypes = {
        offset: PropTypes.number,
        style: viewPropTypes.style
    };

    static defaultProps = {
        offset: getStatusBarHeight(true) + 44,
        style: {}
    };

    render() {
        // get the props
        const { offset, style } = this.props;

        return (
            <KeyboardAvoidingView
                behavior="padding"
                enabled
                keyboardVerticalOffset={offset}
                style={style}
            >
                {this.props.children}
            </KeyboardAvoidingView>
        );
    }
}

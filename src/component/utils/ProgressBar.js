// dependencies
import React, { Component } from 'react';
import { ProgressBarAndroid, ProgressViewIOS, Platform, View } from 'react-native';

/**
 * Progress Bar Component
 */
export default class ProgressBar extends Component {
    render() {
        let prog = this.props.progress ? this.props.progress : 0;

        if (Platform.OS === 'android'
            && this.props.progress
            && this.props.progress < 0.01
        ) {
            prog = 0.01;
        }

        return (
            <View>
                {(Platform.OS === 'ios') ? (
                    <ProgressViewIOS
                        progress={this.props.progress || 0}
                        progressTintColor={this.props.tintColor || ''}
                        style={{transform: [{ scaleX: 1.0 }, { scaleY: 5 }]}} />
                ) : (
                    <ProgressBarAndroid
                    color={this.props.tintColor || ''}
                    indeterminate = { false }
                    progress={prog}
                    styleAttr="Horizontal" />
                )}
            </View>
        );
    }
}

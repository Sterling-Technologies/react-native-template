import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import Modal from 'react-native-modal';

import { Icon } from '@components';

// styles
import baseStyle from '@assets/styles/base';

const styles = { ...baseStyle };

class AndroidActionModal extends Component {
    render() {
        return (
            <Modal
                isVisible={this.props.isVisible}
                animationIn="zoomIn"
                animationInTiming={ 60 }
                animationOut="zoomOut"
                animationOutTiming={ 5 }
                onBackdropPress={this.props.isHidden}
                onBackButtonPress={this.props.isHidden}
            >
                <View style={this.props.modalStyle || {backgroundColor: '#FFFFFF', borderRadius: 5}}>
                    {this._renderOptions()}

                    {this.props.cancelable &&
                        <TouchableOpacity onPress={this.props.isHidden}>
                            <View style={{padding: 20}}>
                                <Text style={[styles.blueText, styles.smallText, styles.rightText]}>
                                    CANCEL
                                </Text>
                            </View>
                        </TouchableOpacity>
                    }
                </View>
            </Modal>
        );
    }

    _renderOptions() {
        // render options
        options = this.props.options.map((value, index) => {
            return (
                <TouchableOpacity onPress={value.onPress} key={index}>
                    <View style={this.props.optionStyle || {padding: 20}}>
                        <Text style={[value.optionNameStyle, styles.smallText]}>
                            {value.name}
                        </Text>
                    </View>
                </TouchableOpacity>
            );
        });

        return options;
    }
}

export default AndroidActionModal;

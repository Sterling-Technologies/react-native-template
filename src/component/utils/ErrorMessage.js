import React, { Component } from 'react';
import {
    Image,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

// styles
import baseStyle from '@assets/styles/base';
import componentStyle from './assets/errorMessage';

const styles = { ...baseStyle, ...componentStyle };

/**
 * ErrorMessage Component
 *
 * @extends Component
 */
class ErrorMessage extends Component {
    render() {
        return (
            <View style={[
                styles.container,
                styles.centeredContent,
                this.props.backgroundColor,
                this.props.containerStyle
            ]}>
                {this.props.image &&
                    <Image
                    style={[styles.defaultImageStyle, this.props.imageStyle]}
                    resizeMode='contain'
                    source={this.props.image}
                    />
                }

                {this.props.title &&
                    <Text style={[
                        styles.centerText,
                        styles.darkText,
                        styles.smallText,
                        styles.strongerText,
                        styles.defaultTitleStyle,
                        this.props.titleStyle
                    ]}>
                        {this.props.title}
                    </Text>
                }

                {this.props.content &&
                    <Text style={[
                        styles.centerText,
                        styles.darkText,
                        styles.smallText,
                        styles.defaultContentStyle,
                        this.props.contentStyle
                    ]}>
                        {this.props.content}
                    </Text>
                }

                {this.props.buttonEnabled &&
                    <View style={[
                        styles.horizontalPaddedContainer,
                        styles.paddedVerticalContent,
                        styles.defaultButtonContainerStyle,
                        this.props.buttonContainerStyle
                    ]}>
                        <TouchableOpacity
                            onPress={this.props.buttonOnPress}
                            style={[
                                styles.primaryButton,
                                styles.defaultButtonStyle,
                                this.props.buttonColor,
                                this.props.buttonStyle
                            ]}
                        >
                            <Text style={[
                                styles.bottomPrimaryButtonText,
                                styles.primaryButtonText,
                            ]}>
                                {this.props.buttonTitle}
                            </Text>
                        </TouchableOpacity>
                    </View>
                }
            </View>
        );
    }
}

export default ErrorMessage;

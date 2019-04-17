import React from 'react';
import {
    Share,
    Text,
    TouchableOpacity,
} from 'react-native';
import {
    ActionSheetProvider,
    connectActionSheet
} from '@expo/react-native-action-sheet';

// components
import Icon from './../Icon';

/**
 * IOSActionSheet Component
 *
 * @extends Component
 */
class IOSActionSheet extends React.Component {
    render() {
        return (
            <ActionSheetProvider>
                <IOSAction
                    cancelable={this.props.cancelable}
                    icon={this.props.icon}
                    iconStyle={this.props.iconStyle}
                    navigation={this.props.navigation}
                    options={this.props.options}
                    text={this.props.text}
                />
            </ActionSheetProvider>
        );
    }
}

@connectActionSheet
class IOSAction extends React.Component {
    render() {
        return (
            <TouchableOpacity
                onPress={this._onOpenActionSheet}
            >
                {this.props.icon &&
                    <Icon
                        color={this.props.iconColor ||"#007AFF"}
                        ios={this.props.icon}
                        size={this.props.iconSize || 28}
                        source={this.props.iconSource || "ionicons"}
                        style={this.props.iconStyle || { marginHorizontal: 15 }}
                    />
                }

                {this.props.text &&
                    <Text>{this.props.text}</Text>
                }
            </TouchableOpacity>
        );
    }

    /**
    * Handles opening the action sheet.
    */
    _onOpenActionSheet = () => {
        // render options
        let options = [];

        // holds the index of cancel button
        let cancelButtonIndex;

        // holds the index of a destructive button
        let destructiveButtonIndex;

        // push option names elements to options array
        this.props.options.map((value, index) => {
            if (value.destructive) {
            // set the index
            destructiveButtonIndex = index;

            // delete it
            delete value.destructive;
            }

            options.push(value.name);
        });

        // add cancel option if cancelable is true
        if (this.props.cancelable) {
            options.push('Cancel');

            // render cancel button index
            cancelButtonIndex = options.length - 1;
        }

        // render action sheet
        this.props.showActionSheetWithOptions(
            {
                options,
                destructiveButtonIndex,
                cancelButtonIndex,
            },
            (buttonIndex) => {
                // do the specific option's onPress function when buttonIndex === index
                this.props.options.map((value, index) => {
                buttonIndex === index &&
                this.props.options[index].onPress();
                });
            }
        );
    };
}


export default IOSActionSheet;

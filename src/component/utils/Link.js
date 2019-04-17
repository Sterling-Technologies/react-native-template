// dependencies
import React, { Component } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { WebBrowser } from 'expo';

/**
 * Link Component
 *
 * @extends Component
 */
class Link extends Component {
    /**
    * Link Component Constructor
    */
    constructor(props) {
        super(props);

        // set component state
        this.state = {
            links: []
        }

        // bind methods
        this.handleOpenBrowser  = this.handleOpenBrowser.bind(this);
    }

    /**
    * Opens a browser to open up the selected link.
    */
    handleOpenBrowser(url) {
        WebBrowser.openBrowserAsync(url);
    }

    render() {
        return (
            <View style={styles.container}>
                <TouchableOpacity
                    onPress={this.handleOpenBrowser.bind(this, this.props.src)}
                    style={this.props.style}
                >
                    {this.props.type == 'text' &&
                        <Text style={this.props.contentStyle}>
                            {this.props.content}
                        </Text>
                    }
                    {this.props.type == 'image' &&
                        // go ahead and format image
                        <Image
                            style={this.props.contentStyle}
                            source={{ uri: this.props.content }}
                        />
                    }
                </TouchableOpacity>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row'
    },

    link: {
        color: '#007AFF'
    }
});

export default Link;

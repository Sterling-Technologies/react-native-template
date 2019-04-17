import {Platform, StatusBar, StyleSheet} from 'react-native';

import { Constants } from 'expo';

export default StyleSheet.create({
    container: {
        flex: 1
    },

    modal: {
        backgroundColor: '#FFFFFF',
        borderRadius: 3,
        padding: 20,
        width: '80%',
        zIndex: 1
    },

    link: {
        color: '#007AFF'
    },

    title: {
        color: '#222629',
        fontSize: 20,
        marginBottom: 10
    },

    overlay: Platform.select({
        android: {
            alignItems: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            flex: 1,
            height: '100%',
            justifyContent: 'center',
            left: 0,
            position: 'absolute',
            top: Constants.statusBarHeight,
            width: '100%'
        },

        ios: {
            alignItems: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            flex: 1,
            height: '100%',
            justifyContent: 'center',
            left: 0,
            position: 'absolute',
            top: 0,
            width: '100%'
        }
    }),

    message: {
        marginTop: 10,
        marginBottom: 20,
        flexWrap: 'wrap',
        alignSelf: 'flex-start',
        flexDirection:'row'
    },

    buttons: {
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'center'
    },

    continue: {
        alignItems: 'center',
        backgroundColor: '#007AFF',
        borderRadius: 5,
        justifyContent: 'center',
        marginTop: 10,
        marginBottom: 10,
        padding: 10,
        width: '100%'
    },

    continueButtonText: {
        color: '#FFFFFF',
        fontWeight: '500',
        fontSize: 14
    },

    cancelButtonText: {
        color: '#8E9092'
    }
});

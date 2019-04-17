import React, { Component } from 'react';
import { Text, View, Button } from 'react-native';

import Profile from '@module/profile/Profile';
import app from '@library/AppHandler';

import styles from './assets/styles';

export default class HomeScreen extends Component
{
  constructor() {
    super();
  }

  async componentDidMount() {
    let wallet = await app.method('profile-search', {dev: true});
  }

  render() {
    return (
      <View style={styles.container}>
        <Text>Hello World 4!</Text>
      </View>
    );
  }
}

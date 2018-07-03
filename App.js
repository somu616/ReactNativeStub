/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
    TouchableHighlight
} from 'react-native';
import {Scene, Reducer, Router, Switch, TabBar, Modal, Actions} from 'react-native-router-flux';
import Login from './components/Login';
var EventEmitter = require('EventEmitter');
var Subscribable = require('Subscribable');
import Store from './util/store.js';
const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' +
    'Cmd+D or shake for dev menu',
  android: 'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

const reducerCreate = params=>{
    const defaultReducer = Reducer(params);
    return (state, action)=>{
        return defaultReducer(state, action);
    }
};

export default class App extends Component {
    constructor(props) {
        super(props);
    }
    componentWillMount() {
        this.eventEmitter = new EventEmitter();
    }
  render() {
        var that=this;
    return (
        <Router createReducer={reducerCreate}>
            <Scene key="loginModal" component={Login} hideNavBar={true} />
        </Router>
    );
  }
}


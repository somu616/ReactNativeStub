/**
 * Created by sumeetbhalla on 5/10/17.
 */
import React from 'react';
import 'react-native-polyfill';
import { AppRegistry, NetInfo, Navigator, StyleSheet, Text, View, AsyncStorage } from 'react-native'
import { Actions } from "react-native-router-flux";
var loginCredential = {};
var pieURL = "http://www.thousandpetalsbiometrics.com"
class Store {
    setLoginCredential(key, value) {
        loginCredential[key] = value;
    }

    getLoginCredential() {
        return loginCredential;
    }

    validateLogin(userName, password, serverURL, successcallback, failurecallback) {
        //DUMMY LOGIN Method
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        //myHeaders.append("X-Custom-Header", "ProcessThisImmediately");
        var loginDetails = {}
        loginDetails["userName"] = userName;
        loginDetails["passwd"] = password;
        //loginCredential=loginDetails
        this.setPieURL(serverURL);
        var obj = { method: 'POST', headers: myHeaders, body: JSON.stringify(loginDetails) }
        fetch(serverURL + "/login_user_validate", obj)
            .then((response) => response.json())
            .then((responseData) => {
                console.log(responseData);
            })
            .catch((error) => {
                failurecallback(error);
            }).done();
    }
    getDeviceList(successcallback, failurecallback) {
        //for actual data
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("X-Custom-Header", "ProcessThisImmediately");

        var obj = { method: 'GET', headers: myHeaders, }
        fetch(pieURL + "/userDeviceArray.json", obj)
            .then((response) => response.json())
            .then((responseData) => {
                console.log(responseData);
            })
            .catch((error) => {
                //alert("Some Technical Issue happened with registering this event. Please Try again After some time");
                failurecallback();
            }).done();
    }

   
    logOff(successcallback, failurecallback) {
        var obj = { method: 'GET' }
        fetch(pieURL + "/logout", obj)
            .then((response) => response.text())
            .then((responseData) => {
                successcallback()
            })
            .catch((error) => {
                failurecallback();
            }).done();
    }
}
export default new Store();
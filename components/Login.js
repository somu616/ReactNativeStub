/**
 * Created by sumeetbhalla on 5/10/17.
 */
import React,{Component} from 'react';
import {View,NetInfo,Alert,ScrollView,AsyncStorage, Platform, Text,ActivityIndicator,Dimensions,KeyboardAvoidingView, StyleSheet,TextInput,TouchableHighlight,Image} from "react-native";
import {Actions} from "react-native-router-flux";
import Store from '../util/store.js';
import Icon from 'react-native-vector-icons/FontAwesome';
var w = Dimensions.get('window').width;
var h = Dimensions.get('window').height;
import Spinner from 'react-native-loading-spinner-overlay';
var DeviceInfo = require('react-native-device-info');
const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        flexDirection:"column",
        overflow:'scroll',
        backgroundColor: "#188bce",
    },
    topImage: {
        //flexGrow:0.1,
        flexDirection:"column",
        padding:30,

    },
    appLogo: {
        width: 120,
        height: 100,
        alignSelf:"center",
        marginTop:15,
        borderRadius:20,

    },
    loginFieldView: {
        flexGrow:0.6,
    },
    loginFields: {
        flexGrow:0.3,
        //fontFamily: 'Lato-Regular',
        fontSize: 20,
        height:50,
        color:"#ffffff",
        flexDirection:"column",
        marginLeft:20,
        marginRight:20,
        //top:200
        //backgroundColor:'green',
    },
    loginText: {
        fontFamily: 'Lato-Regular',
        fontSize:20,
        color:"#0B4F6C",
        textAlign:"center",
        //top:200
    },
    textInputView: {
        //fontFamily: 'Lato-Regular',
        height:40,
        borderBottomColor:"#ffffff",
        borderBottomWidth:1,
        marginLeft:15,
        marginRight:15,
        marginTop:20,
        flexDirection:'row',
        //top:h-350,
        //marginTop:160,
        //paddingBottom:20,
        //backgroundColor:'red',
    },
    loginButton: {
        alignSelf:"center",
        alignItems:"center",
        justifyContent:"center",
        paddingLeft:50,
        paddingRight:50,
        paddingTop:12,
        paddingBottom:12,
        borderRadius:40,
        borderWidth: 1,
        borderStyle: "solid",
        borderColor: "#ffffff",
        backgroundColor: "#ffffff",
        flexDirection:"column",
        //backgroundColor:'green',
        marginTop:20
    },
    loginText: {
        //fontFamily: 'Lato-Regular',
        fontSize:20,
        color:"#0B4F6C",
        textAlign:"center",
    },
    dummyView1: {
        //flexGrow:6,
        height:70,
        //backgroundColor:'yellow'
    },
});

export default class extends Component {

    constructor(props)
    { super(props);
        this.state =
        {
            username:"itcbcm-s1@gmail.com",
            password:"polydemo123#",
            isLoading:false,
            isChecked:false,
            isConnectedToInternet:true,
            hidePassword:true,
            serverURL:"http://www.thousandpetalsbiometrics.com"
        };
        console.disableYellowBox = true;
    }
    _handleConnectivityChange = (isConnected) => {
        this.setState({
            isConnectedToInternet:isConnected,
        });
        //alert("connected state - "+isConnected);
    };

    componentDidMount() {
        const dispatchConnected = isConnected => this.props.dispatch(setIsConnected(isConnected));

        NetInfo.isConnected.fetch().then().done(() => {
            NetInfo.isConnected.addEventListener('change',this._handleConnectivityChange );
        });
    }
    componentWillMount() {
        AsyncStorage.getItem("polyUsername", (err, result) => {
            if(result){
                //console.log("Username stored is:",result);
                this.setState(this.setState({username:result}));
            }
        });
        AsyncStorage.getItem("polyPassword", (err, result) => {
            if(result){
                //also check the remember me check box if values are saved
                this.state.isChecked = true;
                //console.log("Username stored is:",result);
                this.setState(this.setState({password:result}));

            }
        });
        AsyncStorage.getItem("polyServerUrl", (err, result) => {
            if(result){
                //console.log("Username stored is:",result);
                this.setState(this.setState({serverURL:result}));
            }
        });
    }
    successCallback(data) {
        this.setState({isLoading:false});
        Store.setLoginCredential("username", this.state.username.toLowerCase());
        Store.setLoginCredential("password", this.state.password);
        Store.setPieURL(this.state.serverURL);
        //also check if remember me was checked or not
        if(this.state.isChecked) {
            AsyncStorage.setItem("polyUsername", this.state.username.toLowerCase(), ()=> {
            })
            AsyncStorage.setItem("polyPassword", this.state.password, ()=> {
            })
            AsyncStorage.setItem("polyServerUrl", this.state.serverURL, ()=> {
            })
        }
        // if(data.length>1 || (data.length >0 && Store.getDeviceList().length>0))
        //     Actions.homepage({"data":data});
        // else {
        //     var deviceTitle = data[0].deviceName?data[0].deviceName:" no name defined ";
        //     Actions.deviceInfo({"selectedDevice":data[0], title: deviceTitle,type:"replace"});
        // }
        Actions.cameraGalleryImages();
    }
    failureCallback(that) {
        if(this.state.isConnectedToInternet) {
            Alert.alert(
                'Something Went Wrong !',
                'Please try again in some time.!',
                [
                    {text: 'OK', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                ],
                { cancelable: false }
            )
        }
        else {
            Alert.alert(
                'Connectivity Issue !',
                'No Internet Connectivity. Please Connect and Try Again.!',
                [
                    {text: 'OK', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                ],
                { cancelable: false }
            )
        }

        this.setState({isLoading:false});
    }
    handleOfflineCase(isConnected) {

            if ((this.state.username != "") && (this.state.password != "")) {
                this.setState({isLoading: true});
                Store.validateLogin(this.state.username.toLowerCase(),this.state.password,this.state.serverURL,this.successCallback.bind(this), this.failureCallback.bind(this))
            }
            else {
                Alert.alert(
                    'Credentials Error !',
                    'Username or Password missing. Please enter proper credentials.',
                    [
                        {text: 'OK', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                    ],
                    {cancelable: false}
                )
            }

    }
    loginUser() {
        this.handleOfflineCase(this.state.isConnected)
    }
    handleSaveCredentials(check) {
        this.setState({isChecked:!this.state.isChecked})
    }
    render() {
        var that = this;
        return(
            <ScrollView style={styles.container}>
                <Spinner visible={this.state.isLoading} textContent={"Logging In..."} textStyle={{color: '#FFF'}} />
                <View style={styles.topImage}>
                    <Image source={require('../images/logo_thousand.png')} resizeMode='stretch' style={styles.appLogo}/>
                </View>
                <View style={styles.dummyView1}/>
                <TouchableHighlight style={styles.loginButton} underlayColor="#ffffff" onPress={() => this.loginUser()}>
                    <Text style={styles.loginText}>LOGIN</Text>
                </TouchableHighlight>
            </ScrollView>
        )
    }
}
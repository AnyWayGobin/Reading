import React, {Component} from 'react';
import {
    BackHandler,
    Platform, ToastAndroid,
} from 'react-native';
import {NavigationEvents} from "react-navigation";

export default class BaseComponent extends Component {

    constructor(props) {
        super(props);
    }

    /*componentWillMount() {
        console.log("componentWillMount");
        if (Platform.OS === 'android') {
            BackHandler.addEventListener('hardwareBackPress', this.onBackAndroid);
        }
    }

    componentWillUnmount() {
        console.log("componentWillUnmount");
        if (Platform.OS === 'android') {
            BackHandler.removeEventListener('hardwareBackPress', this.onBackAndroid);
        }
    }*/

    onBackAndroid = () => {
        if (this.lastBackPressed && this.lastBackPressed + 2000 >= Date.now()) {
            //最近2秒内按过back键，可以退出应用。
            BackHandler.exitApp();
            return;
        }
        this.lastBackPressed = Date.now();
        ToastAndroid.show('再按一次退出应用', ToastAndroid.SHORT);
        return true;
    };
}

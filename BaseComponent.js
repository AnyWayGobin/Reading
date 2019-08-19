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

    componentWillMount() {
        this._didFocusSubscription = this.props.navigation.addListener('didFocus', () =>
            BackHandler.addEventListener('hardwareBackPress', this.onBackAndroid)
        );
        this._willBlurSubscription = this.props.navigation.addListener('willBlur', () =>
            BackHandler.removeEventListener('hardwareBackPress', this.onBackAndroid)
        );
    }

    componentWillUnmount() {
        this._didFocusSubscription && this._didFocusSubscription.remove();
        this._willBlurSubscription && this._willBlurSubscription.remove();
    }

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

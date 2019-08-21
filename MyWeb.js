import React, { Component } from 'react';
import {Text, BackHandler} from "react-native";
import { WebView } from 'react-native-webview';

export default class MyWeb extends Component {

    webView = {
        canGoBack: false,
        ref: null,
    };

    static navigationOptions = ({ navigation }) => ({

        title: `${navigation.state.params.desc}`,
        headerStyle: {
            backgroundColor: '#549cf8',
        },
        headerTintColor: '#fff',
    });

    onAndroidBackPress = () => {
        // this.webView.ref = null;
        if (this.webView.canGoBack && this.webView.ref) {//直接用对象判断，就表示它不等于null，比如这里的this.webView.ref
            this.webView.ref.goBack();
            return true;
        }
        return false;
    };

    componentWillMount() {
        if (Platform.OS === 'android') {
            BackHandler.addEventListener('hardwareBackPress', this.onAndroidBackPress);
        }
    }

    componentWillUnmount() {
        if (Platform.OS === 'android') {
            BackHandler.removeEventListener('hardwareBackPress', this.onAndroidBackPress);
        }
    }

    render() {
        const { navigation } = this.props;
        const url = navigation.getParam('url');
        if (url === null || url === '') {
            return (
                <Text>链接错误</Text>
                );
        }
        return (
            <WebView
                ref={(webView) => { this.webView.ref = webView; }}
                source={{ uri: url }}
                onNavigationStateChange={(navState) => { this.webView.canGoBack = navState.canGoBack; }}
            />
        );
    }
}
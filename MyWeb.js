import React, { Component } from 'react';
import {Text} from "react-native";
import { WebView } from 'react-native-webview';

export default class MyWeb extends Component {

    static navigationOptions = ({ navigation }) => ({

        title: `${navigation.state.params.desc}`,
        headerStyle: {
            backgroundColor: '#549cf8',
        },
        headerTintColor: '#fff',
    });

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
                source={{ uri: url }}
                onNavigationStateChange={this._onNavigationStateChange}
            />
        );
    }

    // 获取 webview 事件返回的 canGoBack 属性 ， 判断网页是否可以回退
    _onNavigationStateChange (navState){
        if(navState.canGoBack){
            console.log("canGoBack");
            MyWeb.goBack();
        } else {
            console.log("can not GoBack");
            this.props.navigation.pop();
        }
    }
}
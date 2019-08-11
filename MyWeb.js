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
            <WebView source={{ uri: url }} />
        );
    }
}
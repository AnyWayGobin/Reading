import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity, DeviceEventEmitter,
} from 'react-native';
import BaseComponent from "./BaseComponent";
import StorageOpt from "./StorageOpt";

const EVENT_NAME = "listener_register_login";

export default class More_bak extends BaseComponent {

    static EVENT_NAME = "listener_register_login";

    static navigationOptions = {
        title: "更多"
    };

    constructor(props) {
        super(props);
        this.state={
            username:""
        }
    }

    componentWillMount() {
        super.componentWillMount();
        StorageOpt.loaddata("username", (result) => {
            this.setState({
                username: result
            });
        });
    }

    componentDidMount() {
        this.listener = DeviceEventEmitter.addListener(EVENT_NAME, () => {
            console.log("more listener");
            StorageOpt.loaddata("username", (result) => {
                this.setState({
                    username: result
                });
            });
        });
    }

    componentWillUnmount() {
        super.componentWillUnmount();
        if (this.listener) {
            this.listener.remove();
        }
    }

    _onNavigateDuanzi = () => {
        this.props.navigation.navigate("Duanzi");
    };

    _onRegisterLogin = () => {
        if (this.state.username === "") {
            this.props.navigation.navigate("RegisterLogin");
        }
    };

    _onNavigateCollect = () => {
        if (this.state.username === "") {
            this.props.navigation.navigate("RegisterLogin");
        } else {
            this.props.navigation.navigate("Collect");
        }
    };

    render() {
        return (
            <View style={styles.container}>
                <TouchableOpacity style={styles.button} onPress={this._onNavigateDuanzi}>
                    <Text style={{color:'white'}}>段 子</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={this._onRegisterLogin}>
                    <Text style={{color:'white'}}>{this.state.username === "" ? "注册登录" : "已登录(" + this.state.username + ")"}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={this._onNavigateCollect}>
                    <Text style={{color:'white'}}>我的收藏</Text>
                </TouchableOpacity>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
    },
    button: {
        alignItems: 'flex-start',
        backgroundColor: 'gray',
        padding: 10,
        marginTop: 20
    }
});
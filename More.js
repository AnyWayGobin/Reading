import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
} from 'react-native';
import BaseComponent from "./BaseComponent";
import StorageOpt from "./StorageOpt";

let cookie = "";

export default class More extends BaseComponent {

    constructor(props) {
        super(props);
    }

    componentWillMount() {
        StorageOpt.loaddata("cookie", (result) => {
            cookie = result;
        });
    }

    _onNavigateDuanzi = () => {
        this.props.navigation.navigate("Duanzi");
    };

    _onRegisterLogin = () => {
        this.props.navigation.navigate("Duanzi");
    };

    render() {

        return (
            <View style={styles.container}>
                <TouchableOpacity style={styles.button} onPress={this._onNavigateDuanzi}>
                    <Text style={{color:'white'}}>段 子</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={this._onRegisterLogin}>
                    <Text style={{color:'white'}}>注册登录</Text>
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
    textInput: {
        fontSize:20,
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 20,
        marginRight: 20
    },
    button: {
        alignItems: 'center',
        backgroundColor: '#549cf8',
        padding: 10,
        margin: 20,
        borderRadius: 5
    }
});
import React from 'react';
import {
    Image,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    Alert,
    DeviceEventEmitter,
    ToastAndroid
} from 'react-native';
import * as config from './src/config'
import StorageOpt from "./StorageOpt";

const LOGOUT_REQUEST_URL = "https://www.wanandroid.com/user/logout/json";

export default class DrawerPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            userName: '',
        };
    }

    componentDidMount() {
        StorageOpt.loaddata(config.USER_NAME, (result) => {
            this.setState({
                userName:result
            })
        });
        this.listener = DeviceEventEmitter.addListener(config.LOGIN_CALLBACK, (username) => {
            this.setState({
                userName:username
            })
        });
    }

    componentWillUnmount() {
        if (this.listener) {
            this.listener.remove();
        }
    }

    fetchLogout() {
        fetch(LOGOUT_REQUEST_URL)
            .then(response => {
                if (response.status === 200) {
                    StorageOpt.delete(config.USER_NAME);
                    StorageOpt.delete(config.COOKIE);
                    return response.json();
                }
            }).then(result => {
                if (result.errorCode === -1) {
                    ToastAndroid.show(result.errorMsg, ToastAndroid.LONG);
                } else if (result.errorCode === 0) {//退出成功
                    ToastAndroid.show("退出成功", ToastAndroid.LONG);
                    this.setState({
                        userName:''
                    });
                    this.props.navigation.toggleDrawer();
                }
            })
            .catch((error) => {
                console.log(error)
            })
    }


    render() {
        return <ScrollView>
            <TouchableOpacity activeOpacity={0.6} onPress={() => {
                if (this.state.userName) {
                } else {
                    this.props.navigation.navigate('RegisterLogin');
                }
            }}>
                <View style={styles.header}>
                    <Image style={styles.avatar} source={{uri:'ic_avatar'}}/>
                    <Text style={styles.userName}>
                        {this.state.userName ? this.state.userName : "还没有登录..."}
                    </Text>
                </View>
            </TouchableOpacity>
            {this.getItemView("收藏夹", {uri:'ic_favorite_not'}, () => {
                if (this.state.userName) {
                    this.props.navigation.navigate('Collect');
                } else {
                    this.props.navigation.navigate('RegisterLogin');
                }
            })}
            {this.getItemView("关于", {uri:'ic_about'}, () => {
                this.props.navigation.navigate('MyWeb', {url:'https://github.com/AnyWayGobin/Reading', desc:'Reading'});
            })}
            {this.state.userName ? this.getItemView("退出登录", {uri:'ic_logout'}, () => {
                Alert.alert("退出登录", "确定要退出吗？", [
                        {text: '确定', onPress: () => {
                            this.fetchLogout()
                            }},
                        {text: '取消', style: 'cancel'}],
                    {cancelable: true });
            }) : null}
        </ScrollView>
    }

    getItemView(action, image, onPress) {
        return <TouchableOpacity activeOpacity={0.6} onPress={onPress}>
            <View style={styles.itemView}>
                <Image style={styles.actionImage} source={image}/>
                <Text style={styles.action}>
                    {action}
                </Text>
            </View>
        </TouchableOpacity>
    }

}

const styles = StyleSheet.create({
    header: {
        backgroundColor: config.colorPrimary,
        height: 150,
        justifyContent: 'center',
        alignItems: 'center',
        ...Platform.select({
            ios: {paddingTop: config.iosPaddingTop},
            android: {}
        })
    },
    avatar: {
        width: 90,
        height: 90,
        borderRadius: 45,
        borderWidth: 2,
        borderColor: 'white',
    },
    userName: {
        color: 'white',
        fontSize: 16,
        marginTop: 20
    },
    itemView: {
        height: 50,
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10
    },
    actionImage: {
        width: 20,
        height: 20,
    },
    action: {
        fontSize: 14,
        color: config.textColorPrimary,
        marginLeft: 15,
    },
});
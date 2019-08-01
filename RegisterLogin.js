import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    TextInput,
    Text,
    TouchableOpacity,
    ToastAndroid, NativeModules,
} from 'react-native';
import StorageOpt from "./StorageOpt"


const REQUEST_REGISTER = "https://www.wanandroid.com/user/register";
const REQUEST_LOGIN = "https://www.wanandroid.com/user/login";


export default class RegisterLogin extends Component {

    // static navigationOptions = ({ navigation }) => {
    //     return {
    //         title: navigation.getParam('otherParam', 'A Nested Details Screen'),
    //     };
    // };

    static navigationOptions = {
      title: "登录注册"
    };

    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            username: '',
            password: ''
        };
        this.fetchRegister = this.fetchRegister.bind(this);
        this.fetchLogin = this.fetchLogin.bind(this);
    }

    _onUserNameChanged = (userName) => {
        this.setState({username: userName});//setState方法是异步的，如果立即执行this.state.username是获取不到值的
        // console.log('username=' + this.state.username)
    };

    _onLoginPress = () => {
        console.log('username=' + this.state.username)
        if ("" === this.state.username) {
            ToastAndroid.show("请输入用户名", ToastAndroid.LONG);
            console.log('username=' + this.username);
            return;
        }
        if ("" === this.state.password) {
            ToastAndroid.show("请输入密码", ToastAndroid.LONG);
            console.log('password=' + this.password);
            return;
        }
        this.fetchLogin();
    };

    _onRegisterPress = () => {
        console.log('username=' + this.state.username)
        if ("" === this.state.username) {
            ToastAndroid.show("请输入用户名", ToastAndroid.LONG);
            console.log('username=' + this.username);
            return;
        }
        if ("" === this.state.password) {
            ToastAndroid.show("请输入密码", ToastAndroid.LONG);
            console.log('password=' + this.password);
            return;
        }
        this.fetchRegister();
    };

    /**
     * 该函数是_onLoginPress函数的一个子组件，所以直接使用this.state会报错undefined is not an object。相当于这个this是_onLoginPress
     * 那如何拿到全局的this呢？就是给fetchRegisterData函数绑定全局的this，即在构造函数中绑定：this.fetchRegisterData = this.fetchRegisterData.bind(this)
     */
    fetchRegister() {
        console.log("request data username=" + this.state.username + " password=" + this.state.password);
        let formData = new FormData();
        formData.append('username', this.state.username);
        formData.append('password', this.state.password);
        formData.append('repassword', this.state.password);
        console.log(formData);

        const request = new Request(REQUEST_REGISTER, {method: 'POST', body: formData});
        fetch(request)
            .then(response => {
            console.log(response.status);
            if (response.status === 200) {
                console.log(response);
                return response.json();
            }
            }).then(result => {
                console.log(result);
                if (result.errorCode === -1) {
                    ToastAndroid.show(result.errorMsg, ToastAndroid.LONG);
                } else if (result.errorCode === 0) {//注册成功
                    this.setIsLogin();
                    this.props.navigation.navigate("Collect")
                }
            })
            .catch((error) => {
                console.log(error)
            })
    }

    fetchLogin() {
        console.log("request data username=" + this.state.username + " password=" + this.state.password);
        let formData = new FormData();
        formData.append('username', this.state.username);
        formData.append('password', this.state.password);
        console.log(formData);

        const request = new Request(REQUEST_LOGIN, {method: 'POST', body: formData});
        fetch(request)
            .then(response => {
                console.log(response.status);
                if (response.status === 200) {
                    console.log(response);
                    const cookie = response.headers.map['set-cookie'];
                    StorageOpt.save("cookie",cookie,null);
                    return response.json();
                }
            }).then(result => {
            console.log(result);
            if (result.errorCode === -1) {
                ToastAndroid.show(result.errorMsg, ToastAndroid.LONG);
            } else if (result.errorCode === 0) {//登录成功
                this.setIsLogin();
                this.props.navigation.navigate("Collect")
            }
        })
            .catch((error) => {
                console.log(error)
            })
    }

    async setIsLogin() {
        try {
            const content  = await NativeModules.CustomModule.setIsLogin(true);
            console.log(content);
        }catch (e) {
            console.error(e);
        }
    }

    render() {

        return (
            <View style={styles.container}>
                <TextInput style={styles.textInput} underlineColorAndroid='black'
                    placeholder="用户名"
                    onChangeText={this._onUserNameChanged}/>
                <TextInput style={styles.textInput} underlineColorAndroid='black'
                    placeholder="密码"
                           secureTextEntry={true}
                    onChangeText={(text) => {this.setState({password:text})}}/>
                <TouchableOpacity style={styles.button} onPress={this._onLoginPress}>
                    <Text style={{color:'white'}}>登 录</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={this._onRegisterPress}>
                    <Text style={{color:'white'}}>注 册</Text>
                </TouchableOpacity>

                {/*<Button title="Go to RegisterLogin by navigate" onPress={() => this.props.navigation.navigate("RegisterLogin")}/>

                <Button title="Go to RegisterLogin by push" onPress={() => this.props.navigation.push("RegisterLogin")}/>

                <Button title="Go to Collect by navigate" onPress={() => this.props.navigation.navigate("Collect")}/>

                <Button title="Go to Collect by push" onPress={() => this.props.navigation.push("Collect")}/>
                <Button title="Go Back" onPress={() => this.props.navigation.goBack()}/>*/}
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
        backgroundColor: 'skyblue',
        padding: 10,
        margin: 20,
        borderRadius: 5
    }
});
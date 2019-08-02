import React, {Component} from 'react';

import RegisterLogin from './RegisterLogin'
import {
    createBottomTabNavigator,
    createAppContainer, createMaterialTopTabNavigator, createStackNavigator,
} from 'react-navigation';
import {
    StyleSheet,
    View,
    Image,
    Text,
    TouchableOpacity,
    ToastAndroid, NativeModules,
} from 'react-native';

import AndroidGank from "./AndroidGank";
import Ganks from "./Ganks";
import Welfare from "./Welfare";
import MyWeb from "./MyWeb";
import ImagePreView from "./ImagePreView";
import WanAndroid from "./WanAndroid";

const topTabNavigator = createMaterialTopTabNavigator({
        AndroidGank: AndroidGank,
        Ganks: Ganks,
        Welfare: Welfare,
    },
    {
        initialRouteName : "AndroidGank",
    });

const TopTabStack = createStackNavigator({
    HomeTab: {
        screen: topTabNavigator,
        navigationOptions: {
            header: null,
        },
    },
    MyWeb: MyWeb,
    ImagePreView: ImagePreView
});

const navigator = createBottomTabNavigator({
        WanAndroid: WanAndroid,
        Home: {
            screen:TopTabStack,
            navigationOptions:() =>({
                tabBarLabel:"主页",
                /*tabBarIcon: ({ tintColor }) => (
                    <Image
                        source={require('./img/ic_action_collection.png')}
                        style={[styles.icon, { tintColor: tintColor }]}
                    />
                )*/
            })
        },
        RegisterLogin: RegisterLogin,
    });


const AppContainer = createAppContainer(navigator);

export default class App extends React.Component {
    render() {
        return <AppContainer />;
    }
}
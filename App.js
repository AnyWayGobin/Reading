import React, {Component} from 'react';

import {
    createBottomTabNavigator,
    createAppContainer, createMaterialTopTabNavigator, createStackNavigator,
} from 'react-navigation';

import AndroidGank from "./AndroidGank";
import Ganks from "./Ganks";
import Welfare from "./Welfare";
import MyWeb from "./MyWeb";
import ImagePreView from "./ImagePreView";
import WanAndroid from "./WanAndroid";
import KnowledgeTree from "./KnowledgeTree";
import DetailKnowledge from "./DetailKnowledge";
import HotMovie from "./HotMovie";
import CommingMovie from "./CommingMovie";
import MovieDetail from "./MovieDetail";
import RegisterLogin from './RegisterLogin';
import Duanzi from './Duanzi';


//-----------------------------主页（玩安卓）-----------------------------------

const wanAndroidTabNavigator = createMaterialTopTabNavigator({
        WanAndroid: WanAndroid,
        KnowledgeTree: KnowledgeTree,
    },
    {
        initialRouteName : "WanAndroid",
    });

const WanAndroidTabStack = createStackNavigator({
    WanAndroidTab: {
        screen: wanAndroidTabNavigator,
        navigationOptions: {
            header: null,
        },
    },
    DetailKnowledge: DetailKnowledge,
    MyWeb: MyWeb,
    RegisterLogin: RegisterLogin
});

//----------------------------发现（干货）------------------------------------

const FoundTabNavigator = createMaterialTopTabNavigator({
        AndroidGank: AndroidGank,
        Ganks: Ganks,
        Welfare: Welfare,
    },
    {
        initialRouteName : "AndroidGank",
    });

const FoundTabStack = createStackNavigator({
    FoundTab: {
        screen: FoundTabNavigator,
        navigationOptions: {
            header: null,
        },
    },
    MyWeb: MyWeb,
    ImagePreView: ImagePreView
});

//----------------------------豆瓣------------------------------------

const DouBanTabNavigator = createMaterialTopTabNavigator({
        HotMovie: HotMovie,
        CommingMovie: CommingMovie,
    },
    {
        initialRouteName : "HotMovie",
    });

const DouBanTabStack = createStackNavigator({
    DouBanTab: {
        screen: DouBanTabNavigator,
        navigationOptions: {
            header: null,
        },
    },
    MovieDetail: MovieDetail,
});


//----------------------------底部TAB页------------------------------------

const navigator = createBottomTabNavigator({
        WanAndroidTab: {
            screen:WanAndroidTabStack,
            navigationOptions:{
                tabBarLabel:"主页",
            }
        },
        FoundTab: {
            screen:FoundTabStack,
            navigationOptions: {
                tabBarLabel:"发现",
                /*tabBarIcon: ({ tintColor }) => (
                    <Image
                        source={require('./img/ic_action_collection.png')}
                        style={[styles.icon, { tintColor: tintColor }]}
                    />
                )*/
            }
        },
        DouBanTab: {
            screen:DouBanTabStack,
            navigationOptions:{
                tabBarLabel:"豆瓣",
            }
        },
        Duanzi: Duanzi,
    });


const AppContainer = createAppContainer(navigator);

export default class App extends React.Component {
    render() {
        return <AppContainer />;
    }
}
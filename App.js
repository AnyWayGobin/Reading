import React, {Component} from 'react';

import {
    createBottomTabNavigator,
    createAppContainer, createMaterialTopTabNavigator, createStackNavigator,createDrawerNavigator
} from 'react-navigation';
import {Image, StyleSheet} from "react-native";

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
import More from './More';
import Collect from './Collect';
import Duanzi from './Duanzi';
import DrawerPage from "./DrawerPage";


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
});

//----------------------------发现（干货）------------------------------------

const FoundTabNavigator = createMaterialTopTabNavigator({
        AndroidGank: AndroidGank,
        Ganks: Ganks,
        Welfare: Welfare,
        Duanzi: Duanzi
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
});

const MoreTabNavigator = createMaterialTopTabNavigator({
        More: More,
    },
    {
        initialRouteName : "More",
        navigationOptions:{
            tabBarLabel:"更多",
        },
        tabBarOptions:{
            indicatorStyle:{height:0}
        }
    });


//----------------------------底部TAB页------------------------------------

const bottomNavigator = createBottomTabNavigator({
        WanAndroidTab: {
            screen:WanAndroidTabStack,
            navigationOptions:{
                tabBarLabel:"主页",
                tabBarIcon: ({ tintColor }) => (
                    <Image
                        source={{uri:'ic_home'}}
                        style={[styles.tabBar, { tintColor: tintColor }]}
                    />
                )
            }
        },
        FoundTab: {
            screen:FoundTabStack,
            navigationOptions: {
                tabBarLabel:"发现",
                tabBarIcon: ({ tintColor }) => (
                    <Image
                        source={{uri:'ic_project'}}
                        style={[styles.tabBar, { tintColor: tintColor }]}
                    />
                )
            }
        },
        DouBanTab: {
            screen:DouBanTabStack,
            navigationOptions:{
                tabBarLabel:"豆瓣",
                tabBarIcon: ({ tintColor }) => (
                    <Image
                        source={{uri:'ic_navigation'}}
                        style={[styles.tabBar, { tintColor: tintColor }]}
                    />
                )
            }
        },
        More: {
            screen:More,
            navigationOptions:{
                tabBarLabel:"更多",
                tabBarIcon: ({ tintColor }) => (
                    <Image
                        source={{uri:'ic_dashboard'}}
                        style={[styles.tabBar, { tintColor: tintColor }]}
                    />
                )
            }
        }
    });

const Main = createDrawerNavigator(
    {
        home: {
            screen: bottomNavigator,
            navigationOptions: {
                drawerLockMode: "unlocked",
            }
        }
    },
    {
        drawerWidth: 250,
        drawerPosition: "left",
        drawerType: 'slide',
        contentComponent: DrawerPage,
        drawerLockMode: "locked-open",
        initialRouteName: 'home',
        contentOptions: {},
    });

const RootStack = createStackNavigator({
    BottomNavigator: {
        screen: Main,
        navigationOptions: {
            header: null,
        },
    },
    RegisterLogin: RegisterLogin,
    Collect: Collect,
    MyWeb: MyWeb,
    DetailKnowledge: DetailKnowledge,
    ImagePreView: ImagePreView,
    MovieDetail: MovieDetail,
    Duanzi:Duanzi
});


const AppContainer = createAppContainer(RootStack);

export default class App extends React.Component {
    render() {
        return <AppContainer />;
    }
}

const styles = StyleSheet.create({
    tabBar: {
        width: 25,
        height: 25,
    }
});
import React, {Component} from 'react';

import AndroidGank from './AndroidGank'
import Welfare from './Welfare'
import Ganks from './Ganks'
import MyWeb from './MyWeb'
import ImagePreView from './ImagePreView'
import { createMaterialTopTabNavigator, createAppContainer,createStackNavigator } from 'react-navigation';


const navigator = createMaterialTopTabNavigator({
        AndroidGank: AndroidGank,
        Ganks: Ganks,
        Welfare: Welfare,
    },
    {
        initialRouteName : "AndroidGank",
    });

const TabStack = createStackNavigator({
    Home: {
        screen: navigator,
        navigationOptions: {
            header: null
        },
    },
    MyWeb: MyWeb,
    ImagePreView: ImagePreView
});

const AppContainer = createAppContainer(TabStack);

export default class App extends React.Component {
    render() {
        return <AppContainer />;
    }
}
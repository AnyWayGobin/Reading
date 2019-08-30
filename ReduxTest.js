import React, {Component} from 'react';
import {
    Image,
    FlatList,
    StyleSheet,
    Text,
    View,
    ActivityIndicator,
    TouchableOpacity, DeviceEventEmitter, ToastAndroid,BackHandler
} from "react-native";
import { createStore } from 'redux'
import {counter} from './src/reducers/CountReducers'
import {increment, decrement, idecrement} from './src/actions/CountActions'


let store = createStore(counter);

/*function counter(state, action) {
    switch (action.type) {
        case 'INCREMENT':
            return action.default + action.value;
        case 'DECREMENT':
            return action.default - action.value;
        default:
            return action.default
    }
}*/

let unsubscribe;

/**
 * 玩安卓
 */
export default class ReduxTest extends Component {

    static navigationOptions = {
        title: "玩安卓"
    };

    constructor(props) {
        super(props);
        this.state = {
            result:''
        };
        unsubscribe = store.subscribe(() => {
            console.log(store.getState());
            this.setState({
                result:store.getState()
            });
        });
    }

    componentWillUnmount() {
        unsubscribe();
    }


    render() {
        return (
            <View style={styles.container}>
                <Text onPress={this._clickItem}>+</Text>
                <Text/>
                <Text/>
                <Text/>
                <Text onPress={this._clickItem2}>-</Text>
                <Text/>
                <Text/>
                <Text/>
                <Text>result={this.state.result}</Text>
            </View>
        );
    }

    _clickItem = () => {
        store.dispatch(increment(3));
        // store.dispatch({ type: 'INCREMENT',value: 3, default: 2 });
    };

    _clickItem2 = () => {
        store.dispatch(idecrement());
        // store.dispatch(decrement(2));
        // store.dispatch({ type: 'DECREMENT',value: 3, default: 2 });
    };

}



const styles = StyleSheet.create({

    container: {
        flex: 1,
        flexDirection: 'column',
        // justifyContent: 'flex-start',
        // alignItems: 'flex-start'
    },
});

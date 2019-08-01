import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    FlatList,
    Button
} from 'react-native';
import StorageOpt from "./StorageOpt"

const REQUEST_COLLECT_LIST = "https://www.wanandroid.com/lg/collect/list/0/json";//收藏列表

export default class Collect extends Component {

    static navigationOptions = {
        title: "收藏列表"
    };

    constructor(props) {
        super(props);
        this.state = {
            header: {}
        };
    }

    componentWillMount() {
        StorageOpt.loaddata("cookie", (result) => {
            const request = new Request(REQUEST_COLLECT_LIST, {method: 'GET', headers:{Cookie: result}});
            console.log("request headers = " + request.headers.get("Cookie"));
            fetch(request)
                .then((response) => {
                    console.log(response);
                    return response.json();
                })
                .then((result) => {
                    this.setState({
                        isLoading: false,
                    });
                    console.log(result);
                })
                .catch((error) => {
                    console.log(error)
                });
            this.setState({headers:{Cookie: result}});
        });
        console.log("componentWillMount");
        /*StorageOpt.loaddata("cookie", (result) => {
            console.log(result);
            this.setState({headers:{Cookie: result}});
        });
        console.log("componentWillMount");
        return fetch(REQUEST_COLLECT_LIST, this.state.header)
            .then((response) => {
                console.log(response);
                return response.json();
            })
            .then((result) => {
                this.setState({
                    isLoading: false,
                });
                console.log(result);
            })
            .catch((error) => {
                console.log(error)
            })*/
    }

    render() {
        return (
            <View style={styles.container}>
                <Text>s</Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    toolbar: {
        width: '100%',
        height: 56,
        backgroundColor:'#FFFFFF'
    },
});
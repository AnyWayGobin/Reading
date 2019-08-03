import React, { Component } from 'react';
import {Text, StyleSheet, View} from 'react-native';
import FlowView from './FlowLayout'

const REQUEST_URL = "https://www.wanandroid.com/tree/json";

export default class KnowledgeTree extends Component {

    constructor(props) {
        super(props);
        this.state = {
            dataArray: [],
        };
    }

    componentDidMount() {
        this.fetchData();
    }

    fetchData() {
        fetch(REQUEST_URL)
            .then((response) => {
                return response.json();
            })
            .then((responseData) => {
                let data = responseData.data;
                console.log(data);
                this.setState({
                    //复制数据源
                    dataArray: this.state.dataArray.concat(data),
                });
                data = null;
            })
            .catch((error) => {
                console.log(error)
            });
    }


    render() {
        let items = this.state.dataArray.map((value, position) => {
            return (
                <View key={position}>
                    <FlowView  ref ={this.state.dataArray[position]} text={value.name} />
                </View>
            );
        });

        return (
            <View style={styles.container}>
                {items}
            </View>
        );
    }
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
    },
});
import React, { Component } from 'react';
import {Text, StyleSheet, View, ScrollView} from 'react-native';
import FlowView from './FlowLayout'
import PropTypes from "prop-types";

const REQUEST_URL = "https://www.wanandroid.com/tree/json";

export default class KnowledgeTree extends Component {

    constructor(props) {
        super(props);
        this.state = {
            dataArray: [],
            selectedState: []
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
                // console.log(data);
                this.setState({
                    //复制数据源
                    dataArray: this.state.dataArray.concat(data),
                    selectedState: new Array(data.length).fill(false)
                });
                data = null;
            })
            .catch((error) => {
                console.log(error)
            });
    }

    async change() {
        for (let i = 0; i < this.state.selectedState.length; i++) {
            console.log(i);
            /*console.log(this.state.dataArray);
            let item = this.refs[this.state.dataArray[i]];
            console.log(item);
            if (item) {
                item.setSelected(this.state.selectedState[i]);
            }*/
        }
    }
    getSelectedPosition() {
        let list = [];
        this.state.selectedState.forEach((value, key) => {
            if (value) {
                list.push(key);
            }
        });
        return list;
    }
    resetData() {
        this.setState({
            selectedState: new Array(this.state.dataArray.length).fill(false),
        }, () => {
            this.change();
        })
    }


    render() {
        let items = this.state.dataArray.map((value, position) => {
            return (
                <View key={position}>
                    <FlowView  ref ={this.state.dataArray[position]} text={value.name} onClick={()=>{
                        for (let i = this.state.selectedState.length - 1; i >= 0; i--) {
                            if(i===position){
                                continue;
                            }
                            if (this.state.selectedState[i] === true) {
                                this.state.selectedState[i] = false;
                                break;
                            }
                        }
                        this.state.selectedState[position] = !this.state.selectedState[position];

                        this.change();
                    }}/>
                </View>
            );
        });

        return (
            <ScrollView>
                <View style={styles.container}>
                    {items}
                </View>
            </ScrollView>
        );
    }
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'flex-start',
        width: null,
    },
});
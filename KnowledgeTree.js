import React, { Component } from 'react';
import {Text, StyleSheet, View, ScrollView} from 'react-native';
import FlowView from './FlowLayout'
import PropTypes from "prop-types";

const REQUEST_URL = "https://www.wanandroid.com/tree/json";

export default class KnowledgeTree extends Component {

    static propTypes = {
        dataArray: PropTypes.array,
    };

    constructor(props) {
        super(props);
        this.state = {
            dataArray: [],
            secLevelDataArray: [],
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
                this.setState({
                    //复制数据源
                    dataArray: this.state.dataArray.concat(data),
                    secLevelDataArray: data[0].children,
                    selectedState: new Array(data.length).fill(false),
                }, ()=> {
                    console.log("callback");
                    this.state.selectedState[0] = true;
                });
                data = null;
            })
            .catch((error) => {
                console.log(error)
            });
    }

    change() {
        for (let i = 0; i < this.state.selectedState.length; i++) {
            let item = this.refs[this.state.dataArray[i].name];
            if (item) {
                item.setSelected(this.state.selectedState[i]);
            }
        }
    }

    setSecLevelData(data) {
        this.setState({
            secLevelDataArray: data.children
        })
    }

    render() {
        let items = this.state.dataArray.map((value, position) => {
            return (
                <FlowView ref ={this.state.dataArray[position].name} text={value.name} isSelected={position === 0} onClick={()=>{
                    for (let i = this.state.selectedState.length - 1; i >= 0; i--) {
                        if (this.state.selectedState[i] === true) {
                            this.state.selectedState[i] = false;
                            break;
                        }
                    }
                    this.state.selectedState[position] = !this.state.selectedState[position];
                    this.change();
                    this.setSecLevelData(this.state.dataArray[position]);
                }}/>
            );
        });

        let secLevelItems = this.state.secLevelDataArray.map((value, position) => {
            return (
                <FlowView ref ={this.state.secLevelDataArray[position].name} text={value.name} onClick={()=>{
                    console.log("secLevelItems");
                }}/>
            );
        });

        return (
            <ScrollView>
                <View style={styles.container}>
                    <Text>一级分类</Text>
                    <View style={styles.firstLevel}>
                        {items}
                    </View>
                    <Text>二级分类</Text>
                    <View style={styles.firstLevel}>
                        {secLevelItems}
                    </View>
                </View>
            </ScrollView>
        );
    }
};

const styles = StyleSheet.create({

    container: {
        flex: 1,
    },

    firstLevel: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'flex-start',
        width: null,
    },
});
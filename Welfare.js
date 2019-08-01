import React, {Component} from 'react';
import { Image, FlatList, StyleSheet, Text, View, ActivityIndicator,TouchableOpacity  } from "react-native";

let pageNo = 1;//当前第几页
const REQUEST_URL = "https://gank.io/api/data/福利/10/";
let itemNo=0;//item的个数

/**
 * 福利
 */
export default class Welfare extends Component {

    static navigationOptions = {
        title: "福利"
    };

    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            //网络请求状态
            error: false,
            errorInfo: "",
            dataArray: [],
            showFoot:0, // 控制foot， 0：隐藏footer  1：已加载完成,没有更多数据   2 ：显示加载中
        };
    }

    componentDidMount() {
        this.fetchData(pageNo);
    }

    fetchData(pageNo) {
        fetch(REQUEST_URL + pageNo)
            .then((response) => {
                return response.json();
            })
            .then((responseData) => {
                let data = responseData.results;
                let dataBlob = [];
                let i = itemNo;

                data.map(function (item) {
                    dataBlob.push({
                        key: i,
                        value: item,
                    });
                    i++;
                });
                itemNo = i;
                let foot = 0;
                if (data.length === 0 || pageNo === 8) {
                    foot = 1;
                }

                this.setState({
                    //复制数据源
                    dataArray:this.state.dataArray.concat(dataBlob),
                    isLoading: false,
                    showFoot:foot,
                });
                data = null;
                dataBlob = null;
            })
            .catch((error) => {
                console.log(error)
            });
    }

    render() {
        if (this.state.isLoading) {
            return this.renderLoadingView();
        }
        return (
            <FlatList
                data={this.state.dataArray}
                renderItem={this.renderWelfare.bind(this)}
                ListFooterComponent={this._renderFooter.bind(this)}
                onEndReached={this._onEndReached.bind(this)}
                onEndReachedThreshold={0.002}
                keyExtractor={item => item.id}
                horizontal={false}
                numColumns = "2"
            />
        );
    }

    renderLoadingView() {
        return (
            <View style={styles.container}>
                <ActivityIndicator
                    animating={true}
                    color='blue'
                    size="large"
                />
            </View>
        );
    }

    renderWelfare({ item }) {
        return (
            <View style={styles.container}>
                <TouchableOpacity onPress={this._clickImage.bind(this, item.key)}>
                    <Image source={{ uri: item.value.url }} style={styles.image}/>
                </TouchableOpacity>
            </View>
        );
    }

    _clickImage = (index) => {
        this.props.navigation.navigate("ImagePreView", {urls: this.state.dataArray, index: index});
    };

    _renderFooter(){
        if (this.state.showFoot === 1) {
            return (
                <View style={styles.noMoreData}>
                    <Text>没有更多数据了</Text>
                </View>
            );
        } else if(this.state.showFoot === 2) {
            return (
                <View style={styles.footer}>
                    <ActivityIndicator />
                    <Text>正在加载更多数据...</Text>
                </View>
            );
        } else if(this.state.showFoot === 0){
            return (
                <View style={styles.footer}>
                    <Text></Text>
                </View>
            );
        }
    }

    _onEndReached(){
        //如果是正在加载中或没有更多数据了，则返回
        if(this.state.showFoot !== 0 ){
            return ;
        }
        pageNo++;
        //底部显示正在加载更多数据
        this.setState({showFoot:2});
        //获取数据
        this.fetchData( pageNo );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        width: 160,
        height: 180,
        marginTop: 10,
        borderRadius:10,
    },
    footer:{
        flexDirection:'row',
        height:24,
        justifyContent:'center',
        alignItems:'center',
        marginTop: 10,
        marginBottom: 10,
    },
    noMoreData: {
        flexDirection:'row',
        height:30,
        justifyContent:'center',
        alignItems:'center',
        marginTop: 10,
        marginBottom: 10,
        color:'#999999',
        fontSize:14
    }
});

import React, {Component} from 'react';


import MyWeb from "./MyWeb";
import {ActivityIndicator, FlatList, Image, StyleSheet, Text, ToastAndroid, TouchableOpacity, View} from "react-native";
import StorageOpt from "./StorageOpt";

let pageNo = 0;//当前第几页
let cId = -1;
let cookie = "";

export default class DetailKnowledge extends React.Component {

    static navigationOptions = ({ navigation }) => ({

        title: `${navigation.state.params.title}`,
        headerStyle: {
            backgroundColor: '#549cf8',
        },
        headerTintColor: '#fff',
    });

    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            dataArray: [],
            showFoot: 0, // 控制foot， 0：隐藏footer  1：已加载完成,没有更多数据   2 ：显示加载中
        };
    }

    componentDidMount() {
        const { navigation } = this.props;
        cId = navigation.getParam('cid', '-1');

        StorageOpt.loaddata("cookie", (result) => {
            cookie = result;
            pageNo = 0;
            this.fetchData(pageNo);
        });
    }

    fetchData(pageNo) {
        const REQUEST_URL = "https://www.wanandroid.com/article/list/" + pageNo + "/json?cid=";
        fetch(REQUEST_URL + cId, {method : 'GET', headers: {'Cookie': cookie}})
            .then((response) => {
                return response.json();
            })
            .then((responseData) => {
                let data = responseData.data.datas;

                let foot = 0;
                if (data.length === 0) {
                    foot = 1;
                }
                this.setState({
                    //复制数据源
                    dataArray: this.state.dataArray.concat(data),
                    showFoot: foot,
                    isLoading: false,
                });
                data = null;
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
                renderItem={this.renderData.bind(this)}
                ListFooterComponent={this._renderFooter.bind(this)}
                onEndReached={this._onEndReached.bind(this)}
                ItemSeparatorComponent={ItemDivideComponent}
                onEndReachedThreshold={0.1}
                keyExtractor={item => item.id}
            />
        );
    }

    renderLoadingView() {
        return (
            <View style={styles.loading}>
                <ActivityIndicator
                    animating={true}
                    color='#549cf8'
                    size="large"
                />
            </View>
        );
    }

    renderData({item}) {
        return (
            <View style={styles.container}>
                <View style={styles.authorTime}>
                    <Text style={{margin: 5}} onPress={this._clickItem.bind(this, item)}>{item.title}</Text>
                </View>
                <View style={styles.authorTime}>
                    <Text style={styles.author}>{item.niceDate}.{item.author}</Text>
                    <TouchableOpacity onPress={this._clickCollect.bind(this, item)}>
                        <Image source={{uri: item.collect ? 'ic_collected' : 'ic_uncollect'}} style={{width:25,height:25,marginRight: 5, marginBottom: 5}}/>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    _clickItem = (item) => {
        this.props.navigation.navigate("MyWeb", {url: item.link, desc: item.title});
    };

    _clickCollect = (item) => {
        if (cookie === null || cookie === "") {
            this.props.navigation.navigate("RegisterLogin");
        } else {
            if (item.collect) {
                const unCollectUrl = "https://www.wanandroid.com/lg/uncollect_originId/" + item.id + "/json";
                this.collectFetchData(unCollectUrl, "collect", item);
            } else {
                const collectUrl = "https://www.wanandroid.com/lg/collect/" + item.id + "/json";
                this.collectFetchData(collectUrl, "", item);
            }
        }
    };

    collectFetchData(url, type, item) {
        fetch(url, {method : 'POST', headers: {'Cookie': cookie}})
            .then((response) => {
                return response.json();
            })
            .then((responseData) => {
                if (responseData.errorCode === 0) {//执行成功
                    this.modifyDataArray(this.state.dataArray, item);
                    if (type === "collect") {
                        ToastAndroid.show("已取消收藏", ToastAndroid.SHORT);
                    } else {
                        ToastAndroid.show("收藏成功", ToastAndroid.SHORT);
                        this.props.navigation.navigate("Collect");
                    }
                } else {
                    if (type === "collect") {
                        ToastAndroid.show("取消收藏失败", ToastAndroid.SHORT);
                    } else {
                        ToastAndroid.show("收藏失败", ToastAndroid.SHORT);
                    }
                }
            })
            .catch((error) => {
                console.log(error)
            });
    }

    modifyDataArray(_arr, _obj) {
        let length = _arr.length;
        for (let i = 0; i < length; i++) {
            if (_arr[i].id === _obj.id) {
                this.state.dataArray[i].collect = !this.state.dataArray[i].collect;
                break;
            }
        }
        this.setState({
            dataArray: this.state.dataArray
        });
    }

    _renderFooter() {
        if (this.state.showFoot === 1) {
            return (
                <View style={styles.noMoreData}>
                    <Text>没有更多数据了</Text>
                </View>
            );
        } else if (this.state.showFoot === 2) {
            return (
                <View style={styles.footer}>
                    <ActivityIndicator animating={true}
                                       color='#549cf8'
                                       size="small"/>
                    <Text>正在加载更多数据...</Text>
                </View>
            );
        } else if (this.state.showFoot === 0) {
            return (
                <View style={styles.footer}>
                    <Text></Text>
                </View>
            );
        }
    }

    _onEndReached() {
        //如果是正在加载中或没有更多数据了，则返回
        if (this.state.showFoot !== 0) {
            return;
        }
        pageNo++;
        this.setState({
            showFoot: 2,
        });
        //获取数据
        this.fetchData(pageNo);
    }

}

class ItemDivideComponent extends Component {
    render() {
        return (
            <View style={{height: 1, backgroundColor: '#549cf8'}}/>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
    },
    loading: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
    },
    authorTime: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    author: {
        margin: 5,
        color: 'gray',
        fontSize: 10,
    },
    footer: {
        flexDirection: 'row',
        height: 24,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 10,
    },
    noMoreData: {
        flexDirection: 'row',
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 10,
        color: '#999999',
        fontSize: 14
    },
});
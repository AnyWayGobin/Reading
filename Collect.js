import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    FlatList,
    ActivityIndicator, TouchableOpacity, Image, ToastAndroid
} from 'react-native';
import StorageOpt from "./StorageOpt"

let pageNo = 0;//当前第几页
let cookie = "";

export default class Collect extends Component {

    static navigationOptions = {
        title: "收藏列表",
        headerStyle: {
            backgroundColor: '#549cf8',
        },
        headerTintColor: '#fff',
    };

    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            isRefreshing: false,
            //网络请求状态
            error: false,
            errorInfo: "",
            dataArray: [],
            showFoot: 0, // 控制foot， 0：隐藏footer  1：已加载完成,没有更多数据   2 ：显示加载中
        };
    }

    componentWillMount() {
        StorageOpt.loaddata("cookie", (result) => {
            cookie = result;
            pageNo = 0;
            this.fetchData(pageNo);
        });
    }

    fetchData(pageNo) {
        const reqUrl = "https://www.wanandroid.com/lg/collect/list/" + pageNo + "/json";
        const request = new Request(reqUrl, {method: 'GET', headers: {'Cookie': cookie}});
        fetch(request)
            .then((response) => {
                return response.json();
            })
            .then((responseData) => {
                let data = responseData.data.datas;
                /**
                 * 这里改变dataArray的值是因为防止下拉刷新数据的时候，屏幕闪烁
                 */
                if (this.state.isRefreshing) {
                    this.setState({
                        dataArray:[]
                    })
                }

                let foot = 0;
                if (data.length === 0) {
                    foot = 1;
                }
                this.setState({
                    //复制数据源
                    dataArray: this.state.dataArray.concat(data),
                    showFoot: foot,
                    isLoading: false,
                    isRefreshing: false,
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
                onRefresh={this._onRefresh.bind(this)}
                refreshing={this.state.isRefreshing}
                ItemSeparatorComponent={ItemDivideComponent}
                onEndReachedThreshold={0.1}
                keyExtractor={item => item.id} />
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
                    <Text></Text>
                    <Text style={{margin: 5}}>{item.chapterName}</Text>
                </View>
                <View style={styles.authorTime}>
                    <Text style={{margin: 5}} onPress={this._clickItem.bind(this, item)}>{item.title}</Text>
                </View>
                <View style={styles.authorTime}>
                    <Text style={styles.author}>{item.niceDate}.{item.author}</Text>
                    <TouchableOpacity onPress={this.unCollectFetchData.bind(this, item)}>
                        <Image source={{uri: 'ic_collected'}} style={{width:25,height:25,marginRight: 5, marginBottom: 5}}/>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    _clickItem = (item) => {
        this.props.navigation.navigate("MyWeb", {url: item.link, desc: item.title});
    };

    unCollectFetchData(item) {
        const url = "https://www.wanandroid.com/lg/uncollect/" + item.id + "/json";
        let formData = new FormData();
        if (item.originId === null || item.originId === "") {
            formData.append('originId', "-1");
        } else {
            formData.append('originId', item.originId);
        }
        fetch(url, {method : 'POST', headers: {'Cookie': cookie}, body: formData})
            .then((response) => {
                return response.json();
            })
            .then((responseData) => {
                if (responseData.errorCode === 0) {//执行成功
                    ToastAndroid.show("已取消收藏", ToastAndroid.SHORT);
                    let data = this.removeArray(this.state.dataArray, item);
                    this.setState({
                        dataArray: data
                    });
                    data = null;
                } else {
                    ToastAndroid.show("取消收藏失败", ToastAndroid.SHORT);
                }
            })
            .catch((error) => {
                console.log(error)
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

    _onRefresh() {
        this.setState({
            isRefreshing:true,
        });
        pageNo = 0;
        this.fetchData(pageNo);
    }

    removeArray(_arr, _obj) {
        let length = _arr.length;
        for (let i = 0; i < length; i++) {
            if (_arr[i].id === _obj.id) {
                if (i === 0) {
                    _arr.shift(); //删除并返回数组的第一个元素
                    return _arr;
                }
                else if (i === length - 1) {
                    _arr.pop();  //删除并返回数组的最后一个元素
                    return _arr;
                }
                else {
                    _arr.splice(i, 1); //删除下标为i的元素
                    return _arr;
                }
                break;
            }
        }
        return _arr;
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
        justifyContent: 'space-between',
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
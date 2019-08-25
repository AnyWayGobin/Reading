import React, {Component} from 'react';
import {
    Image,
    FlatList,
    StyleSheet,
    Text,
    View,
    ActivityIndicator,
    TouchableOpacity, Alert, ToastAndroid,BackHandler
} from "react-native";
import StorageOpt from "./StorageOpt";
const REQUEST_URL = "https://wanandroid.com/wxarticle/list/";

let pageNo = 1;
let cookie = "";
/**
 * 玩安卓的公众号
 */
export default class ArticleListPage extends Component {

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

    componentDidMount() {
        this.fetchData()
    }

    fetchData() {
        const requestUrl = REQUEST_URL + this.props.chapterId + "/" + pageNo + "/json";
        fetch(requestUrl)
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
                style={{backgroundColor: 'lightgrey'}}
                data={this.state.dataArray}
                renderItem={this.renderData}
                ListFooterComponent={this._renderFooter.bind(this)}
                onEndReached={this._onEndReached.bind(this)}
                onRefresh={this._onRefresh.bind(this)}
                refreshing={this.state.isRefreshing}
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

    renderData = ({item}) => {
        return (
            <TouchableOpacity activeOpacity={0.6} onPress={this._clickItem.bind(this, item)}>
                <View style={styles.container}>
                    <View style={styles.authorTime}>
                        <Image source={{uri: item.fresh ? 'icon_new' : ''}} style={{width:25 ,height:25, marginLeft: 5}}/>
                        <Text style={{margin: 10}}>公众号/{item.chapterName}</Text>
                    </View>
                    <View style={styles.authorTime}>
                        <Text style={{margin: 10}} >{item.title}</Text>
                    </View>
                    <View style={styles.authorTime}>
                        <Text style={styles.author}>{item.niceDate}.{item.author}</Text>
                        <TouchableOpacity onPress={this._clickCollect.bind(this, item)}>
                            <Image source={{uri: item.collect ? 'ic_collected' : 'ic_uncollect'}} style={{width:25,height:25,marginRight: 5, marginBottom: 5}}/>
                        </TouchableOpacity>
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

    _clickItem = (item) => {
        this.props.navigation.navigate("MyWeb", {url: item.link, desc: item.title});
    };

    _clickCollect = (item) => {
        StorageOpt.loaddata("cookie", (result) => {
            cookie = result;
            if (result) {
                if (item.collect) {
                    Alert.alert("取消收藏", "您确定取消收藏吗？",[
                            {text: '确定', onPress: () => {
                                    const unCollectUrl = "https://www.wanandroid.com/lg/uncollect_originId/" + item.id + "/json";
                                    this.collectFetchData(unCollectUrl, "collect", item);
                                }},
                            {text: '取消', style: 'cancel'}],
                        {cancelable: true });
                } else {
                    const collectUrl = "https://www.wanandroid.com/lg/collect/" + item.id + "/json";
                    this.collectFetchData(collectUrl, "", item);
                }
            } else {
                this.props.navigation.navigate("RegisterLogin");
            }
        });
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

    _onRefresh() {
        this.setState({
            isRefreshing:true,
        });
        pageNo = 1;
        this.fetchData(pageNo);
    }
}

const styles = StyleSheet.create({
    wrapper: {
        height: 200,
    },
    slide: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: 'transparent'
    },
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: 'white',
        margin: 5,
        padding: 5,
        borderRadius: 10,
        // justifyContent: 'flex-start',
        // alignItems: 'flex-start'
    },
    loading: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
    },
    image: {
        width: null,
        height: 200,
    },
    authorTime: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    author: {
        margin: 10,
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

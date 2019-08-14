import React, {Component} from 'react';
import {
    Image,
    FlatList,
    StyleSheet,
    Text,
    View,
    ActivityIndicator,
    ScrollView,
    TouchableOpacity, DeviceEventEmitter, ToastAndroid
} from "react-native";
import StorageOpt from "./StorageOpt"
import Swiper from 'react-native-swiper';

const EVENT_NAME = "notifyChangeData";
let category = "list";
let pageNo = 0;//当前第几页
const REQUEST_BANNER_URL = "https://www.wanandroid.com/banner/json";

let cookie = "";

/**
 * 玩安卓
 */
export default class WanAndroid extends Component {

    static navigationOptions = {
        title: "玩安卓"
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

    componentDidMount() {
        StorageOpt.loaddata("cookie", (result) => {
            cookie = result;
            console.log("componentWillMount=" + result);
            this.fetchData(category, pageNo);
        });
        this.listener = DeviceEventEmitter.addListener(EVENT_NAME, (newCategory) => {
            console.log("listener = " + newCategory);
            category = newCategory;
            pageNo = 0;
            this.fetchData(category, pageNo);
            this.setState({
                isRefreshing: true,
                isLoading: false
            });
        });
    }

    componentWillUnmount() {
        if (this.listener) {
            this.listener.remove();
        }
    }

    fetchData(category, pageNo) {
        const requestUrl = "https://www.wanandroid.com/article/" + category + "/" + pageNo + "/json";
        fetch(requestUrl, {method : 'GET', headers: {'Cookie': cookie}})
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
                ListHeaderComponent={FlatListHeaderComponent}
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
                    <TouchableOpacity onPress={this._clickCollect.bind(this, item)}>
                        <Image source={item.collect ? require('./image/ic_collected.png') : require('./image/ic_uncollect.png')} style={{width:25,height:25,marginRight: 5, marginBottom: 5}}/>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    _clickItem = (item) => {
        this.props.navigation.navigate("MyWeb", {url: item.link, desc: item.title});
    };

    _clickCollect = (item) => {
        StorageOpt.loaddata("cookie", (result) => {
           if (result === null || result === "") {
               this.props.navigation.navigate("RegisterLogin");
           } else {
               if (item.collect) {
                   const unCollectUrl = "https://www.wanandroid.com/lg/uncollect_originId/" + item.id + "/json";
                   this.collectFetchData(unCollectUrl, "collect", item);
               } else {
                   const collectUrl = "https://www.wanandroid.com/lg/collect/" + item.id + "/json";
                   this.collectFetchData(collectUrl, "", item);
               }
               // this.props.navigation.navigate("Collect");
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
        this.fetchData(category, pageNo);
    }

    _onRefresh() {
        this.setState({
            isRefreshing:true,
        });
        pageNo = 0;
        this.fetchData(category, pageNo);
    }
}

class FlatListHeaderComponent extends Component {

    constructor(props){
        super(props);
        this.state = {
            selected:true,
            unSelected:false,
            bannerDataArray:[],
        };
    }

    render() {
        return (
            <View>
                <Swiper
                    style={styles.wrapper}
                    loop={true}
                    autoplay={true}
                    autoplayTimeout={3}
                    horizontal={true}
                    paginationStyle={{bottom: 10}}
                    showsButtons={false}
                    showsPagination={true}
                    removeClippedSubviews={false}>
                    <Image source={{ uri: 'https://www.wanandroid.com/blogimgs/bb4937de-b6f3-4c7e-b7d0-66d02f54abee.jpeg' }} style={styles.image}/>
                    <Image source={{ uri: 'https://www.wanandroid.com/blogimgs/50c115c2-cf6c-4802-aa7b-a4334de444cd.png' }} style={styles.image}/>
                    <Image source={{ uri: 'https://www.wanandroid.com/blogimgs/62c1bd68-b5f3-4a3c-a649-7ca8c7dfabe6.png' }} style={styles.image}/>
                    <Image source={{ uri: 'https://www.wanandroid.com/blogimgs/90c6cc12-742e-4c9f-b318-b912f163b8d0.png' }} style={styles.image}/>
                </Swiper>

                <View style={{flex:1, flexDirection:'row', marginTop:15, marginLeft:5, marginBottom:15}}>
                    <Text style={this.state.selected ? {color:'skyblue'} : {color:'gray'}} onPress={this._clickText1.bind(this)}>最新博文</Text>
                    <Text > | </Text>
                    <Text style={this.state.unSelected ? {color:'skyblue'} : {color:'gray'}} onPress={this._clickText2.bind(this)}>最新项目</Text>
                </View>
            </View>
        );
    }

    renderImage() {
        const imgsArray = [];
        let images = this.state.bannerDataArray;
        images.map(function (item) {
            imgsArray.push(
                <View style={styles.slide}>
                    <Image source={item} style={styles.image}/>
                </View>
            );
        });
        return imgsArray;
    }

    _clickText1 = ()=> {
        this.setState({selected:true, unSelected:false});
        setTimeout(()=> {
            DeviceEventEmitter.emit(EVENT_NAME, "list");
        }, 500);//延迟500ms执行
    };

    _clickText2 = ()=> {
        this.setState({selected:false, unSelected:true});
        setTimeout(()=> {
            DeviceEventEmitter.emit(EVENT_NAME, "listproject");
        }, 500);//延迟500ms执行
    };

    componentDidMount() {
        this.fetchBannerData();
    }

    fetchBannerData() {
        fetch(REQUEST_BANNER_URL)
            .then((response) => {
                return response.json();
            })
            .then((responseData) => {
                let data = responseData.data;
                let bannerData = [];
                data.map(function (item) {
                    bannerData.push({
                        uri:item.imagePath
                    });
                });
                this.setState({
                    bannerDataArray: bannerData,
                });
                data = null;
                bannerData = null;
            })
            .catch((error) => {
                console.log(error)
            });
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

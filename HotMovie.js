import React, {Component} from 'react';
import {
    Image,
    FlatList,
    StyleSheet,
    Text,
    View,
    ActivityIndicator,
    ScrollView,
    TouchableOpacity, DeviceEventEmitter
} from "react-native";
import PageScrollView from 'react-native-page-scrollview';
import Swiper from 'react-native-swiper';

const EVENT_NAME = "notifyChangeData";
let category = "list";
let pageNo = 0;//当前第几页
const REQUEST_BANNER_URL = "https://api-m.mtime.cn/Showtime/LocationMovies.api?locationId=561";

/**
 * 豆瓣电影热映榜
 */
export default class HotMovie extends Component {

    static navigationOptions = {
        title: "热映榜"
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
        this.fetchData(category, pageNo);
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
        // console.log(requestUrl);
        fetch(requestUrl)
            .then((response) => {
                return response.json();
            })
            .then((responseData) => {
                let data = responseData.data.datas;
                // console.log(data);
                /**
                 * 这里改变dataArray的值是因为防止下拉刷新数据的时候，屏幕闪烁
                 */
                console.log(this.state.isRefreshing);
                if (this.state.isRefreshing) {
                    this.setState({
                        dataArray:[]
                    })
                }

                let foot = 0;
                if (data.length === 0 || pageNo === 5) {
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
                    color='blue'
                    size="large"
                />
            </View>
        );
    }

    renderData({item}) {
        return (
            <View style={styles.container}>
                <View style={styles.content}>
                    <Text onPress={this._clickItem.bind(this, item)}>{item.title}</Text>
                </View>
                <View style={styles.authorTime}>
                    <Text style={styles.author}>作者：{item.chapterName}</Text>
                </View>
            </View>
        );
    }

    _clickItem = (item) => {
        this.props.navigation.navigate("MyWeb", {url: item.link, desc: item.title});
    };

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
                                       color='blue'
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
        console.log("_onEndReached");
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
                    <Text style={this.state.selected ? {color:'red'} : {color:'gray'}} onPress={this._clickText1.bind(this)}>最新博文</Text>
                    <Text > | </Text>
                    <Text style={this.state.unSelected ? {color:'red'} : {color:'gray'}} onPress={this._clickText2.bind(this)}>最新项目</Text>
                </View>
            </View>
        );
    }

    renderImage() {
        console.log("renderImage");
        const imgsArray = [];
        let images = this.state.bannerDataArray;
        images.map(function (item) {
            console.log(item);
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
            <View style={{height: 1, backgroundColor: 'skyblue'}}/>
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
    content: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        margin: 5,
    },
    authorTime: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    author: {
        margin: 5,
        color: 'red',
        fontSize: 14,
    },
    time: {
        margin: 5,
        color: 'gray',
        fontSize: 14,
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
    card: {
        borderRadius: 2,
        borderWidth: 0,
        borderColor:'#A9A9A9',
        shadowColor:'#808080',
        // shadowOffset:{h:10,w:10},
        shadowRadius:3,
        shadowOpacity: 0.8,
        padding: -10
    },
});

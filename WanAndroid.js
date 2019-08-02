import React, {Component} from 'react';
import {
    Image,
    FlatList,
    StyleSheet,
    Text,
    View,
    ActivityIndicator,
    ScrollView,
    TouchableOpacity
} from "react-native";
import PageScrollView from 'react-native-page-scrollview';

let pageNo = 0;//当前第几页
const REQUEST_BANNER_URL = "https://www.wanandroid.com/banner/json";
let isCanLoadMore = false;

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
            selected:true,
            unSelected:false,
            isLoading: true,
            isRefreshing: false,
            //网络请求状态
            error: false,
            errorInfo: "",
            dataArray: [],
            bannerDataArray:[],
            showFoot: 0, // 控制foot， 0：隐藏footer  1：已加载完成,没有更多数据   2 ：显示加载中
        };
    }

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
                    isLoading: false,
                    bannerDataArray: bannerData,
                });
                data = null;
                bannerData = null;
                this.fetchData();
            })
            .catch((error) => {
                console.log(error)
            });
    }

    fetchData() {
        const requestUrl = "https://www.wanandroid.com/article/list/" + pageNo + "/json";
        console.log(requestUrl);
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
            <ScrollView>
                <PageScrollView
                    style={{width:null,height:260/16*9}}
                    imageArr={this.state.bannerDataArray} />

                    <View style={{flex:1, flexDirection:'row', marginTop:20, marginLeft:5}}>
                        <Text style={this.state.selected ? {color:'red'} : {color:'gray'}} onPress={this._clickText1.bind(this)}>最新博文</Text>
                        <Text > | </Text>
                        <Text style={this.state.unSelected ? {color:'red'} : {color:'gray'}} onPress={this._clickText2.bind(this)}>最新项目</Text>
                    </View>

                <FlatList
                    style={{marginTop:10}}
                    data={this.state.dataArray}
                    renderItem={this.renderData.bind(this)}
                    ListFooterComponent={this._renderFooter.bind(this)}
                    onEndReached={this._onEndReached.bind(this)}
                    onRefresh={this._onRefresh.bind(this)}
                    refreshing={this.state.isRefreshing}
                    ItemSeparatorComponent={ItemDivideComponent}
                    onEndReachedThreshold={0.1}
                    keyExtractor={item => item.id}
                    onContentSizeChange={()=>{
                        this.isCanLoadMore = true // flatview内部组件布局完成以后会调用这个方法
                    }}
                />
            </ScrollView>
        );
    }

    _clickText1 = ()=> {
        this.setState({selected:true, unSelected:false})
    };

    _clickText2 = ()=> {
        this.setState({selected:false, unSelected:true})
    };

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
        this.props.navigation.navigate("MyWeb", {url: item.url, desc: item.desc});
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
        // 等待页面布局完成以后，在让加载更多
        if (this.isCanLoadMore){
            //获取数据
            this.fetchData();
            this.isCanLoadMore = false // 加载更多时，不让再次的加载更多
        }
    }

    _onRefresh() {
        this.setState({
            isRefreshing:true,
        });
        pageNo = 2;
        this.fetchData();
    }
}

class ItemDivideComponent extends Component {
    render() {
        return (
            <View style={{height: 1, backgroundColor: 'gray'}}/>
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
    image: {
        width: 200,
        height: 100,
        flex: 1
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

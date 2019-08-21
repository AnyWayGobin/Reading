import React, {Component} from 'react';
import {
    Image,
    FlatList,
    StyleSheet,
    Text,
    View,
    ActivityIndicator,
    NativeModules,
    BackHandler
} from "react-native";
import { Card } from 'react-native-elements'

import BaseComponent from "./BaseComponent";

let pageNo = 1;//当前第几页
const REQUEST_URL = "http://gank.io/api/data/Android/10/";

/**
 * 安卓干货
 */
export default class AndroidGank extends BaseComponent {

    static navigationOptions = {
        title: "大安卓"
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
        this.fetchData(pageNo);

        /*this.testRnCallNative();

        //在native中有定义EventName这个变量，所以可以直接使用 NativeModules.ToastForAndroid.EventName获取该变量的值
        this.listener = DeviceEventEmitter.addListener(NativeModules.ToastForAndroid.EventName, (msg) => {
            console.log("listener = " + msg.myData);
        });*/
    }

    componentWillUnmount() {
        super.componentWillUnmount();
        if (this.listener) {
            this.listener.remove();
        }
    }

    testRnCallNative() {
        NativeModules.ToastForAndroid.show(1000);
        /**
         * 通过callback的方式调用native，注意该方式获取native传过来的值的方式和promise的区别
         */
        NativeModules.ToastForAndroid.byCallBackToRn("byCallBackToRn", (result) => {
            console.log(result)
        });

        /**
         * 通过promise的方式调用native，注意该方式获取native传过来的值的方式和callback的区别
         */
        NativeModules.ToastForAndroid.byPromiseToRn("byPromiseToRn")
            .then((result) => {
                console.log(result);
                console.log("content1=" + result.content1);
                console.log("content2=" + result.content2);
            })
            .catch((error) => {
                console.log(error);
            });
    }

    fetchData(pageNo) {
        fetch(REQUEST_URL + pageNo)
            .then((response) => {
                return response.json();
            })
            .then((responseData) => {
                let data = responseData.results;

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
            <View>
                <FlatList
                    data={this.state.dataArray}
                    renderItem={this.renderWelfare.bind(this)}
                    ListFooterComponent={this._renderFooter.bind(this)}
                    onEndReached={this._onEndReached.bind(this)}
                    onRefresh={this._onRefresh.bind(this)}
                    refreshing={this.state.isRefreshing}
                    // ItemSeparatorComponent={ItemDivideComponent}
                    onEndReachedThreshold={0.1}
                    keyExtractor={item => item.id}
                />
            </View>

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

    renderWelfare({item}) {
        // { item }是一种“解构”写法，请阅读ES2015语法的相关文档
        // item也是FlatList中固定的参数名，请阅读FlatList的相关文档
        if (item.images !== undefined) {
            return this.renderContainImage(item)
        } else {
            return (
                <Card containerStyle={styles.card}>
                    <View style={styles.container}>
                        <View style={{margin: 5}}>
                            <Text onPress={this._clickItem.bind(this, item)}>{item.desc}</Text>
                        </View>
                        <View style={styles.authorTime}>
                            <Text style={styles.author}>{item.who}.{item.type}</Text>
                            <Text style={styles.time}>{item.publishedAt.substring(0, item.publishedAt.indexOf("T"))}</Text>
                        </View>
                    </View>
                </Card>
            );
        }
    }

    renderContainImage = (item) => {
        return (
            <Card containerStyle={styles.card}>
                <View style={styles.container}>
                    <View style={{margin: 5}}>
                        <Text onPress={this._clickItem.bind(this, item)}>{item.desc}</Text>
                        <Image source={{uri: item.images[0]}} style={styles.image}/>
                    </View>
                    <View style={styles.authorTime}>
                        <Text style={styles.author}>{item.who}.{item.type}</Text>
                        <Text style={styles.time}>{item.publishedAt.substring(0, item.publishedAt.indexOf("T"))}</Text>
                    </View>
                </View>
            </Card>
        );
    };

    _clickItem = (item) => {
        /**
         * rn启动activity,native再调用rn回传数据。通过DeviceEventEmitter.addListener获取回传的数据
         */
        // NativeModules.ToastForAndroid.byPromiseToRnCallActivity("byPromiseToRnCallActivity");

        // NativeModules.ToastForAndroid.getDataFromIntent((result) => {
        //     console.log("getDataFromIntent = " + result);
        // })

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
        /*setTimeout(()=> {
            console.log("setTimeout");
            //获取数据
            this.fetchData(pageNo);
        }, 3000);*/
    }

    _onRefresh() {
        this.setState({
            isRefreshing:true,
        });
        pageNo = 1;
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
    image: {
        flex: 1,
        height: 80,
        margin: 5
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
    time: {
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

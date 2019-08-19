import React, {Component} from 'react';
import {
    Image,
    FlatList,
    StyleSheet,
    Text,
    View,
    ActivityIndicator,
    TouchableOpacity,
    BackHandler
} from "react-native";
import BaseComponent from "./BaseComponent";
import {NavigationEvents} from "react-navigation";

const REQUEST_URL = "https://api-m.mtime.cn/Showtime/LocationMovies.api?locationId=561";

/**
 * 豆瓣电影热映榜
 */
export default class HotMovie extends BaseComponent {

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
        this._didFocusSubscription = props.navigation.addListener('didFocus', payload =>
            BackHandler.addEventListener('hardwareBackPress', this.onBackAndroid)
        );
    }

    componentDidMount() {
        this.fetchData();
        this._willBlurSubscription = this.props.navigation.addListener('willBlur', payload =>
            BackHandler.removeEventListener('hardwareBackPress', this.onBackAndroid)
        );
    }

    componentWillUnmount() {
        this._didFocusSubscription && this._didFocusSubscription.remove();
        this._willBlurSubscription && this._willBlurSubscription.remove();
    }

    fetchData() {
        fetch(REQUEST_URL)
            .then((response) => {
                return response.json();
            })
            .then((responseData) => {
                let data = responseData.ms;
                /**
                 * 这里改变dataArray的值是因为防止下拉刷新数据的时候，屏幕闪烁
                 */
                if (this.state.isRefreshing) {
                    this.setState({
                        dataArray:[]
                    })
                }

                let foot = 0;
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
                    renderItem={this.renderData.bind(this)}
                    ListFooterComponent={this._renderFooter.bind(this)}
                    onEndReached={this._onEndReached.bind(this)}
                    onRefresh={this._onRefresh.bind(this)}
                    refreshing={this.state.isRefreshing}
                    ItemSeparatorComponent={ItemDivideComponent}
                    onEndReachedThreshold={0.1}
                    keyExtractor={item => item.id} />
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

    renderData({item}) {
        return (
            <TouchableOpacity onPress={this._clickItem.bind(this, item)}>
                <View style={styles.container}>
                    <Image source={{uri: item.img}} style={styles.image}/>
                    <View style={styles.content}>
                        <Text style={{fontWeight: "bold", fontSize: 16}}>{item.t}</Text>
                        <View style={{flexDirection:'row'}}>
                            <Text style={{textDecorationLine:'underline', textDecorationColor:'red', textDecorationStyle:'solid'}}>导演</Text>
                            <Text>：{item.dN}</Text>
                        </View>
                        <Text>主演：{item.actors}</Text>
                        <Text>类型：{item.movieType}</Text>
                        <Text>评分：{item.r}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        );
    }

    _clickItem = (item) => {
        this.props.navigation.navigate("MovieDetail", {item: item});
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
        this.setState({
            showFoot: 1,
        });
    }

    _onRefresh() {
        this.setState({
            isRefreshing:true,
        });
        this.fetchData();
    }
}

class ItemDivideComponent extends Component {
    render() {
        return (
            <View style={{marginLeft: 106, height: 1, backgroundColor: '#549cf8'}}/>
        );
    }
}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        flexDirection: 'row',
    },
    loading: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
    },
    image: {
        width: 100,
        height: 140,
        margin: 6,
    },
    content: {
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        marginTop: 20,
        marginLeft: 5
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

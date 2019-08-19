import React, {Component} from 'react';
import {
    ActivityIndicator,
    DeviceEventEmitter,
    FlatList,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    Platform,
    BackHandler,
    ToastAndroid
} from "react-native";
import PopupDialog, {DialogContent, DialogTitle, SlideAnimation} from 'react-native-popup-dialog';
import StorageOpt from "./StorageOpt"
import BaseComponent from "./BaseComponent"
import {NavigationEvents} from "react-navigation";

let pageNo = 1;//当前第几页
const REQUEST_GANK_URL = "http://gank.io/api/today";
const EVENT_NAME = "changeCategory";
const REGISTER_EVENT_NAME = "register_event_name";
const UNREGISTER_EVENT_NAME = "unregister_event_name";
const category = "Android";

const slideAnimation = new SlideAnimation({
    slideFrom: 'bottom',
});

/**
 * 所有干货
 */
export default class Ganks extends BaseComponent {

    static navigationOptions = {
        title: "干货定制"
    };

    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            isRefreshing: false,
            //网络请求状态
            error: false,
            errorInfo: "",
            dataArray: [],
            showFoot:0, // 控制foot， 0：隐藏footer  1：已加载完成,没有更多数据   2 ：显示加载中
        };
    }

    componentDidMount() {
        this.fetchData(category, pageNo);
        this.fetchCategory();
        this.listener = DeviceEventEmitter.addListener(EVENT_NAME, (category) => {
            console.log("listener = " + category);
            this.category = category;
            this.pageNo = 1;
            this.fetchData(category, pageNo);
            this.setState({
                dataArray:[],
                isRefreshing: true
            });
        });
        this.registerListener = DeviceEventEmitter.addListener(REGISTER_EVENT_NAME, () => {
            console.log("registerListener");
            super.componentWillMount();
        });
        this.unRegisterListener = DeviceEventEmitter.addListener(UNREGISTER_EVENT_NAME, () => {
            console.log("unRegisterListener");
            super.componentWillUnmount();
        });
    }

    componentWillUnmount() {
        super.componentWillUnmount();
        if (this.listener) {
            this.listener.remove();
        }
        if (this.registerListener) {
            this.registerListener.remove();
        }
        if (this.unRegisterListener) {
            this.unRegisterListener.remove();
        }
    }

    fetchData(category, pageNo) {
        const REQUEST_URL = "http://gank.io/api/data/" + category + "/10/" + pageNo;
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
                    isRefreshing: false,
                    showFoot:foot,
                });
                data = null;
            })
            .catch((error) => {
                console.log(error)
            });
    }

    fetchCategory() {
        fetch(REQUEST_GANK_URL)
            .then((response) => {
                return response.json();
            })
            .then((responseData) => {
                StorageOpt.save("category",responseData.category,null);
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
                    ListHeaderComponent={FlatListHeaderComponent.bind(this)}
                    ListFooterComponent={this._renderFooter.bind(this)}
                    onEndReached={this._onEndReached.bind(this)}
                    onRefresh={this._onRefresh.bind(this)}
                    refreshing={this.state.isRefreshing}
                    ItemSeparatorComponent={ItemDivideComponent}
                    onEndReachedThreshold={0.1}
                    keyExtractor={item => item.id}/>
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

    renderWelfare({ item }) {
        if (item.images !== undefined) {
            return this.renderContainImage(item)
        } else {
            return (
                <View style={styles.container}>
                    <View style={{margin: 5}}>
                        <Text onPress={this._clickItem.bind(this, item)}>{item.desc}</Text>
                    </View>
                    <View style={styles.authorTime}>
                        <Text style={styles.author}>{item.who}.{item.type}</Text>
                        <Text style={styles.time}>{item.publishedAt.substring(0, item.publishedAt.indexOf("T"))}</Text>
                    </View>
                </View>
            );
        }
    }

    renderContainImage = (item) => {
        return (
            <View style={styles.container}>
                <View style={{margin: 5}}>
                    <Text onPress={this._clickItem.bind(this, item)}>{item.desc}</Text>
                    <Image source={{ uri: item.images[0] }} style={styles.image}/>
                </View>
                <View style={styles.authorTime}>
                    <Text style={styles.author}>{item.who}.{item.type}</Text>
                    <Text style={styles.time}>{item.publishedAt.substring(0, item.publishedAt.indexOf("T"))}</Text>
                </View>
            </View>
        );
    };

    _clickItem = (item) => {
        this.props.navigation.navigate("MyWeb", {url: item.url, desc: item.desc});
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
                    <ActivityIndicator animating={true}
                                       color='#549cf8'
                                       size="small"/>
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
        if(this.state.showFoot !== 0){
            return ;
        }
        pageNo++;
        //底部显示正在加载更多数据
        this.setState({showFoot:2});
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

class ItemDivideComponent extends Component {
    render() {
        return (
            <View style={{height: 1, backgroundColor: '#549cf8'}}/>
        );
    }
}

class FlatListHeaderComponent extends Component {

    constructor(props){
        super(props);
        this.state = {
            showDialog : false,
            categoryArray: []
        };
        this.showFadeAnimationDialog = this.showFadeAnimationDialog.bind(this);
        this.renderCategory = this.renderCategory.bind(this);
    }

    onBackAndroid = () => {
        console.log("FlatListHeaderComponent onBackAndroid");
        if (this.state.showDialog) {
            this.setState({
                showDialog: false
            });
            DeviceEventEmitter.emit(REGISTER_EVENT_NAME);
            BackHandler.removeEventListener('hardwareBackPress', this.onBackAndroid);
            return true;
        }
    };

    render() {
        return (
            <View style={{flex:1, flexDirection: 'row', justifyContent:'center'}}>
                <TouchableOpacity style={styles.button} onPress={this.showFadeAnimationDialog}>
                    <Text style={{color:'white'}}>全部分类</Text>
                </TouchableOpacity>

                <PopupDialog
                    width={0.8}
                    height={0.6}
                    dialogTitle={<DialogTitle title="选择分类" />}
                    dialogAnimation={slideAnimation}
                    visible={this.state.showDialog}
                    onTouchOutside={() => {this.setState({showDialog : false})}}
                >
                    <DialogContent>
                        <View>
                            <FlatList
                                data={this.state.categoryArray}
                                renderItem={this.renderCategory}
                                ItemSeparatorComponent={ItemDivideComponent}
                                onEndReachedThreshold={0.02}
                                keyExtractor={item => item.id}
                                showsVerticalScrollIndicator={false}/>
                        </View>
                    </DialogContent>
                </PopupDialog>
            </View>
        );
    }

    renderCategory({ item }) {
        return (
            <View style={styles.container}>
                <Text style={styles.author} onPress={this._clickItem.bind(this, item)}>{item}</Text>
            </View>
        );
    }

    _clickItem = (item) => {
        console.log(item);
        this.setState({
            showDialog : false
        });
        setTimeout(()=> {
            DeviceEventEmitter.emit(EVENT_NAME, item);
        }, 500);//延迟500ms执行
    };

    showFadeAnimationDialog() {
        BackHandler.addEventListener('hardwareBackPress', this.onBackAndroid);
        DeviceEventEmitter.emit(UNREGISTER_EVENT_NAME);
        
        this.fetchCategory();
    }

    fetchCategory() {
        StorageOpt.loaddata("category", (data) => {
            this.setState({
                categoryArray: data,
                showDialog: true
            })
        });
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
        margin: 10,
        color: 'gray',
        fontSize: 14,
    },
    time: {
        margin: 5,
        color: 'gray',
        fontSize: 10,
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
    },
    button: {
        width: 80,
        backgroundColor: 'skyblue',
        padding: 10,
        margin: 20,
        borderRadius: 5
    },
});

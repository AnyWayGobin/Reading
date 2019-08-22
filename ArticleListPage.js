import React, {Component} from 'react';
import {
    Image,
    FlatList,
    StyleSheet,
    Text,
    View,
    ActivityIndicator,
    TouchableOpacity, DeviceEventEmitter, ToastAndroid,BackHandler
} from "react-native";


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



    render() {
        return (
            <Text>test</Text>
        );
    }


}
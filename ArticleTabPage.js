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
import {
    createBottomTabNavigator,
    createAppContainer, createMaterialTopTabNavigator, createStackNavigator,
} from 'react-navigation';
import StorageOpt from "./StorageOpt";
import ArticleListPage from "./ArticleListPage";
const REQUEST_URL = "https://wanandroid.com/wxarticle/chapters/json";


/**
 * 玩安卓的公众号
 */
export default class ArticleTabPage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            dataArray: [],
        };
    }

    componentDidMount() {
        StorageOpt.loaddata("cookie", (result) => {
            this.fetchData(result);
        });
    }

    fetchData(cookie) {
        fetch(REQUEST_URL, {method : 'GET', headers: {'Cookie': cookie}})
            .then((response) => {
                return response.json();
            })
            .then((responseData) => {
                let data = responseData.data;
                this.setState({
                    dataArray: this.state.dataArray.concat(data),
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
        let A = createAppContainer(createMaterialTopTabNavigator(this.createTabs(), {
            lazy: true,
            swipeEnabled: true,
            animationEnabled: true,
            backBehavior: "none",
            tabBarOptions: {
                activeTintColor: 'white',
                inactiveTintColor: config.colorPrimaryLight,
                scrollEnabled: true,
                tabStyle: {
                    minWidth: 50
                },
                labelStyle: {
                    fontSize: 14,
                },
                indicatorStyle: {
                    height: 2,
                    backgroundColor: 'white'
                },
                style: {
                    backgroundColor: config.colorPrimary,
                    height: 45,
                    justifyContent: 'center',
                    alignItems: 'center'
                }
            }
        }));
        return <A/>;
    }

    createTabs() {
        let tabPages = {};
        this.state.data.map((value, i) => {
            tabPages[value.name] = {
                screen: () => <ArticleListPage chapterId={value.id} navigation={this.props.navigation}/>
            }
        });
        return tabPages;
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
}

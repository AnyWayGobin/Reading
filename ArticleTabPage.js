import React, {Component} from 'react';
import {ActivityIndicator, StyleSheet, View} from "react-native";
import {createAppContainer, createMaterialTopTabNavigator,} from 'react-navigation';
import ArticleListPage from "./ArticleListPage";

const REQUEST_URL = "https://wanandroid.com/wxarticle/chapters/json";

let Container;

/**
 * 玩安卓的公众号
 */
export default class ArticleTabPage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            // dataArray: [],
        };
    }

    componentDidMount() {
        this.fetchData();
    }

    fetchData() {
        fetch(REQUEST_URL)
            .then((response) => {
                return response.json();
            })
            .then((responseData) => {
                let data = responseData.data;
                this.createContainer(data);
                this.setState({
                    // dataArray: this.state.dataArray.concat(data),
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
        // let A = createAppContainer(this.createTabsNavigator());
        return <Container/>;
    }

    createTabs(data) {
        let tabPages = {};
        data.map((value, i) => {
            tabPages[value.name] = {
                screen: () => <ArticleListPage chapterId={value.id} navigation={this.props.navigation}/>
            }
        });
        return tabPages;
    }

    createTabsNavigator(data) {
        return createMaterialTopTabNavigator(this.createTabs(data), {
            lazy: true,
            swipeEnabled: true,
            animationEnabled: true,
            backBehavior: "none",
            tabBarOptions: {
                activeTintColor: 'white',
                scrollEnabled: true,
                tabStyle: {
                    minWidth: 30
                },
                labelStyle: {
                    fontSize: 12,
                },
                indicatorStyle: {
                    height: 2,
                    backgroundColor: 'white'
                },
                style: {
                    height: 50,
                    justifyContent: 'center',
                    alignItems: 'center'
                }
            },
        });
    }

    createContainer(data) {
        Container = createAppContainer(this.createTabsNavigator(data));
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

const styles = StyleSheet.create({
    loading: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
    },
});


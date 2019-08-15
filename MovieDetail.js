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

const REQUEST_URL = "https://ticket-api-m.mtime.cn/movie/detail.api?locationId=561&movieId=";

let movieId = -1;
/**
 * 电影详情
 */
export default class MovieDetail extends Component {

    static navigationOptions = ({ navigation }) => ({

        title: `${navigation.state.params.item.t}`,
        headerStyle: {
            backgroundColor: '#549cf8',
        },
        headerTintColor: '#fff',
    });

    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            //网络请求状态
            error: false,
            errorInfo: "",
            movieDetails: Object,
        };
    }

    componentDidMount() {
        this.fetchData();
    }

    fetchData() {
        const req_url = REQUEST_URL + movieId;
        console.log(req_url);
        fetch(req_url)
            .then((response) => {
                return response.json();
            })
            .then((responseData) => {

                this.setState({
                    //复制数据源
                    movieDetails: responseData.data,
                    isLoading: false,
                });
            })
            .catch((error) => {
                console.log(error)
            });
    }

    render() {
        const { navigation } = this.props;
        movieId = navigation.getParam('item').movieId;
        if (this.state.isLoading) {
            return this.renderLoadingView();
        }
        const movie = this.state.movieDetails;
        console.log(movie.basic.video.img);
        return (
            <ScrollView>
                <View style={styles.container}>
                    <Text style={styles.commonSpecialText}>"{movie.basic.commentSpecial}"</Text>
                    <Text style={styles.title}>简介</Text>
                    <Text style={{margin: 10}}>{movie.basic.story}</Text>
                    <Text style={styles.title}>演职员</Text>
                    <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>{this.showActorImgs(movie.basic.director, movie.basic.actors)}</ScrollView>
                    <Text style={styles.title}>票房</Text>
                    <View style={{flex: 1, flexDirection:'row', justifyContent:'space-between', backgroundColor: '#FFF0F0', marginLeft: 16, marginRight: 16, paddingLeft: 24, paddingRight: 30, paddingTop: 8, paddingBottom: 8}}>
                        <Text style={{color:'red', fontSize: 16}}>{movie.boxOffice.todayBoxDes}</Text>
                        <Text style={{color:'red', fontSize: 16, paddingRight: 28}}>{movie.boxOffice.totalBoxDes}</Text>
                        <Text style={{color:'red', fontSize: 16, paddingRight: 18}}>{movie.boxOffice.ranking}</Text>
                    </View>
                    <View style={{flex: 1, flexDirection:'row', justifyContent:'space-between', backgroundColor: '#FFF0F0', marginLeft: 16, marginRight: 16, paddingLeft: 20, paddingRight: 20, paddingTop: 8, paddingBottom: 8}}>
                        <Text style={{fontSize: 16}}>今日实时(万)</Text>
                        <Text style={{fontSize: 16}}>累计票房(亿)</Text>
                        <Text style={{fontSize: 16}}>累计排名</Text>
                    </View>
                    <Text style={styles.title}>预告片</Text>
                    <Image source={{uri: movie.basic.video.img}} style={styles.image}/>
                    <Text style={styles.title}>剧照</Text>
                    <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>{this.showMovieImgs(movie.basic.stageImg.list)}</ScrollView>
                </View>
            </ScrollView>
        );
    }

    showActorImgs(director, actors) {
        let images = [];
        for (let i = -1; i < actors.length; i++) {
            let actor;
            if (i > -1) {
                actor = actors[i];
            }
            images.push(
                <View style={{flex:1, flexDirection: 'column'}}>
                    <Image style={i === -1 ? {width: 100, height: 120, marginLeft: 20} : {width: 100, height: 120, marginLeft: 10}} source={{uri: i === -1 ? director.img : actor.img}}/>
                    <Text style={i === -1 ? {fontSize: 16, marginLeft: 20} : {fontSize: 16, marginLeft: 10}}>{i === -1 ? director.name : actor.name}</Text>
                    <Text style={i === -1 ? {color:'gray', marginLeft: 20} : {color:'gray', marginLeft: 10}}>{i === -1 ? "导演" : actor.roleName}</Text>
                </View>
            )
        }
        return images;
    };

    showMovieImgs(movieImgs) {
        let images = [];
        for (let i = 0; i < movieImgs.length; i++) {
            let movieImg = movieImgs[i];
            images.push(
                <Image style={{width: 130, height: 10, marginLeft: 15, marginBottom: 30}} source={{uri: movieImg.imgUrl}}/>
            )
        }
        return images;
    };

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


    _clickItem = (item) => {
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
                                       color='skyblue'
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
            <View style={{marginLeft: 120, height: 1, backgroundColor: 'skyblue'}}/>
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
        width: null,
        height: 200,
        marginTop: 8,
        marginBottom: 8,
        marginLeft: 16,
        marginRight: 16
    },
    content: {
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        margin: 5,
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
    commonSpecialText: {
        fontSize:14,
        fontWeight:'bold',
        fontStyle:'italic',
        margin: 8
    },
    title: {
        fontSize:18,
        margin: 8
    }
});

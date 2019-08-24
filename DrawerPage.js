import React from 'react';
import {Image, Platform, ScrollView, StyleSheet, Text, TouchableHighlight, View} from 'react-native';

export default class DrawerPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            userName: '',
        };
    }


    render() {
        return <ScrollView>
            <TouchableHighlight onPress={() => {
                if (this.state.userName) {
                } else {
                    this.props.navigation.navigate('Login');
                }
            }}>
                <View style={styles.header}>
                    <Image style={styles.avatar} source={{}}/>
                    <Text style={styles.userName}>
                        {this.state.userName ? this.state.userName : "还没有登录..."}
                    </Text>
                </View>
            </TouchableHighlight>
            {this.getItemView("收藏夹", () => {
                if (this.state.userName) {
                    this.props.navigation.navigate('Favorite');
                } else {
                    this.props.navigation.navigate('Login');
                }
            })}
            {this.getItemView("任务清单", () => {
                if (this.state.userName) {
                    this.props.navigation.navigate('Todo');
                } else {
                    this.props.navigation.navigate('Login');
                }
            })}
            {this.getItemView("关于", () => {
                this.props.navigation.navigate('About');
            })}
            {this.state.userName ? this.getItemView("退出登录", () => {
            }) : null}
        </ScrollView>
    }

    getItemView(action, image, onPress) {
        return <TouchableHighlight onPress={onPress}>
            <View style={styles.itemView}>
                <Image style={styles.actionImage} source={image}/>
                <Text style={styles.action}>
                    {action}
                </Text>
            </View>
        </TouchableHighlight>
    }
}

const styles = StyleSheet.create({
    header: {
        height: Platform.OS === 'ios' ? 150 + 20 : 150,
        justifyContent: 'center',
        alignItems: 'center',
        ...Platform.select({
            ios: {paddingTop: 20},
            android: {}
        })
    },
    avatar: {
        width: 90,
        height: 90,
        borderRadius: 45,
        borderWidth: 2,
        borderColor: 'white',
    },
    userName: {
        color: 'white',
        fontSize: 16,
        marginTop: 20
    },
    itemView: {
        height: 50,
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10
    },
    actionImage: {
        width: 20,
        height: 20,
    },
    action: {
        fontSize: 14,
        color: 'blue',
        marginLeft: 15,
    },
});
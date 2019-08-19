import React, { Component } from 'react';
import {StyleSheet, Text} from "react-native";
import ImageViewer from 'react-native-image-zoom-viewer';

export default class ImagePreView extends Component {

    static navigationOptions = () => ({

        title: '图片预览',
        headerStyle: {
            backgroundColor: '#549cf8',
        },
        headerTintColor: '#fff',
    });

    render() {
        const { navigation } = this.props;
        const urls = navigation.getParam('urls');
        const index = navigation.getParam('index');
        if (urls === null || urls.length === 0) {
            return (
                <Text>图片地址错误</Text>
                );
        }
        const images = [];
        urls.map(function (item) {
            images.push(item.value)
        });
        return (
            <ImageViewer
                imageUrls={images} // 照片路径
                enableImageZoom={true} // 是否开启手势缩放
                onClick={this._clickImage}
                style={styles.image}
                index={index}
            />
        );
    }

    _clickImage = () => {
        this.props.navigation.goBack();
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'black'
    },
    image: {
        width: null,
        height: null,
    },
});
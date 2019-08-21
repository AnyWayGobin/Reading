https://react-native-community.github.io/upgrade-helper/?from=0.59.10&to=0.60.4

yarn add react-native

yarn add react-navigation

yarn add react-native-gesture-handler

https://github.com/facebook/react-native/issues/25483  解决react-native-gesture-handler不兼容androidX的问题

yarn add react-native-storage
yarn add @react-native-community/async-storage
react-native link @react-native-community/async-storage

yarn add react-native-webview

yarn add react-native-popup-dialog

yarn add moment

yarn add react-native-image-zoom-viewer

yarn add react-native-elements

yarn add react-native-vector-icons ?

yarn add react-native-swiper@nightly

yarn add react-native-page-scrollview


react-native bundle --platform android --dev false --entry-file index.js --bundle-output android/app/src/main/assets/index.android.bundle --assets-dest android/app/src/main/res/


react知识点：

异步的三种方式：
callback、promise、async+await

react native和原生通信的三种方式：
callback、promise、DeviceEventEmitter

ref this.refs是什么东西？

引用android资源文件夹下的图片的时候，直接 uri:'资源名称' 就可以了

如果一个组件的变量写成export，另外一个组件想引用这个组件的该变量，该怎么操作？
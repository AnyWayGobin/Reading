import React, {Component} from 'react';
import ArticleTabPage from "./ArticleTabPage";
import BaseComponent from "./BaseComponent";



/**
 * 玩安卓的公众号
 */
export default class More extends BaseComponent {

    render() {
        return <ArticleTabPage navigation={this.props.navigation}/>
    }
}



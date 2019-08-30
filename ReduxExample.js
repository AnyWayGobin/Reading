import React, {Component} from 'react';
import { createStore } from 'redux'
import {addTodo, toggleTodo, setVisibilityFilter} from './src/actions/TodoActions'
import todoApp from './src/reducers/TodoReducer'
import { actionTypes } from './src/actions/ActionTypes'

const store = createStore(todoApp);

let unsubscribe;

export default class ReduxExample extends Component {

    constructor(props) {
        super(props);
        unsubscribe = store.subscribe(() => {
            console.log(store.getState());
        });
    }

    componentWillUnmount() {
        unsubscribe();
    }

    render() {
        store.dispatch(addTodo('Learn about actions'));
        // store.dispatch(setVisibilityFilter(actionTypes.VisibilityFilters.SHOW_COMPLETED));
        return null;
    }
}

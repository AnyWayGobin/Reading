import { combineReducers } from 'redux'
import { actionTypes } from '../actions/ActionTypes'

const initialState = {
    visibilityFilter: actionTypes.VisibilityFilters.SHOW_ALL,
    todos: []
};

const { SHOW_ALL } = actionTypes.VisibilityFilters;


function doToApp(state, action) {
    switch (action.type) {
        case actionTypes.SET_VISIBILITY_FILTER:
            return action.filter;
        case actionTypes.ADD_TODO:
            return Object.assign({}, state, {
                todos: [
                    ...state.todos,
                    {
                        text: action.text,
                        completed: false
                    }
                ]
            });
        default:
            return state;
    }
}
//以上两个逻辑由于不存在关联性，可以拆分成不同的reducer


function visibilityFilter(state = SHOW_ALL, action) {
    switch (action.type) {
        case actionTypes.SET_VISIBILITY_FILTER:
            // console.log(state);
            console.log(action.filter);
            return action.filter;
        default://必须要有缺省值
            console.log("visibilityFilter default");
            return state;
    }
}

function todo(state = initialState, action) {
    switch (action.type) {
        case actionTypes.ADD_TODO:
            return Object.assign({}, state, {
                todo: [
                    ...state.todos,
                    {
                        text: action.text,
                        completed: false
                    }
                ]
            });
            /*return [
                ...state.todos,
                {
                    text: action.text,
                    completed: false
                }
            ];*/
        default://必须要有缺省值
            console.log("todos default");
            return state;
    }
}

const todoApp = combineReducers({
    visibilityFilter,
    todo
});

export default todoApp;

//如果没有initialState，最后reducer会根据函数的名称和返回值组成一个state对象数

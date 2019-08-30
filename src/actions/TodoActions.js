import { actionTypes } from './ActionTypes'


/**
 * action 创建函数，只是简单的返回一个 action
 */



export function addTodo(text) {
    return { type: actionTypes.ADD_TODO, text }
}

export function toggleTodo() {
    return { type: actionTypes.TOGGLE_TODO }
}

export function setVisibilityFilter(filter) {
    return { type: actionTypes.SET_VISIBILITY_FILTER, filter }
}

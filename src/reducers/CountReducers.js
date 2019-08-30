import { actionTypes } from '../actions/ActionTypes'



export function counter(state, action) {
    switch (action.type) {
        case actionTypes.INCREMENT:
            return action.text + 2;
        case actionTypes.DECREMENT:
            return action.index - 2;
        default:
            return state;
    }
}

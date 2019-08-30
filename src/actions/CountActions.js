import { actionTypes } from './ActionTypes'

export function increment(text) {
    return { type: actionTypes.INCREMENT, text }
}

export function decrement(index) {
    return { type: actionTypes.DECREMENT, index }
}

export function idecrement() {
    return { type: 'idec' }
}

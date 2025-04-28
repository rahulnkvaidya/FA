import { SEND_MESSAGE, RECEIVE_MESSAGE, SET_ERROR } from '../action/chatAction';

const initialState = {
    chatHistory: [],
    error: null
};

const chatReducer = (state = initialState, action) => {
    switch (action.type) {
        case SEND_MESSAGE:
            return {
                ...state,
                chatHistory: [...state.chatHistory, { user: 'You', text: action.payload }],
                error: null
            };
        case RECEIVE_MESSAGE:
            return {
                ...state,
                chatHistory: [...state.chatHistory, { user: 'GPT-4', text: action.payload }],
                error: null
            };
        case SET_ERROR:
            return {
                ...state,
                error: action.payload
            };
        default:
            return state;
    }
};

export default chatReducer;

import axios from 'axios';
import { serverUrl } from '../../config';

// Action Types
export const SEND_MESSAGE = 'SEND_MESSAGE';
export const RECEIVE_MESSAGE = 'RECEIVE_MESSAGE';
export const SET_ERROR = 'SET_ERROR';

// Action Creators
export const sendMessage = (message) => ({
    type: SEND_MESSAGE,
    payload: message
});

export const receiveMessage = (message) => ({
    type: RECEIVE_MESSAGE,
    payload: message
});

export const setError = (error) => ({
    type: SET_ERROR,
    payload: error
});

// Thunk Action
export const fetchChatResponse = (userMessage) => {
    return async (dispatch) => {
        const options = {
            method: 'POST',
            url: `${serverUrl}/api/ai/chat`,
            headers: {
                'Content-Type': 'application/json',
                'api-key': 'bJkbHNxeUJTTCyBK/HTJcdci2NOWIu2XfCWpqfUY'
            },
            data: JSON.stringify({ message: userMessage })
        };

        dispatch(sendMessage(userMessage));

        try {
            const response = await axios.request(options);
            const gptMessage = response.data.message;
            console.log(response, "action")
            dispatch(receiveMessage(gptMessage));
        } catch (error) {
            dispatch(setError('Failed to fetch response from GPT-4'));
            console.error(error);
        }
    };
};

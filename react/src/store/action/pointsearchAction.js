import axios from "axios";
import { serverUrl } from "../../config";

export const POINT_SEARCH = "POINT_SEARCH";
export const FETCH_USER_DATA_FAILURE = "FETCH_USER_DATA_FAILURE";

export const fetchUserDataByMobileNumber = (user) => {
    return async (dispatch) => {
        const apiKey = 'bJkbHNxeUJTTCyBK/HTJcdci2NOWIu2XfCWpqfUY';
        const options = {
            method: 'GET',
            url: serverUrl + '/api/usersearch/'+ user,
            headers: {
                'api-key': apiKey
            }
        };

        try {
            const response = await axios.request(options);
            const liveScoreData = response.data;
            console.log("action=",liveScoreData)
            dispatch({ type: POINT_SEARCH, board: liveScoreData });
        } catch (error) {
            console.error(error);
        }
    };
};

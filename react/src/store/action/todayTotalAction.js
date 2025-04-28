import axios from "axios";
import { serverUrl } from "../../config";
// import { menu } from "../../data/menu";
export const TODAY_TOTAL = "TODAY_TOTAL";


export const fetchLiveScore = (date) => {
    return async (dispatch) => {
        const apiKey = 'bJkbHNxeUJTTCyBK/HTJcdci2NOWIu2XfCWpqfUY';
        const options = {
            method: 'GET',
            url: serverUrl + '/api/orderreporttotal/'+ date,
            headers: {
                'api-key': apiKey
            }
        };

        try {
            const response = await axios.request(options);
            const liveScoreData = response.data;
            console.log("action=", liveScoreData)
            dispatch({ type: TODAY_TOTAL, board: liveScoreData[0] });
        } catch (error) {
            console.error(error);
        }
    };
};
import axios from "axios";
import { serverUrl } from "../../config";
// import { menu } from "../../data/menu";
export const POINTS = "POINTS";


export const fetchLiveScore = (user) => {
    return async (dispatch) => {
        const apiKey = 'bJkbHNxeUJTTCyBK/HTJcdci2NOWIu2XfCWpqfUY';
        const options = {
            method: 'GET',
            url: serverUrl + '/api/users/points/'+ user,
            headers: {
                'api-key': apiKey
            }
        };

        try {
            const response = await axios.request(options);
            const liveScoreData = response.data;
         //   console.log("action=",response)
            dispatch({ type: POINTS, board: liveScoreData });
        } catch (error) {
            console.error(error);
        }
    };
};
// export const fetchlist = (pageno, limit) => {
//   console.log("menu")
//   return async (dispatch) => {
//     dispatch({ type: MENU_LIST, board: menu });
//   };
// };

import axios from "axios";
import { serverUrl } from "../../config";
// import { menu } from "../../data/menu";
export const GAME = "GAME";


export const fetchLiveScore = () => {
    return async (dispatch) => {
        const apiKey = 'bJkbHNxeUJTTCyBK/HTJcdci2NOWIu2XfCWpqfUY';
        const options = {
            method: 'GET',
            url: serverUrl + '/api/game',
            headers: {
                'api-key': apiKey
            }
        };

        try {
            const response = await axios.request(options);
            const liveScoreData = response.data;
        //    console.log("action=", liveScoreData)
            dispatch({ type: GAME, board: liveScoreData });
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

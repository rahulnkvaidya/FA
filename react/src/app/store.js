import { configureStore } from '@reduxjs/toolkit';
import gameReudcer from '../store/reducer/gameReducer';
import pointReducer from "../store/reducer/pointReducer";
import historyReducer from "../store/reducer/historyReducer";
import pointsearchReducer from "../store/reducer/pointsearchReducer";
import todaytotalReducer from "../store/reducer/todayTotalReducer";
import chatReducer from '../store/reducer/chatReducer';

export const store = configureStore({
  reducer: {
    game: gameReudcer,
    point: pointReducer,
    history: historyReducer,
    pointsearch : pointsearchReducer,
    todaytotal : todaytotalReducer,
    chat: chatReducer
  },
});

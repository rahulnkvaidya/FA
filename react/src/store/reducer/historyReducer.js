import {
  HISTORY,
    } from "../action/historyAction";
    
    const Reducer = (state = [], action) => {
      switch (action.type) {
        case HISTORY:
          return [action.board];
          default:
        return state
      }
    };
    
    export default Reducer;
    
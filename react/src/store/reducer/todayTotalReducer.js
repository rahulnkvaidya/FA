import {
    TODAY_TOTAL,
    } from "../action/todayTotalAction";
    
    const Reducer = (state = [], action) => {
      switch (action.type) {
        case TODAY_TOTAL:
          return [action.board];
          default:
        return state
      }
    };
    
    export default Reducer;
    
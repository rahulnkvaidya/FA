import {
    POINTS,
    } from "../action/pointAction";
    
    const Reducer = (state = [], action) => {
      switch (action.type) {
        case POINTS:
          return [action.board];
          default:
        return state
      }
    };
    
    export default Reducer;
    
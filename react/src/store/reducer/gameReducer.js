import {
    GAME,
    } from "../action/gameAction";
    
    const Reducer = (state = [], action) => {
      switch (action.type) {
        case GAME:
          return [action.board];
          default:
        return state
      }
    };
    
    export default Reducer;
    
import { POINT_SEARCH } from '../action/pointsearchAction';
    
    const Reducer = (state = [], action) => {
      switch (action.type) {
        case POINT_SEARCH:
          return [action.board];
          default:
        return state
      }
    };
    
    export default Reducer;
    
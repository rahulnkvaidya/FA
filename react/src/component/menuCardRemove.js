import React from 'react';
import { removeFromCart } from '../store/actions/cartAction';
import { useDispatch } from 'react-redux';


function Component(props) {

  const dispatch = useDispatch();


  let MinusButton = () => {
    const count = props.items.filter(item => item.id === props.id).length;

    console.log('count = ', count); // Output: 3
    return (
      <div>
        <div className="input-group-prepend">
          <button className="btn btn-outline-primary" type="button" onClick={() => decNum(props.id)}>-</button>
        </div>
        <div> {count} </div>
      </div>
    );
  }

  let decNum = (id) => {
    // console.log(id);
    dispatch(removeFromCart(id));
  }

  let result = props.items?.find(item => item.id === props.id);


  
  //console.log('result', result, '=', props.id);
  if (result === undefined) {
    return (
      <div>
      </div>
    );
  } else {
    /////////////
    if (parseInt(result.id) === parseInt(props.id)) {
      return (
        <div>
          <MinusButton />
        </div>
      );
    } else {
      return (
        <div>
        </div>
      );
    }

    /////////////
  }


}

export default Component;
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import * as cartAction from '../store/actions/cartAction';
import MenuCardAdd from './menuCardRemove';

export const MenuCard = (props) => {
  const [user, setUser] = useState([]);
  const dispatch = useDispatch();
  const fav = useSelector((state) => state.cart);

  useEffect(() => {
    dispatch(cartAction.fetchlist([]));
  }, [dispatch]);

  useEffect(() => {
    setUser(fav[0]);
    console.log('cart =', fav[0])
  }, [fav]);

  return (
    <div className="col-12 mt-3">
      <div className="row border border-primary rounded m-1 shadow">
        <h2 className="col-12 p-2 border-bottom bg-dark text-light">{props.title}</h2>
        {props.morning.map((person, index) => (
          <div key={person.id} className="col-6 col-md-4 col-lg-3 p-2">
            <div className="card h-100">
              <div className="card-body">
                <h5 className="card-title">{person.id} - {person.name}</h5>
                <p className="card-text">Rs. {person.price}/-</p>
                <div className="input-group">
                  <MenuCardAdd items={user} id={person.id} />
                  <button className="btn btn-outline-primary ml-2" type="button" onClick={(e) => {
                    dispatch(cartAction.fetchlist([...user, { 'id': person.id, 'name': person.name, 'size': person.size, 'price': person.price, 'table': props.tableid }]));
                  }
                  }>+</button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

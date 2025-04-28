import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector } from 'react-redux';

export default function MenuLink(props) {
  let [user, setUser] = useState([]);
  const data = useSelector(state => state.runningtable);

  useEffect(() => {
      if (data && data.length > 0) {
          setUser(data); // Set the entire data array
      }
  }, [data]);

  const allTables = user.flatMap(bill => {
    return bill.Items ? bill.Items.map(item => Number(item.tableid)) : [];
  });

  const tableStatus = allTables.includes(Number(props.id)) ? "Occupied" : "Available";

  const name = `${props.name} - ${tableStatus}`;
  var linka = '/menu/' + props.id;

  // Set button class based on table status
  const buttonClass = tableStatus === "Occupied" ? "btn btn-warning ml-2" : "btn btn-primary ml-2";

  return (
    <button type="button" className={buttonClass}>
      <Link className="nav-link" to={linka}>{name}</Link>
    </button>
  );
}

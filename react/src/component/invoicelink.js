import React from 'react';
import { Link } from "react-router-dom";

export default function InvoiceLink(props) {
 // console.log(props.id);
  var linka = '/invoiceprint/' + props.id;
  
  return (
    <button type="button" className="btn btn-primary">
      <Link className="text-white" to={linka}>
        View
      </Link>
    </button>
  );
}

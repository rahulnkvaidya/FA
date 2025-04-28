import React from 'react';
import { Link } from "react-router-dom";

export default function MenuLink(props) {
    const name = props.name;
    var linka = '/invoiceadditem/' + props.id + "/" + props.invoiceid;

    return (
        <Link className="btn btn-primary" to={linka}>{name}</Link>
    )
}

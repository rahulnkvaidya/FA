import React from 'react';
import { Link } from 'react-router-dom';

export const Card = (props) => {
    return (
        <div className="col-sm-2  mt-2 ">
            <Link to={props.url}>
                <div className="row border border-primary round-circle m-1 shadow">
                    <h2 className="col-12 p-2 border bg-dark text-light">{props.title}</h2>
                    <div className="p-0 m-0 col-4 col-sm-6 col-md-6 col-lg-2 col-lg-2">
                        <div className="card m-1">
                            <div className="card-body p-1">

                                <p className="card-text"></p>
                            </div>
                        </div>
                    </div>
                </div>
            </Link>
        </div>
    );
}

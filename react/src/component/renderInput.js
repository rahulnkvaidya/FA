import React from "react";

export default function renderInput({
  input,
  label,
  type,
  meta: { touched, error },
}) {
  // console.log(input);
  return (
    <div className="form-group">
      <div className="col-12 m-0">
        <input
          {...input}
          className="form-control"
          type={type}
          placeholder={label}
        />
        {touched && error && <span>{error}</span>}
      </div>
    </div>
  );
}

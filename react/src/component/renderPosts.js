import React, { useState, useEffect } from "react";
import { Field } from "redux-form";
import renderInput from "./renderInput";
import renderTextarea from "./renderTextarea";

let RenderPosts = ({ fields = {post:''}, meta: { error, submitFailed } }) => {
  // useEffect(() => {
  //   //  console.log(city)
  //  fields.push({})
  // },[fields]);
  // const dispatch = useDispatch();

  // var postOnChange = (value) => {
  //   console.log(value.target.value);
  //   dispatch(PostAction.fetchPostChange(value.target.value));
  // };

  return (
    <div className="col-12 border border-primary round-circle m-1 p-1">
      <div className="col-12">
        <button
          type="button"
          className="btn btn-warning float-right m-2"
          onClick={() => fields.push({})}
        >
          Add Post
      </button>

      </div>

      {submitFailed && error && <span>{error}</span>}

      {fields.map((member, index) => (
        <div key={index}>
          <div className="row">
            <div className="col-6">
              <div className="form-group">
                <label
                  for="applicationFormUrl"
                  className="col-6 col-form-label"
                >
                  Post #{index + 1} Post
                </label>
                <Field
                  name={`${member}.post`}
                  className="col-12 form-control "
                  type="text"
                  component={renderInput}
                //   onChange={(newValue) => postOnChange(newValue)}
                />
              </div>
            </div>
            <div className="col-3">
              <div className="form-group">
                <label
                  for="applicationFormUrl"
                  className="col-12 col-form-label"
                >
                  Vacancy
                </label>
                <Field
                  name={`${member}.vac`}
                  className="form-control"
                  type="text"
                  component={renderInput}
                />
              </div>
            </div>

          </div>

          <div className="form-group">
            <label
              for="applicationFormUrl"
              className="col-12 col-form-label"
            >
              Education
            </label>
            <div className="form-group row">
              <div className="col-sm-12">
                <Field
                  name={`${member}.edu`}
                  className="form-control"
                  type="text"
                  component={renderTextarea}
                />
              </div>
            </div>
            <div className="form-group">
              <div className="col-12">
                <div className="form-group">
                  <label
                    for="applicationFormUrl"
                    className="col-6 col-form-label"
                  >
                    Pay
                </label>
                  <Field
                    name={`${member}.pay`}
                    className="col-12 form-control "
                    type="text"
                    component={renderInput}
                  //   onChange={(newValue) => postOnChange(newValue)}
                  />
                </div>
              </div>
            </div>
            <div className="form-group">
              <div className="col-12">
                <div className="form-group">
                  <label
                    for="applicationFormUrl"
                    className="col-6 col-form-label"
                  >
                    Age
                </label>
                  <Field
                    name={`${member}.age`}
                    className="col-12 form-control "
                    type="text"
                    component={renderInput}
                  //   onChange={(newValue) => postOnChange(newValue)}
                  />
                </div>
              </div>
            </div>
            <div className="col-12 bg-light">
              <div className="form-group">
                <button
                  type="button"
                  className="btn btn-warning text-light"
                  title="Remove Member"
                  onClick={() => fields.remove(index)}
                >
                  Remove Post
                </button>
                <button
                  type="button"
                  className="btn btn-info float-right"
                  onClick={() => fields.push({})}
                >
                  Add Post
      </button>
              </div>
            </div>
          </div>

        </div>
      ))}
    </div>
  );
};

export default RenderPosts;

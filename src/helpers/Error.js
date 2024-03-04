import React from "react";

export const errorResponse = (error) => {
  console.log(error);
  try {
    if (error.response.status == "422") {
      return error.response.data.data;
    } else {
      return error.response.data.message != undefined
        ? messageParser(error.response.data.message)
        : messageParser("Error occurred");
    }
  } catch (e) {
    messageParser("Error occurred");
  }
};

const messageParser = (message) => [{ msg: message }];

export const Error = (props) => {
  return (
    <>
      {props.errors !== "" ? (
        <div className="alert alert-danger fade show form-error" role="alert">
          <ul className="error-ul">
            {Object.keys(props.errors).map((err, index) => (
              <li key={index}>{props.errors[err].msg}</li>
            ))}
          </ul>
        </div>
      ) : (
        ""
      )}
    </>
  );
};

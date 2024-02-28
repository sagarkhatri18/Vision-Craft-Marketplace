// For Toastr
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const errorResponse = (error) => {
  if (error.response.status == "422") {
    return error.response.data.data;
    // error.response.data.data.forEach((item) => {
    //   toast.error(item.msg);
    // });
  } else {
    // if (error.response.data.message != undefined)
    //   toast.error(error.response.data.message);
    // else toast.error("Error occured");

    return error.response.data.message != undefined
      ? messageParser(error.response.data.message)
      : messageParser("Error occurred");
  }
};

const messageParser = (message) => [{ msg: message }];

// show th error
export const Error = (props) => {
  return (
    <>
      {props.errors !== "" ? (
        <div className="alert alert-danger fade show form-error" role="alert">
          <ul className="error-ul">
            {Object.keys(props.errors).map((err, index) => (
              <li key={index}>{err}</li>
            ))}
          </ul>
        </div>
      ) : (
        ""
      )}
    </>
  );
};

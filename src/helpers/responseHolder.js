// For Toastr
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const errorResponse = (error) => {
  if (error.response.status == "422") {
    error.response.data.data.forEach((item) => {
      toast.error(item.msg);
    });
  } else {
    if (error.response.data.message != undefined)
      toast.error(error.response.data.message);
    else toast.error("Registration failed");
  }
};

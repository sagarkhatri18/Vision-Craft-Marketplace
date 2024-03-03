import { getCatgories } from "../../../services/Category";
import { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { showLoader, hideLoader } from "../../../actions/Action";
import CategoryDashboardData from "./CategoryDashboardData";
import { toast } from "react-toastify";

export const CustomerDashboard = () => {
  const dispatch = useDispatch();
  const [categories, setCategories] = useState([]);

  const loadCategories = useCallback(() => {
    dispatch(showLoader());
    getCatgories()
      .then((data) => {
        dispatch(hideLoader());
        const apiResponse = data.data;
        setCategories(apiResponse);
      })
      .catch((error) => {
        dispatch(hideLoader());
        toast.error("Error occured while fetching data");
      });
  }, []);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  return (categories != null)?<CategoryDashboardData data={categories} />:"Failed to load data";
};

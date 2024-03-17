import React, { useState } from "react";
import { searchProduct } from "../../../services/Product";
import { useNavigate } from "react-router";

const SearchBar = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState(" ");

  // search products on the basis of title
  const loadProducts = async (title) => {
    if (title.trim() != "") {
      await searchProduct(title)
        .then(async (data) => {
          const apiResponse = data.data.data;
          setTitle(apiResponse);
        })
        .catch((error) => {
          toast.error("Error occured while fetching data");
        });
    }
  };

  // handle input fields onchange value
  const handleChange = async (e) => {
    setTitle(e.target.value);
  };

  // handle form submission
  const handleSubmit = (event) => {
    event.preventDefault();

    if (title.trim() != "") {
      navigate(`/product/search/${title}`)
      //loadProducts(title);
    }
  };

  return (
    <div className="nav-item" style={{ width: "40%" }}>
      <div className="row">
        <div className="col-12 card-margin">
          <div className="card search-form">
            <div className="card-body p-0">
              <form id="search-form" onSubmit={handleSubmit}>
                <div className="row no-gutters">
                  <div className="col-8 p-0">
                    <input
                      type="text"
                      placeholder="What are you looking for?"
                      className="form-control"
                      id="title"
                      onChange={handleChange}
                      name="title"
                    />
                  </div>
                  <div className="col-4 p-0">
                    <button
                      type="submit"
                      className="btn btn-base"
                      style={{ margin: "auto" }}
                    >
                      Search <i className="fa fa-search"></i>
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;

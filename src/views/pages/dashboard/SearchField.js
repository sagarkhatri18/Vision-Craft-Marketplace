import React from "react";
import { useNavigate } from "react-router";

const SearchField = ({
  categories,
  searchKey,
  category,
  setSearchKey,
  setCategory,
}) => {
  const navigate = useNavigate();

  // handle input fields onchange value
  const handleChange = async (e) => {
    setSearchKey(e.target.value);
  };

  // Handle input fields onchange value
  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
  };

  // handle form submission
  const handleSubmit = (event) => {
    event.preventDefault();
    // Construct the search query string
    const queryString = `?category=${category}&searchKey=${searchKey || ""}`;
    navigate(`/product/search${queryString}`);
  };

  return (
    <div className="row justify-content-center">
      <div className="col-md-6">
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <select
              className="form-control"
              onChange={handleCategoryChange}
              value={category || ""}
            >
              <option value="">Select Category</option>
              {categories.map((category, index) => (
                <option key={index} value={category._id}>
                  {category.name}
                </option>
              ))}
            </select>
            <input
              type="text"
              onChange={handleChange}
              value={searchKey || ""}
              className="form-control"
              placeholder="What are you looking for?"
            />
            <span className="input-group-btn">
              <button className="btn btn-default" type="submit">
                Search <i className="fa fa-search"></i>
              </button>
            </span>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SearchField;

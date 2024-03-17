import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";

const SearchBar = () => {
  const navigate = useNavigate();
  const params = useParams();
  const [title, setTitle] = useState(" ");

  // handle input fields onchange value
  const handleChange = async (e) => {
    setTitle(e.target.value);
  };

  // handle form submission
  const handleSubmit = (event) => {
    event.preventDefault();

    if (title.trim() != "") {
      navigate(`/product/search/${title}`);
    }
  };

  // Fill the search bar with the URL parameter on initial render
  useEffect(() => {
    setTitle(params.title || ""); // Set the search term from URL parameter
  }, [params.title]);

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
                      value={title}
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

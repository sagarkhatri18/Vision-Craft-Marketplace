import React from "react";

const SearchBar = () => {
  return (
    <div className="nav-item" style={{ width: "40%" }}>
      <div className="row">
        <div className="col-12 card-margin">
          <div className="card search-form">
            <div className="card-body p-0">
              <form id="search-form">
                <div className="row no-gutters">
                  <div className="col-8 p-0">
                    <input
                      type="text"
                      placeholder="Search..."
                      className="form-control"
                      id="search"
                      name="search"
                    />
                  </div>
                  <div className="col-4 p-0">
                    <button
                      type="submit"
                      className="btn btn-base"
                      style={{ margin: "auto" }}
                    >
                      Search
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

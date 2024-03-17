import React from "react";
import { Card, Col, Row } from "react-bootstrap";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { useNavigate } from "react-router";

const SearchResult = ({ items, searchKey, category, date, price }) => {
  const navigate = useNavigate();

  const productImage = (product) => {
    const source = `${process.env.REACT_APP_API_BASE_URL}/${product.filePath}/thumbnails/${product.image}`;
    const imageSrc = source ? source : placeHolderImage;

    return (
      <img
        src={imageSrc}
        alt={product.title}
        style={{ width: "50px", height: "50px" }}
        onError={(e) => {
          e.target.src = placeHolderImage;
        }}
      />
    );
  };

  const getCategoryName = (product) => product.categoryId.name;

  const getUserName = (product) =>
    product.userId.firstName + " " + product.userId.lastName;

  const formatDate = (product) => new Date(product.createdAt).toLocaleString();

  const priceFormatter = (product) => "$" + product.priceAfterDiscount;

  // handle form submission
  const handleSubmit = (event) => {
    event.preventDefault();
    // Construct the search query string
    const queryString = `?category=${category}&searchKey=${searchKey}&dateFrom=${date.dateFrom}&dateTo=${date.dateTo}&priceFrom=${price.priceFrom}&priceTo=${price.priceTo}`;
    navigate(`/product/search${queryString}`);
  };

  return (
    <Row>
      <Col md="12">
        <Card>
          <Card.Body>
            <Card.Body>
              <div className="search">
                <div className="row pb-3">
                  <div className="col-md-2">
                    <form onSubmit={handleSubmit}>
                      <h5>By Posted Date:</h5>
                      From
                      <input
                        className="form-control mb-2"
                        type="date"
                        value={date.dateFrom}
                        onChange={(e) => date.setDateFrom(e.target.value)}
                      />
                      To
                      <input
                        className="form-control"
                        type="date"
                        value={date.dateTo}
                        onChange={(e) => date.setDateTo(e.target.value)}
                      />
                      <div className="padding" />
                      <br></br>
                      <h5>By price:</h5>
                      From
                      <input
                        className="form-control mb-2"
                        type="number"
                        min={1}
                        value={price.priceFrom}
                        onChange={(e) => price.setPriceFrom(e.target.value)}
                      />
                      To
                      <input
                        className="form-control mb-2"
                        type="number"
                        value={price.priceTo}
                        onChange={(e) => price.setPriceTo(e.target.value)}
                      />
                      <br></br>
                      <button
                        type="submit"
                        className="btn btn-block btn-sm btn-success"
                      >
                        Apply Filter
                      </button>
                    </form>
                  </div>

                  <div className="col-md-10">
                    {searchKey && (
                      <p style={{ fontSize: "13px" }}>
                        Showing all results matching "{searchKey}"
                      </p>
                    )}
                    <div className="padding" />

                    <div className="col-12">
                      <DataTable
                        size="small"
                        value={items}
                        paginator
                        rows={15}
                        rowsPerPageOptions={[15, 30, 45]}
                        tableStyle={{ minWidth: "50rem" }}
                      >
                        <Column body={productImage} header=""></Column>
                        <Column field="title" sortable header="Title"></Column>
                        <Column
                          body={getCategoryName}
                          sortable
                          header="Category"
                          field="categoryId.name"
                        ></Column>
                        <Column
                          body={getUserName}
                          sortable
                          field="userId.firstName"
                          header="Added By"
                        ></Column>
                        <Column
                          field="availableQuantity"
                          sortable
                          header="Available Quantity"
                        ></Column>
                        <Column
                          body={priceFormatter}
                          field="priceAfterDiscount"
                          sortable
                          header="Price(in CAD)"
                        ></Column>

                        <Column
                          body={formatDate}
                          sortable
                          field="createdAt"
                          header="Posted At"
                        ></Column>
                      </DataTable>
                    </div>
                  </div>
                </div>
              </div>
            </Card.Body>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};

export default SearchResult;

import React from "react";
import { Card, Col, Container, Row } from "react-bootstrap";

const SearchResult = () => {
  return (
    <>
      <Container fluid>
        <Row>
          <Col md="12">
            <Card className="card-stats">
              <Card.Body>
                {/* <div className="col-md-12"> */}
                  <div className="search">
                    {/* <div className="grid-body"> */}
                      <div className="row">
                        <div className="col-md-3">
                          <h4 className="grid-title">
                            <i className="mr-2 fa fa-filter" /> Filters
                          </h4>
                          <hr />
                          {/* BEGIN FILTER BY CATEGORY */}
                          <h4>By category:</h4>
                          <div className="checkbox">
                            <label>
                              <input type="checkbox" className="icheck" />{" "}
                              Application
                            </label>
                          </div>
                          <div className="checkbox">
                            <label>
                              <input type="checkbox" className="icheck" />{" "}
                              Design
                            </label>
                          </div>
                          <div className="checkbox">
                            <label>
                              <input type="checkbox" className="icheck" />{" "}
                              Desktop
                            </label>
                          </div>
                          <div className="checkbox">
                            <label>
                              <input type="checkbox" className="icheck" />{" "}
                              Management
                            </label>
                          </div>
                          <div className="checkbox">
                            <label>
                              <input type="checkbox" className="icheck" />{" "}
                              Mobile
                            </label>
                          </div>
                          {/* END FILTER BY CATEGORY */}
                          <div className="padding" />
                          {/* BEGIN FILTER BY DATE */}
                          <h4>By date:</h4>
                          From
                          <div
                            className="input-group date form_date"
                            data-date="2014-06-14T05:25:07Z"
                            data-date-format="dd-mm-yyyy"
                            data-link-field="dtp_input1"
                          >
                            <input type="text" className="form-control" />
                            <span className="input-group-addon bg-blue">
                              <i className="fa fa-th" />
                            </span>
                          </div>
                          <input
                            type="hidden"
                            id="dtp_input1"
                            defaultValue=""
                          />
                          To
                          <div
                            className="input-group date form_date"
                            data-date="2014-06-14T05:25:07Z"
                            data-date-format="dd-mm-yyyy"
                            data-link-field="dtp_input2"
                          >
                            <input type="text" className="form-control" />
                            <span className="input-group-addon bg-blue">
                              <i className="fa fa-th" />
                            </span>
                          </div>
                          <input
                            type="hidden"
                            id="dtp_input2"
                            defaultValue=""
                          />
                          {/* END FILTER BY DATE */}
                          <div className="padding" />
                          {/* BEGIN FILTER BY PRICE */}
                          <h4>By price:</h4>
                          Between <div id="price1">$300</div> to{" "}
                          <div id="price2">$800</div>
                          <div className="slider-primary">
                            <div
                              className="slider slider-horizontal"
                              style={{ width: 152 }}
                            >
                              <div className="slider-track">
                                <div
                                  className="slider-selection"
                                  style={{ left: "30%", width: "50%" }}
                                />
                                <div
                                  className="slider-handle round"
                                  style={{ left: "30%" }}
                                />
                                <div
                                  className="slider-handle round"
                                  style={{ left: "80%" }}
                                />
                              </div>
                              <div
                                className="tooltip top hide"
                                style={{ top: "-30px", left: "50.1px" }}
                              >
                                <div className="tooltip-arrow" />
                                <div className="tooltip-inner">300 : 800</div>
                              </div>
                              <input
                                type="text"
                                className="slider"
                                defaultValue=""
                                data-slider-min={0}
                                data-slider-max={1000}
                                data-slider-step={1}
                                data-slider-value="[300,800]"
                                data-slider-tooltip="hide"
                              />
                            </div>
                          </div>
                          {/* END FILTER BY PRICE */}
                        </div>
                        {/* END FILTERS */}
                        {/* BEGIN RESULT */}
                        <div className="col-md-9">
                          <h4>
                            <i className="fa fa-file" /> Result
                          </h4>
                          <hr />
                          
                          <p>Showing all results matching "web development"</p>
                          <div className="padding" />
                          <div className="row">
                            {/* BEGIN ORDER RESULT */}
                            <div className="col-sm-6">
                              <div className="btn-group">
                                <button
                                  type="button"
                                  className="btn btn-default dropdown-toggle"
                                  data-toggle="dropdown"
                                >
                                  Order by <span className="caret" />
                                </button>
                                <ul className="dropdown-menu" role="menu">
                                  <li>
                                    <a href="#">Name</a>
                                  </li>
                                  <li>
                                    <a href="#">Date</a>
                                  </li>
                                  <li>
                                    <a href="#">View</a>
                                  </li>
                                  <li>
                                    <a href="#">Rating</a>
                                  </li>
                                </ul>
                              </div>
                            </div>
                            {/* END ORDER RESULT */}
                            <div className="col-md-6 text-right">
                              <div className="btn-group">
                                <button
                                  type="button"
                                  className="btn btn-default active"
                                >
                                  <i className="fa fa-list" />
                                </button>
                                <button
                                  type="button"
                                  className="btn btn-default"
                                >
                                  <i className="fa fa-th" />
                                </button>
                              </div>
                            </div>
                          </div>
                          {/* BEGIN TABLE RESULT */}
                          <div className="table-responsive">
                            <table className="table table-hover">
                              <tbody>
                                <tr>
                                  <td className="number text-center">1</td>
                                  <td className="image">
                                    <img
                                      src="https://www.bootdey.com/image/400x300/FF8C00"
                                      alt=""
                                    />
                                  </td>
                                  <td className="product">
                                    <strong>Product 1</strong>
                                    <br />
                                    This is the product description.
                                  </td>
                                  <td className="rate text-right">
                                    <span>
                                      <i className="fa fa-star" />
                                      <i className="fa fa-star" />
                                      <i className="fa fa-star" />
                                      <i className="fa fa-star" />
                                      <i className="fa fa-star-half-o" />
                                    </span>
                                  </td>
                                  <td className="price text-right">$350</td>
                                </tr>
                                <tr>
                                  <td className="number text-center">2</td>
                                  <td className="image">
                                    <img
                                      src="https://www.bootdey.com/image/400x300/5F9EA0"
                                      alt=""
                                    />
                                  </td>
                                  <td className="product">
                                    <strong>Product 2</strong>
                                    <br />
                                    This is the product description.
                                  </td>
                                  <td className="rate text-right">
                                    <span>
                                      <i className="fa fa-star" />
                                      <i className="fa fa-star" />
                                      <i className="fa fa-star" />
                                      <i className="fa fa-star-o" />
                                      <i className="fa fa-star-o" />
                                    </span>
                                  </td>
                                  <td className="price text-right">$1,050</td>
                                </tr>
                                <tr>
                                  <td className="number text-center">3</td>
                                  <td className="image">
                                    <img
                                      src="https://www.bootdey.com/image/400x300"
                                      alt=""
                                    />
                                  </td>
                                  <td className="product">
                                    <strong>Product 3</strong>
                                    <br />
                                    This is the product description.
                                  </td>
                                  <td className="rate text-right">
                                    <span>
                                      <i className="fa fa-star" />
                                      <i className="fa fa-star" />
                                      <i className="fa fa-star" />
                                      <i className="fa fa-star-half-o" />
                                      <i className="fa fa-star-o" />
                                    </span>
                                  </td>
                                  <td className="price text-right">$550</td>
                                </tr>
                                <tr>
                                  <td className="number text-center">4</td>
                                  <td className="image">
                                    <img
                                      src="https://www.bootdey.com/image/400x300/8A2BE2"
                                      alt=""
                                    />
                                  </td>
                                  <td className="product">
                                    <strong>Product 4</strong>
                                    <br />
                                    This is the product description.
                                  </td>
                                  <td className="rate text-right">
                                    <span>
                                      <i className="fa fa-star" />
                                      <i className="fa fa-star" />
                                      <i className="fa fa-star" />
                                      <i className="fa fa-star" />
                                      <i className="fa fa-star-o" />
                                    </span>
                                  </td>
                                  <td className="price text-right">$330</td>
                                </tr>
                                <tr>
                                  <td className="number text-center">5</td>
                                  <td className="image">
                                    <img
                                      src="https://www.bootdey.com/image/400x300"
                                      alt=""
                                    />
                                  </td>
                                  <td className="product">
                                    <strong>Product 5</strong>
                                    <br />
                                    This is the product description.
                                  </td>
                                  <td className="rate text-right">
                                    <span>
                                      <i className="fa fa-star" />
                                      <i className="fa fa-star" />
                                      <i className="fa fa-star" />
                                      <i className="fa fa-star" />
                                      <i className="fa fa-star" />
                                    </span>
                                  </td>
                                  <td className="price text-right">$540</td>
                                </tr>
                                <tr>
                                  <td className="number text-center">6</td>
                                  <td className="image">
                                    <img
                                      src="https://www.bootdey.com/image/400x300/6495ED"
                                      alt=""
                                    />
                                  </td>
                                  <td className="product">
                                    <strong>Product 6</strong>
                                    <br />
                                    This is the product description.
                                  </td>
                                  <td className="rate text-right">
                                    <span>
                                      <i className="fa fa-star" />
                                      <i className="fa fa-star" />
                                      <i className="fa fa-star" />
                                      <i className="fa fa-star" />
                                      <i className="fa fa-star-half-o" />
                                    </span>
                                  </td>
                                  <td className="price text-right">$870</td>
                                </tr>
                                <tr>
                                  <td className="number text-center">7</td>
                                  <td className="image">
                                    <img
                                      src="https://www.bootdey.com/image/400x300/DC143C"
                                      alt=""
                                    />
                                  </td>
                                  <td className="product">
                                    <strong>Product 7</strong>
                                    <br />
                                    This is the product description.
                                  </td>
                                  <td className="rate text-right">
                                    <span>
                                      <i className="fa fa-star" />
                                      <i className="fa fa-star" />
                                      <i className="fa fa-star-o" />
                                      <i className="fa fa-star-o" />
                                      <i className="fa fa-star-o" />
                                    </span>
                                  </td>
                                  <td className="price text-right">$620</td>
                                </tr>
                                <tr>
                                  <td className="number text-center">8</td>
                                  <td className="image">
                                    <img
                                      src="https://www.bootdey.com/image/400x300/9932CC"
                                      alt=""
                                    />
                                  </td>
                                  <td className="product">
                                    <strong>Product 8</strong>
                                    <br />
                                    This is the product description.
                                  </td>
                                  <td className="rate text-right">
                                    <span>
                                      <i className="fa fa-star" />
                                      <i className="fa fa-star" />
                                      <i className="fa fa-star" />
                                      <i className="fa fa-star" />
                                      <i className="fa fa-star-half-o" />
                                    </span>
                                  </td>
                                  <td className="price text-right">$1,550</td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                          {/* END TABLE RESULT */}
                          {/* BEGIN PAGINATION */}
                          <ul className="pagination">
                            <li className="disabled">
                              <a href="#">«</a>
                            </li>
                            <li className="active">
                              <a href="#">1</a>
                            </li>
                            <li>
                              <a href="#">2</a>
                            </li>
                            <li>
                              <a href="#">3</a>
                            </li>
                            <li>
                              <a href="#">4</a>
                            </li>
                            <li>
                              <a href="#">5</a>
                            </li>
                            <li>
                              <a href="#">»</a>
                            </li>
                          </ul>
                        </div>
                      </div>
                    {/* </div> */}
                  {/* </div> */}
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default SearchResult;

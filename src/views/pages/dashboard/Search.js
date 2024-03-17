import React, { useEffect, useState, useCallback } from "react";
import { Card, Col, Container, Row } from "react-bootstrap";
import SearchField from "./SearchField";
import SearchResult from "./SearchResult";
import { useLocation } from "react-router";
import { getCatgories } from "../../../services/Category";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { showLoader, hideLoader } from "../../../actions/Action";
import { searchProduct } from "../../../services/Product";

const Search = () => {
  const dispatch = useDispatch();
  const [categories, setCategories] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const location = useLocation();

  const searchParams = new URLSearchParams(location.search);
  const [searchKey, setSearchKey] = useState(
    searchParams.get("searchKey") || ""
  );
  const [category, setCategory] = useState(searchParams.get("category") || "");
  const [dateFrom, setDateFrom] = useState(searchParams.get("dateFrom") || "");
  const [dateTo, setDateTo] = useState(searchParams.get("dateTo") || "");
  const [priceFrom, setPriceFrom] = useState(
    searchParams.get("priceFrom") || ""
  );
  const [priceTo, setPriceTo] = useState(searchParams.get("priceTo") || "");

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

  // load the search results
  const loadSearchResult = useCallback(() => {
    dispatch(showLoader());

    const formData = {
      title: searchKey,
      categoryId: category,
      dateFrom,
      dateTo,
      priceFrom,
      priceTo,
    };

    searchProduct(formData)
      .then((data) => {
        dispatch(hideLoader());
        const apiResponse = data.data.data;
        setSearchResults(apiResponse);
      })
      .catch((error) => {
        dispatch(hideLoader());
        toast.error("Error occured while fetching data");
      });
  }, [location.search]);

  useEffect(() => {
    loadCategories();
    loadSearchResult();
  }, [loadCategories, loadSearchResult, location.search]);

  return (
    <>
      <Container fluid>
        <Row>
          <Col md="12">
            <Card>
              <Card.Body className="text-center">
                <h4 className="pt-0 mt-0">Search Product</h4>
                <SearchField
                  categories={categories}
                  searchKey={searchKey}
                  category={category}
                  setSearchKey={setSearchKey}
                  setCategory={setCategory}
                />
              </Card.Body>
            </Card>
          </Col>
        </Row>
        <SearchResult
          searchKey={searchKey}
          category={category}
          price={{ priceFrom, priceTo, setPriceFrom, setPriceTo }}
          date={{ dateFrom, dateTo, setDateFrom, setDateTo }}
          items={searchResults}
        />
      </Container>
    </>
  );
};

export default Search;

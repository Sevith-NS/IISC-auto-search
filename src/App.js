import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  MDBTable,
  MDBTableHead,
  MDBTableBody,
  MDBRow,
  MDBCol,
  MDBContainer,
  MDBBtn,
  MDBBtnGroup,
  MDBPagination,
  MDBPaginationItem,
  MDBPaginationLink,
  MDBInput,
  MDBDropdown,
  MDBDropdownToggle,
  MDBDropdownMenu,
  MDBDropdownItem,
} from "mdb-react-ui-kit";
import "./App.css";

function App() {
  const [data, setData] = useState([]);
  const [value, setValue] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [filter, setFilter] = useState({ category: "", minPrice: 0, maxPrice: 100, ratings: 0 });
  const [sortBy, setSortBy] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const response = await axios.get("http://localhost:5000/mock_data");
      setData(response.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
  
    if (value.trim()) {
      const filteredData = data.filter((item) =>
        item.name.toLowerCase().startsWith(value.toLowerCase())
      );
      setData(filteredData);
    } else {
      loadUserData(); 
    }
  };

  const handleSuggestions = async (val) => {
    setValue(val);
    if (val.length > 1) {
      const response = await axios.get(`http://localhost:5000/mock_data?q=${val}`);
      setSuggestions(response.data.map((item) => item.name));
    } else {
      setSuggestions([]);
    }
  };

  const handleFilter = () => {
    let filteredData = [...data];
    filteredData = filteredData.filter(
      (item) =>
        item.price.replace("$", "") >= filter.minPrice &&
        item.price.replace("$", "") <= filter.maxPrice &&
        item.ratings >= filter.ratings &&
        (filter.category ? item.category.includes(filter.category) : true)
    );
    setData(filteredData);
  };

  const handleSort = (key) => {
    const sortedData = [...data].sort((a, b) =>
      key === "price"
        ? parseFloat(a.price.replace("$", "")) - parseFloat(b.price.replace("$", ""))
        : b[key] - a[key]
    );
    setSortBy(key);
    setData(sortedData);
  };

  const handlePagination = (page) => setCurrentPage(page);

  const currentData = data.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <MDBContainer>
      <form
        style={{
          margin: "auto",
          padding: "15px",
          maxWidth: "400px",
          alignContent: "center",
        }}
        className="d-flex input-group w-auto"
        onSubmit={handleSearch}
      >
        <MDBInput
          type="text"
          className="form-control"
          placeholder="Search"
          value={value}
          onChange={(e) => handleSuggestions(e.target.value)}
          list="suggestions"
        />
        <datalist id="suggestions">
          {suggestions.map((item, index) => (
            <option key={index} value={item} />
          ))}
        </datalist>
        <MDBBtn type="submit" color="dark">
          Search
        </MDBBtn>
        <MDBBtn className="mx-2" color="info" onClick={() => loadUserData()}>
          Reset
        </MDBBtn>
      </form>

      <MDBRow>
        <MDBCol size="3">
          <h5>Filters</h5>
          <MDBInput
            label="Min Price"
            type="number"
            style={{margin: "10px"}}
            value={filter.minPrice}
            onChange={(e) => setFilter({ ...filter, minPrice: e.target.value })}
          />
          <MDBInput
            label="Max Price"
            style={{margin: "10px"}}
            type="number"
            value={filter.maxPrice}
            onChange={(e) => setFilter({ ...filter, maxPrice: e.target.value })}
          />
          <MDBInput
            label="Ratings (min)"
            type="number"
            style={{margin: "10px"}}
            value={filter.ratings}
            onChange={(e) => setFilter({ ...filter, ratings: e.target.value })}
          />
          <MDBDropdown>
            <MDBDropdownToggle caret color="primary">
              Category
            </MDBDropdownToggle>
            <MDBDropdownMenu>
              <MDBDropdownItem onClick={() => setFilter({ ...filter, category: "Electronics" })}>
                Electronics
              </MDBDropdownItem>
              <MDBDropdownItem onClick={() => setFilter({ ...filter, category: "Fashion" })}>
                Fashion
              </MDBDropdownItem>
              <MDBDropdownItem onClick={() => setFilter({ ...filter, category: "" })}>
                All
              </MDBDropdownItem>
            </MDBDropdownMenu>
          </MDBDropdown>
          <MDBBtn color="secondary" onClick={handleFilter}>
            Apply Filters
          </MDBBtn>
        </MDBCol>

        <MDBCol size="9">
          <h5>Sort By</h5>
          <MDBBtnGroup>
            <MDBBtn color={sortBy === "price" ? "primary" : "secondary"} onClick={() => handleSort("price")}>
              Price
            </MDBBtn>
            <MDBBtn color={sortBy === "popularity" ? "primary" : "secondary"} onClick={() => handleSort("popularity")}>
              Popularity
            </MDBBtn>
          </MDBBtnGroup>
          <MDBTable>
            <MDBTableHead dark>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Popularity</th>
                <th>Price</th>
                <th>Category</th>
                <th>Ratings</th>
              </tr>
            </MDBTableHead>
            <MDBTableBody>
              {currentData.map((item, index) => (
                <tr key={item.id}>
                  <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                  <td>{item.name}</td>
                  <td>{item.popularity}</td>
                  <td>{item.price}</td>
                  <td>{item.category}</td>
                  <td>{item.ratings}</td>
                </tr>
              ))}
            </MDBTableBody>
          </MDBTable>
          <MDBPagination>
            {[...Array(Math.ceil(data.length / itemsPerPage)).keys()].map((page) => (
              <MDBPaginationItem key={page} active={currentPage === page + 1}>
                <MDBPaginationLink onClick={() => handlePagination(page + 1)}>
                  {page + 1}
                </MDBPaginationLink>
              </MDBPaginationItem>
            ))}
          </MDBPagination>
        </MDBCol>
      </MDBRow>
    </MDBContainer>
  );
}

export default App;

import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../firebase/Auth";
import { createToken } from "../firebase/AuthBackend";

import {
  Container,
  Fab,
  Button,
  Chip,
  ToggleButton,
  ToggleButtonGroup,
  useTheme,
  FormControl,
  MenuItem,
  Select,
  InputLabel,
} from "@mui/material";
import ItemList from "./ItemList";
import CreateListing from "./CreateListing";
import Add from "@mui/icons-material/Add";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import SortIcon from "@mui/icons-material/Sort";
import Searchbar from "./Searchbar";
import Draggable from "react-draggable";

const ListingsPage = (props) => {
  const theme = useTheme();

  const page = parseInt(props.match.params.page);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [last, setLast] = useState(null);
  const [searching, setSearching] = useState(false);
  const [filter, setFilter] = useState("");
  const [sortedBy, setSortedBy] = useState("Latest");
  const [dragging, setDragging] = useState(false);
  const { currentUser } = useContext(AuthContext);

  const prevPage = () => {
    props.history.push(`/items/${page - 1}`);
  };
  const nextPage = () => {
    props.history.push(`/items/${page + 1}`);
  };

  const fetchListings = async () => {
    try {
      const header = await createToken();
      let query;
      if (sortedBy === "Latest") {
        if (!filter) {
          query = await axios.get(
            `http://localhost:4000/items?offset=${page * 20}`,
            header
          );
        } else {
          query = await axios.get(
            `http://localhost:4000/items?offset=${
              page * 20
            }&filter=${filter}`,
            header
          );
        }
      } else {
        if (!filter) {
          query = await axios.get(
            `http://localhost:4000/items?offset=${page * 20}&latest=false`,
            header
          );
        } else {
          query = await axios.get(
            `http://localhost:4000/items?offset=${
              page * 20
            }&filter=${filter}&latest=false`,
            header
          );
        }
      }
      const { data } = query;
      console.log(data);
      setItems(data);
      setLoading(false);
    } catch (e) {
      setError(e);
      setLoading(false);
    }
    // Check if the next page has items
    try {
      const header = await createToken();
      let query;
      if (sortedBy === "Latest") {
        if (!filter) {
          query = await axios.get(
            `http://localhost:4000/items?offset=${(page + 1) * 20}`,
            header
          );
        } else {
          query = await axios.get(
            `http://localhost:4000/items?offset=${
              (page + 1) * 20
            }&filter=${filter}`,
            header
          );
        }
      } else {
        if (!filter) {
          query = await axios.get(
            `http://localhost:4000/items?offset=${
              (page + 1) * 20
            }&latest=false`,
            header
          );
        } else {
          query = await axios.get(
            `http://localhost:4000/items?offset=${
              (page + 1) * 20
            }&filter=${filter}&latest=false`,
            header
          );
        }
      }
      const { data } = query;
      if (data.length === 0) {
        setLast(page);
      }
    } catch (e) {
      if (e) {
        setLast(page);
      }
    }
  };

  // Get item
  useEffect(() => {
    console.log(`Loading Page ${page}...`);
    setLoading(true);
    fetchListings();
  }, [page, props.history, props.match.params.page, filter, sortedBy]);

  const [formOpen, setFormOpen] = useState(false);

  const handleFormOpen = () => {
    setFormOpen(true);
  };

  const handleFormClose = () => {
    setFormOpen(false);
  };

  const search = async () => {
    setLoading(true);
    console.log("Searching...");
    let searchTerm = document.getElementById("search").value.trim();
    if (searchTerm.trim() !== "") {
      setSearching(searchTerm);
      console.log("here");
      try {
        const header = await createToken();

        const { data } = await axios.get(
          `http://localhost:4000/items/search/${searchTerm}`,
          header
        );
        console.log(data);
        setItems(data);
        setLoading(false);
      } catch (e) {
        setError(e);
        setLoading(false);
      }
    } else {
      setSearching(false);
      try {
        const header = await createToken();

        const { data } = await axios.get(
          `http://localhost:4000/items?offset=${page * 20}`,
          header
        );
        console.log(data);
        setItems(data);
        setLoading(false);
      } catch (e) {
        setError(e);
        setLoading(false);
      }

      // Check if the next page has items
      try {
        const header = await createToken();

        const { data } = await axios.get(
          `http://localhost:4000/items?offset=${(page + 1) * 20}`,
          header
        );
        if (data.length === 0) {
          setLast(page);
        }
      } catch (e) {
        setLast(page);
      }
    }
  };

  const handleFilter = (e, newFilter) => {
    props.history.push(`/items/0`);
    setLast(null);
    setFilter(newFilter);
    console.log(newFilter);
  };

  const handleSortedBy = (e) => {
    setSortedBy(e.target.value);
  };

  const handleSearchDelete = async () => {
    setLoading(true);
    setSearching(false);
    fetchListings();
  };

  return (
    <Container style={{ maxWidth: "100%" }}>
      {!searching && (
        <div style={{ width: "fit-content", margin: "1em auto" }}>
          {page > 0 ? (
            <Button onClick={() => prevPage()}>Previous</Button>
          ) : (
            <Button disabled>Previous</Button>
          )}
          <Chip style={{ margin: "0 1em" }} label={page} />
          {!searching && page !== last ? (
            <Button onClick={() => nextPage()}>Next</Button>
          ) : (
            <Button disabled>Next</Button>
          )}
        </div>
      )}
      <Searchbar search={search} />
      {searching && (
        <div style={{ width: "fit-content", margin: "1.5em auto" }}>
          <Chip
            label={`Search Term: ${searching}`}
            color="primary"
            variant="outlined"
            onDelete={handleSearchDelete}
          />
        </div>
      )}
      {!searching && (
        <div style={{ width: "fit-content", margin: "0 auto 1.5em auto" }}>
          <small
            style={{ marginRight: "1em", color: theme.palette.primary.main }}
          >
            <FilterAltIcon
              style={{
                width: "18px",
                height: "18px",
                position: "relative",
                bottom: "2px",
              }}
            />{" "}
            FILTERS:
          </small>
          <ToggleButtonGroup
            color="primary"
            size="small"
            aria-label="filters"
            exclusive
            value={filter}
            onChange={handleFilter}
          >
            <ToggleButton value="Furniture" aria-label="furniture">
              Furniture
            </ToggleButton>
            <ToggleButton value="Electronics" aria-label="electronics">
              Electronics
            </ToggleButton>
            <ToggleButton value="Art" aria-label="art">
              Art
            </ToggleButton>
            <ToggleButton value="Entertainment" aria-label="entertainment">
              Entertainment
            </ToggleButton>
            <ToggleButton value="Clothing" aria-label="clothing">
              Clothing
            </ToggleButton>
            <ToggleButton value="Other" aria-label="other">
              Other
            </ToggleButton>
          </ToggleButtonGroup>
          <FormControl
            variant="standard"
            sx={{
              minWidth: 120,
              position: "relative",
              bottom: "0.2em",
              marginLeft: "1em",
            }}
          >
            <InputLabel id="sorted_by_label" sx={{ fontSize: 14 }}>
              <small style={{ color: theme.palette.primary.main }}>
                <SortIcon
                  style={{
                    width: "18px",
                    height: "18px",
                    position: "relative",
                    bottom: "2px",
                  }}
                />{" "}
                SORTED BY:
              </small>
            </InputLabel>
            <Select
              labelId="sorted_by_label"
              id="sorted_by"
              value={sortedBy}
              onChange={handleSortedBy}
              size="small"
              sx={{ fontSize: 14 }}
            >
              <MenuItem value={"Latest"}>LATEST</MenuItem>
              <MenuItem value={"Oldest"}>OLDEST</MenuItem>
            </Select>
          </FormControl>
        </div>
      )}
      <ItemList items={items} loading={loading} />
      <CreateListing
        formOpen={formOpen}
        handleFormClose={handleFormClose}
        history={props.history}
      />
      {/*https://github.com/react-grid-layout/react-draggable/issues/49*/}
      {currentUser && (
        <Draggable
          onDrag={() => {
            setDragging(true);
          }}
          onStop={() => {
            if (!dragging) {
              handleFormOpen();
            }
            setDragging(false);
          }}
        >
          <Fab
            color="primary"
            variant="extended"
            aria-label="create-post"
            style={{ position: "fixed", right: "5em", bottom: "3em" }}
            onClick={() => {}}
          >
            <Add sx={{ mr: 1 }} />
            Create Listing
          </Fab>
        </Draggable>
      )}
    </Container>
  );
};

export default ListingsPage;

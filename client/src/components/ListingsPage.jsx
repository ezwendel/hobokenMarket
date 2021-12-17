import React, { useState, useEffect } from "react";
import axios from "axios";

import {
  Container,
  Fab,
  Button,
  Chip,
  ToggleButton,
  ToggleButtonGroup,
  useTheme
} from "@mui/material";
import ItemList from "./ItemList";
import CreateListing from "./CreateListing";
import Add from "@mui/icons-material/Add";
import Searchbar from "./Searchbar";

const ListingsPage = (props) => {
  const theme = useTheme();

  const page = parseInt(props.match.params.page);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [last, setLast] = useState(null);
  const [searching, setSearching] = useState(false);
  const [filters, setFilters] = useState(() => [])

  const prevPage = () => {
    props.history.push(`/items/${page - 1}`);
  };
  const nextPage = () => {
    props.history.push(`/items/${page + 1}`);
  };

  // Get item
  useEffect(() => {
    console.log(`Loading Page ${page}...`);
    const fetchData = async () => {
      try {
        const { data } = await axios.get(
          `http://localhost:4000/items?offset=${page * 20}`
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
        const { data } = await axios.get(
          `http://localhost:4000/items?offset=${(page + 1) * 20}`
        );
        if (data.length === 0) {
          setLast(page);
        }
      } catch (e) {
        if (e.response.status === 404) {
          setLast(page);
        }
      }
    };
    setLoading(true);
    fetchData();
  }, [page, props.history, props.match.params.page]);

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
      setSearching(true);
      console.log("here");
      try {
        const { data } = await axios.get(
          `http://localhost:4000/items/search/${searchTerm}`
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
        const { data } = await axios.get(
          `http://localhost:4000/items?offset=${page * 20}`
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
        const { data } = await axios.get(
          `http://localhost:4000/items?offset=${(page + 1) * 20}`
        );
        if (data.length === 0) {
          setLast(page);
        }
      } catch (e) {
        if (e.response.status === 404) {
          setLast(page);
        }
      }
    }
  };

  const handleFilters = (e, newFilters) => {
    setFilters(newFilters);
    console.log(newFilters);
  }

  if (loading) {
    return (
      <Container maxWidth="100%">
        <div style={{ margin: "0 auto", width: "fit-content" }}>Loading...</div>
      </Container>
    );
  }
  return (
    <Container maxWidth="100%">
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
      <div style={{ width: "fit-content", margin: "0 auto 1.5em auto" }}>
        <small style={{ marginRight: "1em", color: theme.palette.primary.main,}}>FILTERS:</small>
        <ToggleButtonGroup color="primary" size="small" aria-label="filters" value={filters} onChange={handleFilters}>
          <ToggleButton value="furniture" aria-label="furniture">
            Furniture
          </ToggleButton>
          <ToggleButton value="electronics" aria-label="electronics">
            Electronics
          </ToggleButton>
          <ToggleButton value="art" aria-label="art">
            Art
          </ToggleButton>
          <ToggleButton value="entertainment" aria-label="entertainment">
            Entertainment
          </ToggleButton>
          <ToggleButton value="clothing" aria-label="clothing">
            Clothing
          </ToggleButton>
          <ToggleButton value="other" aria-label="other">
            Other
          </ToggleButton>
        </ToggleButtonGroup>
      </div>
      <ItemList items={items} />
      <CreateListing formOpen={formOpen} handleFormClose={handleFormClose} />
      <Fab
        color="primary"
        variant="extended"
        aria-label="create-post"
        style={{ position: "fixed", right: "5em", bottom: "3em" }}
        onClick={() => handleFormOpen()}
      >
        <Add sx={{ mr: 1 }} />
        Create Listing
      </Fab>
    </Container>
  );
};

export default ListingsPage;

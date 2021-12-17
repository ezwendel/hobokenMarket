import React, { useState, useEffect } from "react";
import axios from "axios";

import {
  Container,
  Fab,
  Button,
  Chip,
  ToggleButton,
  ToggleButtonGroup,
  useTheme,
} from "@mui/material";
import ItemList from "./ItemList";
import CreateListing from "./CreateListing";
import Add from "@mui/icons-material/Add";
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
  const [dragging, setDragging] = useState(false);

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
        const { data } = !filter
          ? await axios.get(`http://localhost:4000/items?offset=${page * 20}`)
          : await axios.get(
              `http://localhost:4000/items?offset=${page * 20}&filter=${filter}`
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
        const { data } = !filter
          ? await axios.get(
              `http://localhost:4000/items?offset=${(page + 1) * 20}`
            )
          : await axios.get(
              `http://localhost:4000/items?offset=${
                (page + 1) * 20
              }&filter=${filter}`
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
  }, [page, props.history, props.match.params.page, filter]);

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
        setLast(page);
      }
    }
  };

  const handleFilter = (e, newFilter) => {
    setFilter(newFilter);
    console.log(newFilter);
  };

  const handleDelete = async () => {
    setLoading(true);
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
      setLast(page);
    }
  };

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
      {searching && (
        <div style={{ width: "fit-content", margin: "1.5em auto" }}>
          <Chip
            label={`Search Term: ${searching}`}
            color="primary"
            variant="outlined"
            onDelete={handleDelete}
          />
        </div>
      )}
      {!searching && (
        <div style={{ width: "fit-content", margin: "0 auto 1.5em auto" }}>
          <small
            style={{ marginRight: "1em", color: theme.palette.primary.main }}
          >
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
        </div>
      )}
      <ItemList items={items} />
      <CreateListing formOpen={formOpen} handleFormClose={handleFormClose} />
      <Draggable
        onDrag={() => {
          setDragging(true);
        }}
        onStop={() => {
          if (!dragging) {
            handleFormOpen()
          }
          setDragging(false);
        }}
      >
        <Fab
          color="primary"
          variant="extended"
          aria-label="create-post"
          style={{ position: "fixed", right: "5em", bottom: "3em" }}
          onClick={() => {
            
          }}
        >
          <Add sx={{ mr: 1 }} />
          Create Listing
        </Fab>
      </Draggable>
    </Container>
  );
};

export default ListingsPage;

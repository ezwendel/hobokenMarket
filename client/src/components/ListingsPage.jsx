import React, { useState, useEffect } from "react";
import axios from "axios";

import { Container, Fab, Button, Chip } from "@mui/material";
import ItemList from "./ItemList";
import CreateListing from "./CreateListing";
import Add from "@mui/icons-material/Add";
import Searchbar from "./Searchbar";

import { useLocation, Link } from "react-router";

const ListingsPage = (props) => {
  const page = parseInt(props.match.params.page);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [last, setLast] = useState(null);

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
        const { data } = await axios.get(`http://localhost:4000/items?offset=${(page + 1) * 20}`);
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

  if (loading) {
    return (
      <Container maxWidth="100%">
        <div style={{ margin: "0 auto", width: "fit-content" }}>Loading...</div>
      </Container>
    );
  }
  return (
    <Container maxWidth="100%">
      <div style={{ width: "fit-content", margin: "1em auto" }}>
        {page > 0 ? (
          <Button onClick={() => prevPage()}>
            Previous
          </Button>
        ) : (
          <Button disabled>
            Previous
          </Button>
        )}
        <Chip style={{ margin: "0 1em"}}label={page} />
        {page !== last ? (
          <Button onClick={() => nextPage()}>
            Next
          </Button>
        ) : (
          <Button disabled>
            Next
          </Button>
        )}
      </div>
      <div style={{width: "40em", margin: "0 auto 1.5em auto"}}>
        <Searchbar />
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

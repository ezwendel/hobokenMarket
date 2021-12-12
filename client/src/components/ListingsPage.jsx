import React, { useState, useEffect } from "react";
import axios from "axios";

import { Container, Fab } from "@mui/material";
import ItemList from "./ItemList";
import CreateListing from "./CreateListing";
import Add from "@mui/icons-material/Add";

const ListingsPage = (props) => {
  const page = parseInt(props.match.params.page);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

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
        <div style={{ margin: "0 auto", width: "fit-content" }}>
          Loading...
        </div>
      </Container>
    );
  }
  return (
    <Container maxWidth="100%">
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

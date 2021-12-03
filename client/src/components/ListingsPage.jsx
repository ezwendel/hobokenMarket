import React, { useState } from "react";

import {
  Container,
  Fab
} from "@mui/material";
import ItemList from "./ItemList";
import CreateListing from "./CreateListing";
import Add from "@mui/icons-material/Add";

const ListingsPage = ({ items }) => {
  const [formOpen, setFormOpen] = useState(false);

  const handleFormOpen = () => {
    setFormOpen(true);
  };

  const handleFormClose = () => {
    setFormOpen(false);
  };

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

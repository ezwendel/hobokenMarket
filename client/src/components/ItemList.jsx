import React from "react";

import Item from "./Item";
import { Container, Grid, Typography } from "@mui/material";
import LinearProgress from "@mui/material/LinearProgress";

const ItemList = ({ items, loading }) => {
  if (loading) {
    return (
      <Container maxWidth="100%">
        <div style={{ textAlign: "center", margin: "0 auto", maxWidth: "750px", width: "75%" }}>
          <Typography mb="1em" variant="p" component="div">
            Loading...
          </Typography>
          <LinearProgress />
        </div>
      </Container>
    );
  }
  return items.length > 0 ? (
    <Grid container spacing={2} alignItems="center">
      {items.map((item) => (
        <Grid key={item._id} item xs={12} sm={6} md={4} lg={3} xl={3}>
          <Item item={item} />
        </Grid>
      ))}
    </Grid>
  ) : (
    <div style={{ margin: "0 auto", width: "fit-content" }}>
      404: No listings found.
    </div>
  );
};

export default ItemList;

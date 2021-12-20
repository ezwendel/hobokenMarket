import React from "react";

import Item from "./Item";
import { Container, Grid, Typography } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import Loading from "./Loading";

const ItemList = ({ items, loading }) => {
  if (loading) {
    return (
      <Loading />
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
      404 Error: No listings found.
    </div>
  );
};

export default ItemList;

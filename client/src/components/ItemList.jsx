import React from "react";

import Item from "./Item";
import { Grid } from "@mui/material";

const ItemList = ({ items }) => {
  return items.length > 0 ? (
    <Grid container spacing={2} alignItems="center" justifyContent="center">
      {items.map((item) => (
        <Grid key={item._id} item xs={12} sm={6} md={4} lg={3} xl={3}>
          <Item item={item} />
        </Grid>
      ))}
    </Grid>
  ) : (
    <div style={{ margin: "0 auto", width: "fit-content" }}>No listings found.</div>
  );
};

export default ItemList;

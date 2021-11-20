import React from "react";

import Item from "./Item";
import { Grid } from "@mui/material";

const ItemList = ({ items }) => {
  return items ? (
    <Grid container spacing={2} alignItems="center" justifyContent="center">
      {items.map((item) => (
        <Grid item xs={7} sm={6} md={5} lg={4} xl={3}>
          <Item />
        </Grid>
      ))}
    </Grid>
  ) : (
    <div style={{ margin: "0 auto" }}>No listings found.</div>
  );
};

export default ItemList;

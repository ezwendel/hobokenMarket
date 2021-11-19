import React from "react";

import {
  Card,
  CardHeader,
  CardMedia,
  CardContent,
  CardActions,
  Avatar,
  Button,
  Typography,
} from "@mui/material";

import Placeholder from "../img/default.png";

const Item = () => {
  return (
    <Card sx={{ maxWidth: 350, maxHeight: 450, minHeght: 450 }}>
      <CardHeader
        avatar={<Avatar sx={{ bgcolor: "#EB5757" }}>A</Avatar>}
        title="Item Name"
        subheader="January 1, 2021"
      />
      <CardMedia component="img" height="194" image={Placeholder} />
      <CardContent>
          <Typography variant="body1" color="text.secondary" component="div" fontSize="14px">
            Item description.
          </Typography>
      </CardContent>
      <CardActions>
          <Button color="secondary" size="small">CONTACT</Button>
          <Button color="secondary" size="small">MORE INFO</Button>
      </CardActions>
    </Card>
  );
};

export default Item;

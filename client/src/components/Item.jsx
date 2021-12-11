import React from "react";
import { makeStyles } from "@mui/styles";
import { useTheme } from "@mui/material/styles";

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

import { Link } from "react-router-dom";

import Placeholder from "../img/default.png";

const Item = () => {
  const theme = useTheme();
  const useStyles = makeStyles(() => ({
    title: {
      fontWeight: "bold",
      color: "#444"
    },
  }));
  const classes = useStyles();

  return (
    <Card sx={{ minWidth: 250, maxHeight: 450, height: "fit-content" }}>
      <CardHeader
        avatar={<Avatar sx={{ bgcolor: "#EB5757" }}>A</Avatar>}
        title="Item Name"
        subheader="January 1, 2021"
        classes={{ title: classes.title }}
      />
      <CardMedia component="img" height="194" image={Placeholder} />
      <CardContent>
        <Typography
          variant="body1"
          color="text.secondary"
          component="div"
          fontSize="14px"
        >
          Item description.
        </Typography>
      </CardContent>
      <CardActions>
        <Link style={{ color: "inherit", textDecoration: "none" }}>
          <Button color="secondary" size="small">
            CONTACT
          </Button>
        </Link>
        <Link
          to="/items/0"
          style={{ color: "inherit", textDecoration: "none" }}
        >
          <Button color="secondary" size="small">
            MORE INFO
          </Button>
        </Link>
      </CardActions>
    </Card>
  );
};

export default Item;

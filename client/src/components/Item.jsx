import React, { useState, useEffect } from "react";
import { makeStyles } from "@mui/styles";
import axios from "axios";

import {
  Card,
  CardHeader,
  CardMedia,
  CardContent,
  CardActions,
  Avatar,
  Button,
  Typography,
  Tooltip,
  Chip,
} from "@mui/material";

import { Link } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";

import Placeholder from "../img/default.png";

const Item = ({ item }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Get item
  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(
          `http://localhost:4000/user/${item.sellerId}`
        );
        setUser(data);
      } catch (e) {
        setUser({ username: "?" });
      }
      setLoading(false);
    };
    setLoading(true);
    fetchData();
  }, []);

  const useStyles = makeStyles(() => ({
    title: {
      fontWeight: "bold",
      color: "#444",
    },
  }));
  const classes = useStyles();

  if (loading) {
    return (
      <Card sx={{ minWidth: 250, height: 500 }}>
        <CardContent
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "5em 0",
          }}
        >
          <CircularProgress />
        </CardContent>
      </Card>
    );
  }
  return (
    <Card sx={{ minWidth: 250, height: 500 }}>
      <CardHeader
        avatar={
          <Link to={`/user/${user._id}`}>
            <Tooltip title={user.username}>
              <Avatar sx={{ bgcolor: "#EB5757" }}>
                {user.username.charAt(0).toUpperCase()}
              </Avatar>
            </Tooltip>
          </Link>
        }
        title={item.name}
        subheader={new Date(item.listDate).toLocaleDateString("en-US", {
          month: "long",
          day: "numeric",
          year: "numeric",
        })}
        classes={{ title: classes.title }}
      />
      <CardMedia
        component="img"
        height="194"
        image={
          item.itemPictures !== null
            ? `http://localhost:4000/file/${item.itemPictures[0]}`
            : Placeholder
        }
        onError={(e) => {
          e.target.src = Placeholder;
        }}
      />
      <div style={{ padding: "1em 1em 0 1em" }}>
        <ul className="category-list">
          {item.categories.map((category) => (
            <li>
              <Chip
                label={category}
                size="small"
                color="primary"
                variant="outlined"
              />
            </li>
          ))}
        </ul>
      </div>
      <CardContent>
        <Typography
          variant="body1"
          color="text.secondary"
          component="div"
          fontSize="14px"
          height="100px"
          width="fit-content"
          style={{
            overflowY: "scroll",
          }}
          className="description"
        >
          {item.description}
        </Typography>
      </CardContent>
      <CardActions>
        <Button color="secondary" size="small" component={Link}>
          CONTACT
        </Button>
        <Button
          color="secondary"
          size="small"
          component={Link}
          to={`/item/${item._id}`}
        >
          MORE INFO
        </Button>
      </CardActions>
    </Card>
  );
};

export default Item;

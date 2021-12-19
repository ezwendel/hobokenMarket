import React, { useState, useEffect } from "react";
import { makeStyles } from "@mui/styles";
import axios from "axios";
import { createToken } from "../firebase/AuthBackend";

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
  Box,
} from "@mui/material";

import { Link } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import Skeleton from "@mui/material/Skeleton";

import Placeholder from "../img/default.png";

const Item = ({ item }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Get item
  useEffect(() => {
    const fetchData = async () => {
      try {

        const header = await createToken();

        const { data } = await axios.get(
          `http://localhost:4000/user/${item.sellerId}`, header
        );
        setUser(data);
      } catch (e) {
        setUser({ username: "?" });
        setError(e);
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
      <Card sx={{ minWidth: 250, height: 600 }}>
        <CardHeader
          avatar={
            <Skeleton
              animation="wave"
              variant="circular"
              width={40}
              height={40}
            />
          }
          title={
            <Skeleton
              animation="wave"
              height={10}
              width="80%"
              style={{ marginBottom: 6 }}
            />
          }
          subheader={<Skeleton animation="wave" height={10} width="40%" />}
        />
        <Skeleton sx={{ height: 300 }} animation="wave" variant="rectangular" />
        <CardContent
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Box width="100%">
            <Skeleton animation="wave" variant="text" width={80} height={35} sx={{marginBottom: "1em"}} />
            <Skeleton
              animation="wave"
              height={10}
              width="100%"
              style={{ marginBottom: 6 }}
            />
            <Skeleton
              animation="wave"
              height={10}
              width="100%"
              style={{ marginBottom: 6 }}
            />
            <Skeleton animation="wave" height={10} width="80%" />
          </Box>
        </CardContent>
      </Card>
    );
  }
  if (error) {
    return (
      <Card sx={{ minWidth: 250, height: 600 }}>
        <CardContent
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "5em 0",
          }}
        >
          {error.toString()}
        </CardContent>
      </Card>
    );
  }
  let avatarInternals = null;
  if (user.profilePicture) {
    avatarInternals = (
      <Link to={`/user/${user._id}`} className="item-avatar-link">
        <Tooltip title={user.username}>
          <Avatar
            alt={`${user.name.firstName} ${user.name.lastName}`}
            src={`http://localhost:4000/file/${user.profilePicture}`}
          />
        </Tooltip>
      </Link>
    );
  } else {
    avatarInternals = (
      <Link to={`/user/${user._id}`} className="item-avatar-link">
        <Tooltip title={user.username}>
          <Avatar sx={{ bgcolor: "#EB5757" }}>
            {user.username[0].toUpperCase()}
          </Avatar>
        </Tooltip>
      </Link>
    );
  }

  return (
    <Card sx={{ minWidth: 250, height: 600 }}>
      <CardHeader
        avatar={avatarInternals}
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
        height="300"
        image={
          !item.itemPictures
            ? `http://localhost:4000/file/${item.itemPictures[0]}`
            : Placeholder
        }
        onError={(e) => {
          e.target.src = Placeholder;
        }}
        alt={`${item.name}-img`}
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

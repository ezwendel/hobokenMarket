import React, { useState, useEffect } from "react";
import { makeStyles } from "@mui/styles";
import { useTheme } from "@mui/material/styles";
import axios from "axios";

import {
  Container,
  Card,
  CardHeader,
  CardMedia,
  CardContent,
  Avatar,
  Typography,
  Table,
  Paper,
  TableContainer,
  TableBody,
  TableRow,
  TableCell,
  Divider,
  CardActions,
  Button,
  Tooltip,
  Chip,
} from "@mui/material";

import { Link } from "react-router-dom";

import Placeholder from "../img/default.png";
import Loading from "./Loading";

const ItemPage = (props) => {
  const id = props.match.params.id;
  const [item, setItem] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const theme = useTheme();

  // Get item
  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(`http://localhost:4000/items/${id}`);
        console.log(data);
        setItem(data);
      } catch (e) {
        setError(e);
        console.log(e);
      }
    };
    setLoading(true);
    fetchData();
  }, []);

  // Get user
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (item) {
          setError(false);
          const { data: data2 } = await axios.get(
            `http://localhost:4000/user/${item.sellerId}`
          );
          console.log(data2);
          setUser(data2);
        } else {
          setError("404: item not found")
        }
        setLoading(false);
      } catch (e) {
        setError(e);
        console.log(e);
      }
    };
    setLoading(true);
    fetchData();
  }, [item]);

  const useStyles = makeStyles(() => ({
    title: {
      fontWeight: "bold",
      color: "#444",
    },
  }));
  const classes = useStyles();

  if (loading) {
    return (
      <Loading />
    );
  }
  if (error) {
    return (
      <Container>
        <div style={{ margin: "0 auto", width: "fit-content" }}>{error.toString()}</div>
      </Container>
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
    <Container>
      <Card sx={{ minWidth: 250, maxWidth: "70%", margin: "0 auto" }}>
        <CardMedia
          component="img"
          image={
            !item.itemPictures
              ? `http://localhost:4000/file/${item.itemPictures[0]}`
              : Placeholder
          }
          onError={(e) => {
            e.target.src = Placeholder;
          }}
        />
        <CardHeader
          avatar={
            avatarInternals
          }
          title={item.name}
          subheader={new Date(item.listDate).toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
          })}
          classes={{ title: classes.title }}
        />
        <Divider />
        <div style={{ padding: "0.5em 1em" }}>
          <Typography
            className="category-label"
            style={{ display: "inline", fontWeight: 500, marginRight: "1em" }}
            component="small"
            fontSize={14}
          >
            Categories:
          </Typography>
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
          <div style={{ marginBottom: "1em" }}>
            <Typography gutterBottom variant="h6" component="div">
              Description
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              component="div"
              fontSize="14px"
              gutterBottom
            >
              {item.description}
            </Typography>
          </div>
          <div style={{ margin: "1em 0" }}>
            <Typography gutterBottom variant="h6" component="div">
              Contact Information
            </Typography>
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 500 }} aria-label="contact-info">
                <TableBody>
                  <TableRow>
                    <TableCell component="th" scope="row">
                      Name
                    </TableCell>
                    <TableCell style={{ width: 160 }} align="right">
                      {user.name !== null
                        ? `${user.name.firstName} ${user.name.lastName}`
                        : "N/A"}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell component="th" scope="row">
                      Cell Phone #:
                    </TableCell>
                    <TableCell style={{ width: 160 }} align="right">
                      {user.numbers && user.numbers.cell !== null
                        ? user.numbers.cell
                        : "N/A"}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell component="th" scope="row">
                      Home Phone #:
                    </TableCell>
                    <TableCell style={{ width: 160 }} align="right">
                      {user.numbers && user.numbers.home !== null
                        ? user.numbers.home
                        : "N/A"}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell component="th" scope="row">
                      Email Address:
                    </TableCell>
                    <TableCell style={{ width: 160 }} align="right">
                      {user.emailAddress !== null ? user.emailAddress : "N/A"}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        </CardContent>
        <CardActions>
          <Button
            color="secondary"
            size="small"
            component={Link}
            to={`/items/0`}
            sx={{margin: "0 auto"}}
          >
            BACK TO LISTINGS
          </Button>
        </CardActions>
      </Card>
    </Container>
  );
};

export default ItemPage;

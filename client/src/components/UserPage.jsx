import React, { useState, useEffect, useContext } from "react";
import { styled } from "@mui/styles";
import { makeStyles } from "@mui/styles";
import { useTheme } from "@mui/material/styles";
import axios from "axios";
import { createToken } from "../firebase/AuthBackend";
import { AuthContext } from "../firebase/Auth";

import {
  Container,
  Card,
  CardHeader,
  CardContent,
  Avatar,
  Typography,
  Button,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Chip,
  ListItem,
  Rating,
  Box,
  Tooltip,
} from "@mui/material";
import { Link } from "react-router-dom";

import MessageIcon from "@mui/icons-material/Message";
import ShoppingBasketIcon from "@mui/icons-material/ShoppingBasket";
import Loading from "./Loading";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import RatingForm from "./RatingForm";

const Label = styled("span")(({ theme }) => ({
  fontWeight: 500,
}));

const StyledRating = styled(Rating)({
  "& .MuiRating-iconFilled": {
    color: "#1a6ad6",
  },
  "& .MuiRating-iconHover": {
    color: "#1a6ad6",
  },
});

const ItemListing = (item) => {
  // console.log(item);
  return (
    <>
      <ListItem key={item._id} sx={{ padding: 0 }}>
        {/* <Link to={`/items/${item._id}`} style={{ color: "inherit", textDecoration: "none" }}> */}
        <ListItemButton
          component={Link}
          to={`/item/${item._id}`}
          style={{ color: "inherit", textDecoration: "none" }}
        >
          <ListItemIcon>
            <ShoppingBasketIcon />
          </ListItemIcon>
          <ListItemText
            primary={item.name}
            secondary={
              <div>
                <div style={{ marginTop: ".5em" }}>
                  <ul className="category-list">
                    {item.categories.map((category) => {
                      return (
                        <li key={category}>
                          <Chip
                            label={category}
                            size="small"
                            color="primary"
                            variant="outlined"
                          />
                        </li>
                      );
                    })}
                  </ul>
                </div>
                <div style={{ marginTop: ".5em" }}>{item.description}</div>
              </div>
            }
            secondaryTypographyProps={{ component: "div" }}
          />
        </ListItemButton>
        {/* </Link> */}
      </ListItem>
    </>
  );
};

const ItemPage = (props) => {
  const theme = useTheme();
  const useStyles = makeStyles(() => ({
    title: {
      fontWeight: "bold",
      color: "#444",
    },
  }));
  const classes = useStyles();
  const [loading, setLoading] = useState(true);
  const [user, setUserData] = useState(undefined);
  const [items, setItemData] = useState(undefined);
  const [errorHappened, setError] = useState(undefined);
  const [formOpen, setFormOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const { currentUser } = useContext(AuthContext);

  const handleFormOpen = () => {
    setFormOpen(true);
  };

  const handleFormClose = () => {
    setFormOpen(false);
  };

  useEffect(() => {
    // console.log("useEffect fired");
    async function fetchData() {
      try {
        const header = await createToken();

        const { data } = await axios.get(
          `http://localhost:4000/user/${props.match.params.id}`,
          header
        );
        const itemData = await Promise.all(
          data.items.map(async (itemId) => {
            let item = await axios.get(
              `http://localhost:4000/items/${itemId}`,
              header
            );
            return item.data;
          })
        );
        let total_rating = 0;
        for (const r of data.ratings) {
          total_rating += r.rating;
        }
        let avg_rating =
          data.ratings.length > 0 ? total_rating / data.ratings.length : 0;
        // console.log(data);
        setUserData(data);
        setItemData(itemData);
        setRating(avg_rating);
        setError(undefined);
        setLoading(false);
      } catch (e) {
        setError(e);
        console.log(e);
        setLoading(false);
      }
    }
    fetchData();
  }, [props.match.params.id]);

  if (loading) {
    return <Loading />;
  } else if (errorHappened) {
    return (
      <Container>
        <div style={{ margin: "0 auto", width: "fit-content" }}>
          {errorHappened.toString()}
        </div>
      </Container>
    );
  } else {
    // let itemListings = null;
    let itemListings = items.map((item) => {
      return ItemListing(item);
    });

    let avatarInternals = null;
    if (user.profilePicture) {
      avatarInternals = (
        <Avatar
          alt={`${user.name.firstName} ${user.name.lastName}`}
          src={`http://localhost:4000/file/${user.profilePicture}`}
          sx={{ width: 75, height: 75 }}
        />
      );
    } else {
      avatarInternals = (
        <Avatar
          sx={{ bgcolor: "#EB5757", width: 75, height: 75, fontSize: 34 }}
        >
          {user.username[0].toUpperCase()}
        </Avatar>
      );
    }

    return (
      <Container>
        <Card sx={{ minWidth: 250, maxWidth: "70%", margin: "0 auto" }}>
          <CardHeader
            avatar={avatarInternals}
            title={user.username}
            subheader={
              <>
                <div>
                  Member since:{" "}
                  {new Date(user.joinDate).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </div>
                <Box
                  sx={{
                    display: "inline-block",
                    position: "relative",
                    bottom: "6px",
                    fontSize: "14px",
                    marginRight: "0.5em",
                  }}
                >
                  Rating:
                </Box>
                <StyledRating
                  name="seller-rating"
                  value={rating}
                  readOnly
                  precision={0.5}
                  sx={{ m: "3px", position: "relative", left: "-6px" }}
                />
                <Chip
                  sx={{
                    position: "relative",
                    bottom: "6px",
                  }}
                  label={user.ratings.length}
                  size="small"
                  color="secondary"
                  variant="outlined"
                />
              </>
            }
            action={
              currentUser ? (
                <div style={{ textAlign: "right" }}>
                  <Button
                    aria-label="message"
                    color="secondary"
                    sx={{ display: "block" }}
                  >
                    Send a Message
                    <MessageIcon style={{ marginLeft: ".3em" }} />
                  </Button>
                  <Button
                    aria-label="message"
                    color="secondary"
                    onClick={handleFormOpen}
                  >
                    Rate this User
                    <StarBorderIcon
                      style={{
                        marginLeft: ".3em",
                        position: "relative",
                        bottom: "1px",
                      }}
                    />
                  </Button>
                </div>
              ) : null
            }
            subheaderTypographyProps={{ component: "div" }}
            classes={{ title: classes.title }}
          />
          <Divider />
          <CardContent>
            <div style={{ margin: "1em 0" }}>
              <Typography gutterBottom variant="h6" component="div">
                Contact Information
              </Typography>
              <Typography gutterBottom variant="div" component="div">
                <Label>Full Name:</Label>{" "}
                {`${user.name.firstName} ${user.name.lastName}`}
              </Typography>
              <Typography gutterBottom variant="div" component="div">
                <Label>Cell Phone #:</Label>{" "}
                {user.numbers && user.numbers.cell !== null
                  ? user.numbers.cell
                  : "N/A"}
              </Typography>
              <Typography gutterBottom variant="div" component="div">
                <Label>Home Phone #:</Label>{" "}
                {user.numbers && user.numbers.home !== null
                  ? user.numbers.home
                  : "N/A"}
              </Typography>
              <Typography gutterBottom variant="div" component="div">
                <Label>Email Address:</Label> {user.emailAddress}
              </Typography>
            </div>
            <div style={{ margin: "1em 0" }}>
              <Typography variant="h6" component="div">
                Listed Items
              </Typography>
              <div>
                {user.items.length > 0 ? (
                  <List sx={{ width: "100%" }}>{itemListings}</List>
                ) : (
                  "No items listed."
                )}
              </div>
            </div>
          </CardContent>
        </Card>
        <RatingForm
          setRating={setRating}
          user={user}
          formOpen={formOpen}
          handleFormClose={handleFormClose}
        />
      </Container>
    );
  }
};

export default ItemPage;

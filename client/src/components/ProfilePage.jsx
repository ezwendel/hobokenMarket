import React, { useState, useEffect, useContext } from "react";
import { styled } from "@mui/styles";
import { makeStyles } from "@mui/styles";
import { useTheme } from "@mui/material/styles";
import axios from "axios";
import { AuthContext } from "../firebase/Auth";
import { Redirect } from "react-router-dom";
import AddAPhotoIcon from "@mui/icons-material/AddAPhoto";
import { createToken } from "../firebase/AuthBackend";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import Placeholder from "../img/default.png";

import {
  Container,
  Card,
  CardHeader,
  CardContent,
  Avatar,
  Typography,
  Button,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Chip,
  Rating,
  Box,
  Tooltip,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { Link } from "react-router-dom";

import MessageIcon from "@mui/icons-material/Message";
import ShoppingBasketIcon from "@mui/icons-material/ShoppingBasket";
import ChangeProfilePic from "./ChangeProfilePic";
import Loading from "./Loading";
// import firebase from 'firebase/app';

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
  const deleteItem = async (id) => {
    try {
      const header = await createToken();

      const { data } = await axios.delete(
        `http://localhost:4000/items/${id}`,
        header
      );
    } catch (e) {
      alert(e);
    }
    window.location.reload();
  };
  let picture = item.itemPictures[0]
    ? `http://localhost:4000/file/${item.itemPictures[0]}`
    : Placeholder;
  // console.log(item);
  return (
    <>
      <ListItem key={item._id} sx={{ padding: 0 }}>
        {/* <Link to={`/items/${item._id}`} style={{ color: "inherit", textDecoration: "none" }}> */}
        <ListItemButton
          component={Link}
          to={`/item/${item._id}`}
          style={{
            color: "inherit",
            textDecoration: "none",
            borderBottom: "1px solid #ccc",
          }}
        >
          <ListItemIcon sx={{ marginRight: "2em" }}>
            <Avatar
              sx={{ width: 75, height: 75 }}
              src={picture}
              variant="square"
              alt={item.name}
            >
              <img
                src={Placeholder}
                alt={item.name}
                style={{ height: 75, width: "auto" }}
              />
            </Avatar>
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
        <Tooltip title="Delete Listing">
          <Button
            onClick={(e) => {
              e.stopPropagation();
              deleteItem(item._id);
            }}
            style={{
              backgroundColor: "transparent",
              width: "fit-content",
              maxWidth: "30px",
              minWidth: "30px",
            }}
          >
            <DeleteForeverIcon />
          </Button>
        </Tooltip>
        {/* </Link> */}
      </ListItem>
    </>
  );
};

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useContext(AuthContext);
  const [items, setItemData] = useState(undefined);
  const [errorHappened, setError] = useState(undefined);
  const [formOpen, setFormOpen] = useState(false);
  const [profilePic, setProfilePic] = useState(null);

  const handleFormOpen = () => {
    setFormOpen(true);
  };

  const handleFormClose = () => {
    setFormOpen(false);
  };

  const useStyles = makeStyles(() => ({
    title: {
      fontWeight: "bold",
      color: "#444",
    },
  }));
  const classes = useStyles();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // firebase.auth().currentUser.updateProfile({ displayName: '61be75a0bfcf8443bbd1279e' })
        const header = await createToken();

        const { data } = await axios.get(
          // formerly currentUser.displayName
          `http://localhost:4000/user/email/${currentUser.email}`,
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
        setUser(data);
        if (data.profilePicture) {
          setProfilePic(`http://localhost:4000/file/${data.profilePicture}`);
        } else {
          setProfilePic(null);
        }
        setItemData(itemData);
        setError(undefined);
      } catch (e) {
        setUser({ username: "?" });
        setError(e);
      }
      setLoading(false);
    };
    setLoading(true);
    fetchData();
  }, []);

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
  }
  // let itemListings = null;
  let itemListings = items.map((item) => {
    return ItemListing(item);
  });

  let avatarInternals = null;
  if (profilePic) {
    avatarInternals = (
      <Avatar
        alt={`${user.name.firstName} ${user.name.lastName}`}
        src={profilePic}
        sx={{ width: 75, height: 75 }}
      />
    );
  } else {
    avatarInternals = (
      <Avatar sx={{ bgcolor: "#EB5757", width: 75, height: 75, fontSize: 34 }}>
        {user.username[0].toUpperCase()}
      </Avatar>
    );
  }
  let total_rating = 0;
  for (const r of user.ratings) {
    total_rating += r.rating;
  }
  let rating = user.ratings.length > 0 ? total_rating / user.ratings.length : 0;
  // console.log("rating", rating);

  return (
    <Container style={{ maxWidth: "100%" }}>
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
            <Button
              aria-label="message"
              color="secondary"
              onClick={handleFormOpen}
            >
              CHANGE PROFILE PICTURE
              <AddAPhotoIcon style={{ marginLeft: ".3em" }} />
            </Button>
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
              {`${user.name.firstName}
              ${user.name.lastName}`}
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
      <ChangeProfilePic
        setProfilePic={setProfilePic}
        formOpen={formOpen}
        handleFormClose={handleFormClose}
      />
    </Container>
  );
};

export default ProfilePage;

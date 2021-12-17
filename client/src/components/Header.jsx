import React from "react";
import {
  AppBar,
  Icon,
  Toolbar,
  Tooltip,
  Typography,
  IconButton,
  Box,
  Badge,
} from "@mui/material/";
import ChatIcon from "@mui/icons-material/Chat";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import StoreIcon from "@mui/icons-material/Store";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LoginIcon from "@mui/icons-material/Login";
import { Link } from "react-router-dom";

import Searchbar from "./Searchbar";

const Header = () => {
  return (
    <AppBar style={{ position: "static" }}>
      <Toolbar>
        <Link style={{ color: "inherit", textDecoration: "none", justifyContent: "center", alignItems: "center", display: "flex" }} to="/">
          <Box ml="1em" style={{ display: "inline" }}>
            <ShoppingCartIcon />
          </Box>
          <Typography
            variant="h1"
            noWrap
            component="div"
            fontWeight="500"
            fontSize="22px"
            ml="1rem"
            style={{ display: "inline", position: "relative", top: "2px" }}
          >
            Hoboken Marketplace
          </Typography>
        </Link>
        <Box sx={{ flexGrow: 1 }} />
        <Searchbar />
        <Box>
          <Tooltip title="View Listings">
            <Link style={{ color: "inherit" }} to="/items/0">
              <IconButton
                size="large"
                color="inherit"
                aria-label="View Listings"
                sx={{ ml: 0.8, mr: 0.8 }}
              >
                <Badge>
                  <StoreIcon />
                </Badge>
              </IconButton>
            </Link>
          </Tooltip>
        </Box>
        <Box>
          <Tooltip title="My Messages">
            <Link style={{ color: "inherit" }} to="/messages">
              <IconButton
                size="large"
                color="inherit"
                aria-label="Chat"
                sx={{ ml: 0.8, mr: 0.8 }}
              >
                <Badge>
                  <ChatIcon />
                </Badge>
              </IconButton>
            </Link>
          </Tooltip>
        </Box>
        <Box>
          <Tooltip title="My Account">
            <Link style={{ color: "inherit" }} to="/profile">
              <IconButton
                size="large"
                color="inherit"
                aria-label="My Account"
                sx={{ ml: 0.8, mr: 0.8 }}
              >
                <Badge>
                  <AccountCircleIcon />
                </Badge>
              </IconButton>
            </Link>
          </Tooltip>
        </Box>
        <Box>
          <Tooltip title="Logout">
            <Link style={{ color: "inherit" }} to="/logout">
              <IconButton
                size="large"
                color="inherit"
                aria-label="App Info"
                sx={{ ml: 0.8, mr: 0.8 }}
              >
                <Badge>
                  <LoginIcon />
                </Badge>
              </IconButton>
            </Link>
          </Tooltip>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;

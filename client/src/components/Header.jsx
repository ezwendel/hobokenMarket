import React from "react";
import { styled, alpha } from "@mui/material/styles";
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
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import HelpIcon from "@mui/icons-material/Help";
import LoginIcon from "@mui/icons-material/Login";
import { Link } from "react-router-dom";

import Searchbar from "./Searchbar";

const Header = () => {
  return (
    <AppBar>
      <Toolbar>
        <Link style={{ color: "inherit", textDecoration: "none" }} to="/">
          <Box ml="1em" style={{display: "inline"}}>
            <Icon color="inherit" aria-label="App Icon">
              <ShoppingCartIcon />
            </Icon>
          </Box>
          <Typography
            variant="h1"
            noWrap
            component="div"
            fontWeight="500"
            fontSize="22px"
            ml="1rem"
            style={{display: "inline"}}
          >
            Hoboken Marketplace
          </Typography>
        </Link>
        <Box sx={{ flexGrow: 1 }} />
        <Searchbar />
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
          <Tooltip title="Login">
            <Link style={{ color: "inherit" }} to="/login">
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
        <Box>
          <Tooltip title="Help">
            <Link style={{ color: "inherit" }} to="/help">
              <IconButton
                size="large"
                color="inherit"
                aria-label="App Info"
                sx={{ ml: 0.8, mr: 0.8 }}
              >
                <Badge>
                  <HelpIcon />
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

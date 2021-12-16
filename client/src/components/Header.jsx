import React from "react";
import {
  AppBar,
  Toolbar,
  Tooltip,
  Typography,
  IconButton,
  Box,
  Badge,
} from "@mui/material/";
import ChatIcon from "@mui/icons-material/Chat";
import StoreIcon from "@mui/icons-material/Store";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LoginIcon from "@mui/icons-material/Login";
import { Link } from "react-router-dom";

import HobokenIcon from "../img/hoboken.png";

import Searchbar from "./Searchbar";
import HeaderButton from "./HeaderButton";

const Header = () => {
  return (
    <AppBar style={{ position: "static" }}>
      <Toolbar>
        <Link
          style={{
            color: "inherit",
            textDecoration: "none",
            justifyContent: "center",
            alignItems: "center",
            display: "flex",
          }}
          to="/"
        >
          <Box ml="1em" style={{ display: "inline" }}>
            <img src={HobokenIcon} style={{ width: 40, height: 40 }} />
          </Box>
          <Typography
            variant="h1"
            noWrap
            component="div"
            fontWeight="600"
            fontSize="24px"
            ml="1em"
            fontFamily="Playfair Display"
            style={{ display: "inline" }}
          >
            Hoboken Marketplace
          </Typography>
        </Link>
        <Box sx={{ flexGrow: 1 }} />
        <HeaderButton to="/items/0" title="View Listings" icon={<StoreIcon/>} />
        <HeaderButton to="/messages" title="My Messages" icon={<ChatIcon/>} />
        <HeaderButton to="/profile" title="My Account" icon={<AccountCircleIcon/>} />
        <HeaderButton to="/logout" title="Logout" icon={<LoginIcon/>} />
      </Toolbar>
    </AppBar>
  );
};

export default Header;

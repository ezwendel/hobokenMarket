import React from "react";

import { styled, alpha } from "@mui/material/styles";
import { InputBase, Button } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import SendIcon from '@mui/icons-material/Send';

const Searchbar = ({ search }) => {
  // https://mui.com/components/app-bar/
  const Search = styled("div")(({ theme }) => ({
    position: "relative",
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.black, 0.05),
    "&:hover": {
      backgroundColor: alpha(theme.palette.common.black, 0.08),
    },
    marginLeft: 0,
    display: "inline-block",
    flex: 8,
  }));

  const SearchIconWrapper = styled("div")(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: "100%",
    position: "absolute",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  }));

  const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: "inherit",
    width: "100%",
    "& .MuiInputBase-input": {
      padding: theme.spacing(1, 1, 1, 0),
      // vertical padding + font size from searchIcon
      paddingLeft: `calc(1em + ${theme.spacing(4)})`,
      transition: theme.transitions.create("width"),
      width: "100%",
    },
  }));

  return (
    <form
      style={{ maxWidth: "40em", margin: "0 auto 1.5em auto", display: "flex" }}
      method="POST"
      name="search"
      onSubmit={(e) => {
        e.preventDefault();
        search();
      }}
    >
      <Search>
        <SearchIconWrapper>
          <SearchIcon />
        </SearchIconWrapper>
        <StyledInputBase
          placeholder="Search…"
          inputProps={{ "aria-label": "search" }}
          key="search"
          id="search"
        />
      </Search>
      <label htmlFor="search-submit" hidden>Search</label>
      <Button
        type="submit"
        id="search-submit"
        variant="contained"
        style={{ display: "inline-block", width: "fit-content" }}
        disableElevation
      >
        <SendIcon style={{ width: "20px", height: "20px"}}/>
      </Button>
    </form>
  );
};

export default Searchbar;

import React from "react";

import { Link } from "react-router-dom";
import { Tooltip, IconButton, Box, Badge, Button } from "@mui/material/";

const HeaderButton = ({ to, title, icon, func }) => {
  return (
    <Box>
      <Tooltip title={title}>
        <Button
          size="large"
          color="inherit"
          aria-label={title}
          sx={{ ml: 0.8, mr: 0.8 }}
          component={Link}
          to={to}
          className="header-button"
          onClick={func}
        >
          <Box className="header-link-text" fontSize="12px" mr="1em">{title}</Box>
          <Badge>{icon}</Badge>
        </Button>
      </Tooltip>
    </Box>
  );
};

export default HeaderButton;

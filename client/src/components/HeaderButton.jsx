import React from "react";

import { Link } from "react-router-dom";
import { Tooltip, IconButton, Box, Badge } from "@mui/material/";

const HeaderButton = ({ to, title, icon, func }) => {
  return (
    <Box>
      <Tooltip title={title}>
        <IconButton
          size="large"
          color="inherit"
          aria-label={title}
          sx={{ ml: 0.8, mr: 0.8 }}
          component={Link}
          to={to}
          className="header-button"
          onClick={func}
        >
          <Badge>{icon}</Badge>
        </IconButton>
      </Tooltip>
    </Box>
  );
};

export default HeaderButton;

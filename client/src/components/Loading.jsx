import React from "react";
import CircularProgress from "@mui/material/CircularProgress";
import { Container, Typography } from "@mui/material";

const Loading = ({text}) => {
  return (
    <Container style={{ maxWidth: "100%" }}>
      <div
        style={{
          textAlign: "center",
          margin: "0 auto",
          maxWidth: "750px",
          width: "75%",
        }}
      >
        <Typography mb="1em" variant="p" component="div">
          {text ? text : "Loading..."}
        </Typography>
        <CircularProgress />
      </div>
    </Container>
  );
};

export default Loading;

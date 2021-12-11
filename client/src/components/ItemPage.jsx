import React from "react";
import { makeStyles } from "@mui/styles";
import { useTheme } from "@mui/material/styles";

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
  Divider
} from "@mui/material";

import Placeholder from "../img/default.png";

const ItemPage = () => {
  const useStyles = makeStyles(() => ({
    title: {
      fontWeight: "bold",
      color: "#444"
    },
  }));
  const classes = useStyles();

  return (
    <Container maxWidth="100%">
      <Card sx={{ minWidth: 250, maxWidth: "70%", margin: "0 auto" }}>
        <CardMedia component="img" image={Placeholder} />
        <CardHeader
          avatar={<Avatar sx={{ bgcolor: "#EB5757" }}>A</Avatar>}
          title="Item Name"
          subheader="January 1, 2021"
          classes={{ title: classes.title }}
        />
        <Divider />
        <CardContent>
          <div style={{ margin: "1em 0" }}>
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
              Item description.
            </Typography>
          </div>
          <div style={{ margin: "1em 0" }}>
            <Typography gutterBottom variant="h6" component="div">
              Location
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              component="div"
              fontSize="14px"
              gutterBottom
            >
              1 Castle Point Terrace
            </Typography>
          </div>
          <div style={{ margin: "1em 0" }}>
            <Typography gutterBottom variant="h6" component="div">
              Contact Information
            </Typography>
            <TableContainer component={Paper}>
              <Table
                sx={{ minWidth: 500 }}
                aria-label="contact-info"
              >
                <TableBody>
                  <TableRow>
                    <TableCell component="th" scope="row">
                      Name
                    </TableCell>
                    <TableCell style={{ width: 160 }} align="right">
                      John Smith
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell component="th" scope="row">
                      Cell Phone #:
                    </TableCell>
                    <TableCell style={{ width: 160 }} align="right">
                      (123)-456-7890
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell component="th" scope="row">
                      Home Phone #:
                    </TableCell>
                    <TableCell style={{ width: 160 }} align="right">
                      (123)-456-7890
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell component="th" scope="row">
                      Email Address:
                    </TableCell>
                    <TableCell style={{ width: 160 }} align="right">
                      john.smith@gmail.com
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        </CardContent>
      </Card>
    </Container>
  );
};

export default ItemPage;

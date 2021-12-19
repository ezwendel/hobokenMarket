import React, { useState, useContext } from "react";
import { AuthContext } from "../firebase/Auth";
import { createToken } from "../firebase/AuthBackend";
import axios from "axios";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Alert,
  Rating,
  Box,
} from "@mui/material";

const RatingForm = (props) => {
  const [formError, setFormError] = useState(false);
  const { currentUser } = useContext(AuthContext);
  const [value, setValue] = useState(5);

  const addRating = async (e) => {
    try {
      let submitData = {
        userId: props.userId,
        raterEmail: currentUser.email,
        rating: value.toString(),
      };
      // submitData.append("userId", props.userId);
      // submitData.append("raterEmail", currentUser.email); // formerly currentUser.displayName
      // submitData.append("rating", value.toString());
      const header = await createToken();
      let { data } = await axios.post(
        "http://localhost:4000/user/rating",
        submitData,
        header
      );
      props.handleFormClose();
      // TODO: Make rating update more responsive
    } catch (error) {
      console.log(error);
      if (error.error) {
        setFormError(error.error.toString());
      } else {
        setFormError(error.toString());
      }
    }
  };

  return (
    <Dialog open={props.formOpen} onClose={props.handleFormClose} scroll="body">
      <DialogTitle>Leave a Rating</DialogTitle>
      {formError && <Alert severity="error">{formError}</Alert>}
      <DialogContent sx={{ width: 300, justfiy: "center" }}>
        <Box sx={{ width: "fit-content", margin: "0 auto" }}>
          <Rating
            name="user_rating"
            value={value}
            onChange={(event, newValue) => {
              setValue(newValue);
            }}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={props.handleFormClose}>Cancel</Button>
        {currentUser ? (
          <Button
            onClick={(e) => {
              addRating(e);
            }}
            type="submit"
          >
            Submit Rating
          </Button>
        ) : (
          <Button
            onClick={(e) => {
              addRating(e);
            }}
            type="submit"
            disabled
          >
            Submit Rating
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default RatingForm;

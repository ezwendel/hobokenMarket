import React, { useState, useContext } from "react";
import { AuthContext } from "../firebase/Auth";
import { createToken } from "../firebase/AuthBackend";
import axios from "axios";

import { styled, alpha } from "@mui/material/styles";

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

const StyledRating = styled(Rating)({
  '& .MuiRating-iconFilled': {
    color: '#1a6ad6',
  },
  '& .MuiRating-iconHover': {
    color: '#1a6ad6',
  },
});

const RatingForm = (props) => {
  const [formError, setFormError] = useState(false);
  const { currentUser } = useContext(AuthContext);
  const [value, setValue] = useState(5);

  const addRating = async (e) => {
    try {
      let submitData = {
        userId: props.user._id,
        raterEmail: currentUser.email,
        rating: value.toString(),
      };
      const header = await createToken();
      let { data } = await axios.post(
        "http://localhost:4000/user/rating",
        submitData,
        header
      );
      // console.log(data);
      let total_rating = 0;
      for (const r of props.user.ratings) {
        total_rating += r.rating;
      }
      total_rating += value; 
      let avg_rating =
        data.ratings.length > 0 ? total_rating / data.ratings.length : 0;
      props.setRating(avg_rating);
      props.handleFormClose();
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
      <DialogTitle component="h1">Leave a Rating</DialogTitle>
      {formError && <Alert severity="error">{formError}</Alert>}
      <DialogContent sx={{ width: 300, justifyContent: "center" }}>
        <Box sx={{ width: "fit-content", margin: "0 auto" }}>
          <StyledRating
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

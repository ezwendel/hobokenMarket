import React, { useState, useContext } from "react";
import { AuthContext } from "../firebase/Auth";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Alert,
  Rating,
  Box
} from "@mui/material";

const RatingForm = (props) => {
  const [formError, setFormError] = useState(false);
  const { currentUser } = useContext(AuthContext);
  const [value, setValue] = useState(5);

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
          <Button onClick={(e) => {}} type="submit">
            Submit Rating
          </Button>
        ) : (
          <Button onClick={(e) => {}} type="submit" disabled>
            Submit Rating
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default RatingForm;

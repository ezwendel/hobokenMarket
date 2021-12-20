import React, { useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../firebase/Auth";
import { createToken } from "../firebase/AuthBackend";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
  Input,
  Button,
  FormControl,
  InputLabel,
  Select,
  OutlinedInput,
  MenuItem,
  Alert,
} from "@mui/material";

const CreateContact = (props) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  const [formError, setFormError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [messageError, setMessageError] = useState(false);

  const { currentUser } = useContext(AuthContext);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const addContact = async (e) => {
    e.preventDefault();
    setEmailError(false);
    setMessageError(false);
    let submitError = false;
    let emailField = document.getElementById("email");
    let messageField = document.getElementById("message")

    if (emailField.value.trim().length === 0) {
      setEmailError("Missing email.");
      submitError = true;
    }

    if (messageField.value.trim().length === 0) {
        setEmailError("Missing  message.");
        submitError = true;
      }

    if (!submitError) {
      try {

        let submitData = new FormData();
        submitData.append("buyer", currentUser.email)
        submitData.append("message", formData.message.trim());


        console.log(submitData);

        const header = await createToken();

        let { data } = await axios.post(
          `http://localhost:4000/messageThreads/${emailField.value}`, 
          {buyer: currentUser.email, message: messageField.value.trim()},
          header
        );
        console.log(data);
        emailField.value = "";

        props.handleFormClose();
        window.location.reload(false);
      } catch (e) {
        console.log(e);
        if (e.error) {
          setFormError(e.error.toString());
        } else {
          setFormError(e.toString());
        }
      }
    }
  };

  return (
    <Dialog open={props.formOpen} onClose={props.handleFormClose} scroll="body">
      <DialogTitle>Add New Contact</DialogTitle>
      {formError && <Alert severity="error">{formError}</Alert>}
      <DialogContent sx={{ width: 500 }}>
        <TextField
          autoFocus
          margin="dense"
          id="email"
          name="email"
          label="Email Address"
          type="text"
          fullWidth
          placeholder="Enter seller's email address"
          variant="standard"
          onChange={(e) => handleChange(e)}
        />
        {emailError && <Alert severity="error">{emailError}</Alert>}
        <TextField
          margin="dense"
          id="message"
          label="Enter Message"
          name="message"
          type="text"
          fullWidth
          multiline
          rows={6}
          placeholder="Type your message"
          variant="standard"
          onChange={(e) => handleChange(e)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={props.handleFormClose}>Cancel</Button>
        {currentUser ? (
          <Button
            onClick={(e) => {
              addContact(e);
            }}
            type="submit"
          >
            ADD CONTACT
          </Button>
        ) : (
          <Button
            onClick={(e) => {
              addContact(e);
            }}
            type="submit"
            disabled
          >
            ADD CONTACT
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default CreateContact;

import React, { useState, useContext } from "react";
import { AuthContext } from "../firebase/Auth";
import axios from "axios";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Input,
  Button,
  FormControl,
  Alert,
} from "@mui/material";

const ChangeProfilePic = (props) => {
  const [imageError, setImageError] = useState(false);
  const [formError, setFormError] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const { currentUser } = useContext(AuthContext);

  const onFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const uploadPhoto = async (e) => {
    e.preventDefault();
    setFormError(false);
    setImageError(false);
    let submitError = false;
    let imageField = document.getElementById("image");
    if (imageField.value.trim() === "") {
      setImageError("Missing image.");
      submitError = true;
    }
    if (!submitError) {
      try {
        console.log("Image: ", selectedFile);
        let submitData = new FormData();
        submitData.append("file", selectedFile);
        submitData.append("sellerId", currentUser.displayName);
        console.log(submitData);
        let { data } = await axios.post(
          "http://localhost:4000/items/with_image",
          submitData
        );
        console.log(data);
        setSelectedFile(null);
        props.handleFormClose();
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
      <DialogTitle>Change Profile Pic</DialogTitle>
      {formError && <Alert severity="error">{formError}</Alert>}
      <DialogContent sx={{ width: 500, justfiy: "center" }}>
        <FormControl sx={{ mt: 1, width: "35ch" }}>
          <label htmlFor="image">Upload an image below:</label>
          <Input
            accept="image/*"
            id="image"
            multiple
            type="file"
            onChange={onFileChange}
          />
        </FormControl>
        {imageError && <Alert severity="error">{imageError}</Alert>}
      </DialogContent>
      <DialogActions>
        <Button onClick={props.handleFormClose}>Cancel</Button>
        {currentUser ? (
          <Button
            onClick={(e) => {
              uploadPhoto(e)
            }}
            type="submit"
          >
            Upload Photo
          </Button>
        ) : (
          <Button
            onClick={(e) => {
              uploadPhoto(e)
            }}
            type="submit"
            disabled
          >
            Upload Photo
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default ChangeProfilePic;
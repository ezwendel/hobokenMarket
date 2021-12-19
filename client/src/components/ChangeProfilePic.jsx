import React, { useState, useContext, Profiler } from "react";
import { AuthContext } from "../firebase/Auth";
import axios from "axios";
import { createToken } from "../firebase/AuthBackend";

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
import { propsToClassKey } from "@mui/styles";

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
        // console.log("Image: ", selectedFile);
        let submitData = new FormData();
        submitData.append("file", selectedFile);
        submitData.append("userId", currentUser.email); // formerly currentUser.displayName
        // console.log(submitData);

        const header = await createToken();

        let { data } = await axios.post(
          "http://localhost:4000/file/profile_upload",
          submitData,
          header
        );
        // console.log("post data", data);
        props.setProfilePic(data.imgUrl)
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
      <DialogTitle component="h1">Change Profile Pic</DialogTitle>
      {formError && <Alert severity="error">{formError}</Alert>}
      <DialogContent sx={{ width: 500, justifyContent: "center" }}>
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

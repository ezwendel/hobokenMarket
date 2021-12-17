import React, { useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../firebase/Auth";

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

const CreateListing = (props) => {
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [formError, setFormError] = useState(false);
  const [nameError, setNameError] = useState(false);
  const [descError, setDescError] = useState(false);
  const [catError, setCatError] = useState(false);
  const [imageError, setImageError] = useState(false);

  const { currentUser } = useContext(AuthContext);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const addItem = async (e) => {
    e.preventDefault();
    setFormError(false);
    setNameError(false);
    setDescError(false);
    setCatError(false);
    setImageError(false);
    let submitError = false;
    let nameField = document.getElementById("name");
    let descriptionField = document.getElementById("description");
    let imageField = document.getElementById("image");
    if (nameField.value.trim().length === 0) {
      setNameError("Missing item name.");
      submitError = true;
    }
    if (descriptionField.value.trim().length === 0) {
      setDescError("Missing item description.");
      submitError = true;
    }
    if (categories.length === 0) {
      setCatError("Must include at least one category.");
      submitError = true;
    }
    if (imageField.value.trim() === "") {
      setImageError("Missing image.");
      submitError = true;
    }
    if (!submitError) {
      try {
        console.log("Image: ", selectedFile);
        let submitData = new FormData();
        submitData.append("name", formData.name.trim());
        submitData.append("description", formData.description.trim());
        submitData.append("file", selectedFile);
        submitData.append("categories", categories);
        submitData.append("sellerId", currentUser.displayName);
        // const submitData = {
        //   name: formData.name.trim(),
        //   description: formData.description.trim(),
        //   file: selectedFile,
        //   categories: categories,
        //   sellerId: currentUser.displayName,
        // };
        console.log(submitData);
        let { data } = await axios.post(
          "http://localhost:4000/items/with_image",
          submitData
        );
        console.log(data);
        nameField.value = "";
        descriptionField.value = "";
        setCategories([]);
        setSelectedFile(null);
        props.handleFormClose();
        props.history.push(`/item/${data._id}`);
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

  const onFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  // https://mui.com/components/selects/
  const handleCategoryChange = (event) => {
    const {
      target: { value },
    } = event;
    setCategories(
      // On autofill we get a the stringified value.
      typeof value === "string" ? value.split(",") : value
    );
  };

  const categoryNames = [
    "Furniture",
    "Electronics",
    "Art",
    "Entertainment",
    "Clothing",
    "Other",
  ];

  return (
    <Dialog open={props.formOpen} onClose={props.handleFormClose} scroll="body">
      <DialogTitle>Add New Listing</DialogTitle>
      {formError && <Alert severity="error">{formError}</Alert>}
      <DialogContent sx={{ width: 500 }}>
        <DialogContentText>
          Enter all of the details for your new listing.
        </DialogContentText>
        <TextField
          autoFocus
          margin="dense"
          id="name"
          name="name"
          label="Item Name"
          type="text"
          fullWidth
          placeholder="Enter a name for your item"
          variant="standard"
          onChange={(e) => handleChange(e)}
        />
        {nameError && <Alert severity="error">{nameError}</Alert>}
        <TextField
          margin="dense"
          id="description"
          label="Item Description"
          name="description"
          type="text"
          fullWidth
          multiline
          rows={6}
          placeholder="Describe your item"
          variant="standard"
          onChange={(e) => handleChange(e)}
        />
        {descError && <Alert severity="error">{descError}</Alert>}
        <FormControl sx={{ mt: 1, mb: 1, width: "100%" }}>
          <InputLabel id="categories">Categories</InputLabel>
          <Select
            labelId="categories"
            id="categories"
            multiple
            value={categories}
            onChange={handleCategoryChange}
            input={<OutlinedInput label="Categories" />}
            MenuProps={{
              PaperProps: {
                style: {
                  maxHeight: 48 * 4.5 + 8,
                  width: 250,
                },
              },
            }}
          >
            {categoryNames.map((name) => (
              <MenuItem key={name} value={name}>
                {name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        {catError && <Alert severity="error">{catError}</Alert>}
        <FormControl sx={{ mt: 1, width: "35ch" }}>
          <label htmlFor="image">Upload Image</label>
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
              addItem(e);
            }}
            type="submit"
          >
            Submit Listing
          </Button>
        ) : (
          <Button
            onClick={(e) => {
              addItem(e);
            }}
            type="submit"
            disabled
          >
            Submit Listing
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default CreateListing;

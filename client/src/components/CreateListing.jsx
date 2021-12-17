import React, { useState } from "react";
import axios from "axios";

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

const CreateListing = ({ formOpen, handleFormClose }) => {
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });
  const [formError, setFormError] = useState(false);
  const [nameError, setNameError] = useState(false);
  const [descError, setDescError] = useState(false);
  const [catError, setCatError] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const addItem = async (e) => {
    setFormError(false);
    setNameError(false);
    setDescError(false);
    setCatError(false);
    e.preventDefault();
    let submitError = false;
    let nameField = document.getElementById("name");
    let descriptionField = document.getElementById("description");
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
    if (!submitError) {
      try {
        // TODO: change to current user's ID
        const submitData = {
          name: formData.name.trim(),
          description: formData.description.trim(),
          categories: categories,
          sellerId: "61b7af9394292552b857d829",
        };
        console.log(submitData);
        let { data } = await axios.post(
          `http://localhost:4000/items`,
          submitData
        );
        console.log(data);
        nameField.value = "";
        descriptionField.value = "";
        setCategories([]);
        handleFormClose();
      } catch (error) {
        console.log(error);
        setFormError(error.toString());
      }
    }
  };

  let fileUrl = "";
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

  const readFile = async (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.addEventListener('load', () => resolve(reader.result), false);
      reader.readAsDataURL(file);
    })
  }

  const onFileChange = async (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      let imageDataUrl = await readFile(file);
      setImage(imageDataUrl);
    }
  }

  const categoryNames = [
    "Furniture",
    "Electronics",
    "Art",
    "Entertainment",
    "Clothing",
    "Other",
  ];

  return (
    <Dialog open={formOpen} onClose={handleFormClose} scroll="body">
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
          <label htmlFor="item-image">Upload Image</label>
          <Input accept="image/*" id="item-image" multiple type="file" onChange={onFileChange} />
          {image && (
            <img src={image} />
          )}
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleFormClose}>Cancel</Button>
        <Button
          onClick={(e) => {
            addItem(e);
          }}
          type="submit"
        >
          Submit Listing
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateListing;

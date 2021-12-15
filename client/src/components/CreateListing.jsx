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
} from "@mui/material";

const CreateListing = ({ formOpen, handleFormClose }) => {
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });
  const [formError, setFormError] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const addItem = async (e) => {
    e.preventDefault();
    console.log("good1");
    if (document.getElementById("name").value.trim().length === 0) {
      setFormError("Name field cannot be empty");
    } else {
      console.log("good2");
      setFormError(false);
      try {
        const submitData = {
          name: formData.name.trim(),
          description: formData.description.trim(),
          categories: categories,
          sellerId: "61b7af9394292552b857d829",
        }
        console.log(submitData);
        // TODO: change to current user's ID
        let { data } = await axios.post(`http://localhost:4000/items`, submitData);
        console.log(data);
        document.getElementById("name").value = "";
        document.getElementById("description").value = "";
        setCategories([]);
      } catch (error) {
        console.log(error);
        setFormError(error);
      }
    }
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
    <Dialog open={formOpen} onClose={handleFormClose}>
      <DialogTitle>Add New Listing</DialogTitle>
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
        <FormControl sx={{ mt: 1, width: "35ch" }}>
          <label htmlFor="image">Upload Image</label>
          <Input accept="image/*" id="image" multiple type="file" />
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleFormClose}>Cancel</Button>
        <Button
          onClick={(e) => {
            handleFormClose();
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

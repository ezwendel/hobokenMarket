import React from "react";

import {
  Container,
  Fab,
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

const CreateListing = ({formOpen, handleFormClose}) => {
  const [categories, setCategories] = React.useState([]);

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
          id="item-name"
          label="Item Name"
          type="text"
          fullWidth
          placeholder="Enter a name for your item"
          variant="standard"
        />
        <TextField
          margin="dense"
          id="item-description"
          label="Item Description"
          type="text"
          fullWidth
          multiline
          rows={6}
          placeholder="Describe your item"
          variant="standard"
        />
        <FormControl sx={{ mt: 1, mb: 1, width: "100%" }}>
          <InputLabel id="item-categories">Categories</InputLabel>
          <Select
            labelId="item-categories"
            id="item-categories"
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
          <label htmlFor="item-image">Upload Image</label>
          <Input accept="image/*" id="item-image" multiple type="file" />
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleFormClose}>Cancel</Button>
        <Button onClick={handleFormClose}>Submit Listing</Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateListing;

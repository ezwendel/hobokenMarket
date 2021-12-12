import React, { useState } from "react";

import "../css/App.css";

import Header from "./Header";
import Login from "./Login";
import CreateAccount from "./CreateAccount";
import ListingsPage from "./ListingsPage";
import ItemPage from "./ItemPage";
import ProfilePage from "./ProfilePage";

import {
  createTheme,
  ThemeProvider,
} from "@mui/material";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

const theme = createTheme({
  palette: {
    primary: {
      main: "#A32638",
    },
    secondary: {
      main: "#2F80ED",
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <div className="App">
          <Header />
          <div style={{ margin: "2em" }}>
            <Switch>
              <Route exact path="/">
                <div>Homepage</div>
              </Route>
              <Route exact path="/items/:page" component={ListingsPage} />
              <Route exact path="/item/:id" component={ItemPage} />
              <Route exact path="/messages">
                <div>Messages</div>
              </Route>
              <Route exact path="/login" component={Login} />
              <Route exact path="/create-account" component={CreateAccount} />
              <Route exact path="/profile">
                <ProfilePage />
              </Route>
            </Switch>
          </div>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;

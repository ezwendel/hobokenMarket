import React, { useState } from "react";

import "../css/App.css";

import Header from "./Header";
import Login from "./Login";
import CreateAccount from "./CreateAccount";
import ListingsPage from "./ListingsPage";
import ItemPage from "./ItemPage";
import ProfilePage from "./ProfilePage";
import {AuthProvider} from '../firebase/Auth'
import PrivateRoute from './PrivateRoute';
import Home from "./Home";
import Logout from "./Logout";

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
  const [items, setItems] = useState([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]); // placeholder items

  return (
    <AuthProvider>
    <ThemeProvider theme={theme}>
      <Router>
        <div className="App">
          <Header />
          <div style={{ margin: "2em" }}>
            <Switch>
              <PrivateRoute exact path="/" component={Home} />
              <Route exact path="/items">
                <ListingsPage items={items} />
              </Route>
              <Route exact path="/items/:id">
                <ItemPage/>
              </Route>
              <Route exact path="/messages">
                <div>Messages</div>
              </Route>
	            <Route exact path="/logout" component={Logout} />
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
    </AuthProvider>
  );
}

export default App;

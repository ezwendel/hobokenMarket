import React from "react";

import "../css/App.css";

import Header from "./Header";
import Login from "./Login";
import CreateAccount from "./CreateAccount";
import ListingsPage from "./ListingsPage";
import ItemPage from "./ItemPage";
import UserPage from "./UserPage";
import ProfilePage from "./ProfilePage";
import { AuthProvider } from "../firebase/Auth";
import PrivateRoute from "./PrivateRoute";
import Home from "./Home";
import Logout from "./Logout";
import ChatPage from "./ChatPage";
import MessageThread from "./MessageThread";

import { createTheme, ThemeProvider } from "@mui/material";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

const theme = createTheme({
  palette: {
    primary: {
      main: "#A32638",
    },
    secondary: {
      main: "#1a6ad6",
    },
  },
});

function App() {
  return (
    <AuthProvider>
    <ThemeProvider theme={theme}>
      <Router>
        <div className="App">
          <Header />
          <div style={{ margin: "2em" }}>
            <Switch>
              <PrivateRoute exact path="/" component={Home} />
              <Route exact path="/items/:page" component={ListingsPage} />
              <Route exact path="/item/:id" component={ItemPage} />
              <Route exact path="/user/:id" component={UserPage} />
	            <Route exact path="/logout" component={Logout} />
              <PrivateRoute exact path="/messages" component={ChatPage}/>
              <PrivateRoute exact path="/messageThread/:id" component={MessageThread}/>
              <Route exact path="/login" component={Login} />
              <Route exact path="/create-account" component={CreateAccount} />
              <PrivateRoute exact path="/profile" component={ProfilePage}/>
            </Switch>
            </div>
          </div>
        </Router>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;

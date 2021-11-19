import '../css/App.css';

import Header from './Header';
import Item from './Item';

import { createTheme, ThemeProvider, Container } from '@mui/material';
import { BrowserRouter as Router, Route, Link, Switch } from "react-router-dom";

const theme = createTheme({
  palette: {
    primary: {
      main: "#A32638"
    },
    secondary: {
      main: "#2F80ED"
    }
  }
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <div className="App">
          <Header />
          <Container sx={{marginTop: "6em"}}>
            <Switch>
              <Route exact path="/">
                <Item/>
              </Route>
              <Route exact path="/messages">
                <div>Messages</div>
              </Route>
              <Route exact path="/login">
                <div>Login</div>
              </Route>
              <Route exact path="/profile">
                <div>Profile</div>
              </Route>
              <Route exact path="/help">
                <div>Help</div>
              </Route>
            </Switch>
          </Container>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;

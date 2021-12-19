import React, { useState, useEffect } from 'react';
import firebaseApp from './Firebase';
import { Container, Typography, CircularProgress } from '@mui/material';

export const AuthContext = React.createContext();


export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);

  useEffect(() => {
    firebaseApp.auth().onAuthStateChanged((user) => {
      setCurrentUser(user);
      setLoadingUser(false);
    });
  }, []);

  if (loadingUser) {
    return (
      <Container style={{ maxWidth: "100%" }}>
      <div
        style={{
          textAlign: "center",
          margin: "0 auto",
          maxWidth: "750px",
          width: "75%",
        }}
      >
        <Typography mb="1em" variant="p" component="div">
          Authenticating...
        </Typography>
        <CircularProgress />
      </div>
    </Container>
    );
  }

  return (
    <AuthContext.Provider value={{ currentUser }}>
      {children}
    </AuthContext.Provider>
  );
};

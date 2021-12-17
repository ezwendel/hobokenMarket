import React from 'react';
import { doSignOut } from '../firebase/FirebaseFunctions';

const LogOutButton = () => {
  return (
    <button type="button" onClick={doSignOut}>
      Sign Out
    </button>
  );
};

export default LogOutButton;
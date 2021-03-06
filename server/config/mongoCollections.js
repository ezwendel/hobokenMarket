const mongoConnection = require('./mongoConnection');
const mongoose = require('mongoose')

/* This will allow you to have one reference to each collection per app */
/* Feel free to copy and paste this this */
const getCollectionFn = (collection) => {
  let _col = undefined;

  return async () => {
    if (!_col) {
      const db = await mongoConnection.connectToDb();
      _col = await db.collection(collection);
    }

    return _col;
  };
};

/* Now, you can list your collections here: */
module.exports = {
  users: getCollectionFn('USERS'),
  items: getCollectionFn('ITEMS'),
  messageThreads: getCollectionFn('MESSAGETHREADS'),
  imageChunks: getCollectionFn('images.chunks'),
  imageFiles: getCollectionFn('images.files')
};

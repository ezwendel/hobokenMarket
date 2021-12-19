// var admin = require("firebase-admin");

// var serviceAccount = require("./serviceAccount.json");

// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
//   databaseURL: "https://hobokenmarket-1566c-default-rtdb.firebaseio.com"
// });

// module.exports = admin;

// async function decodeTooken(req, res, next) {
//   const token = req.headers.authorization.split(' ')[1];
//   const decodeValue = admin.auth().verifyIdToken(token);
//   if (decodeValue) {
//     return next();
//   }
//   return res.status(401).json({error: "unauthorized"})

// }
// authenticateToken.jsconst admin = require('firebase-admin');

var admin = require("firebase-admin");

const serviceAccount = require('./serviceAccount.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://hobokenmarket-1566c-default-rtdb.firebaseio.com"
});

async function decodeIDToken(req, res, next) {
  const header = req.headers.authorization;
  if (header && header !== 'Bearer null' && req.headers.authorization.startsWith('Bearer ')) {
    const idToken = req.headers.authorization.split('Bearer ')[1];
    try {
      const decodedToken = await admin.auth().verifyIdToken(idToken);
      req['currentUser'] = decodedToken;
    } catch (err) {
      console.log(err);
    }
  }
  next();
}

module.exports = decodeIDToken;
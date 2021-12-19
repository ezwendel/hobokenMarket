const express = require('express');
const app = express();
const static = express.static(__dirname + '/public');
const cors = require('cors');
const decodeIDToken = require('firebase-backend/authenticateToken')

app.use(decodeIDToken)

app.use(cors({
    origin: '*'
}));

const configRoutes = require('./routes');

app.use('/public', static);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

configRoutes(app);

app.listen(4000, () => {
  console.log("We've now got a server!");
  console.log('Your routes will be running on http://localhost:4000');
});
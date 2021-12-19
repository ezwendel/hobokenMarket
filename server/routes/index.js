const fileRoutes = require('./file');
const itemRoutes = require('./items');
const messageRoutes = require('./messageThreads');
const userRoutes = require('./users');
const decodeIDToken = require("../firebase-backend/authenticateToken.js")


const constructorMethod = (app) => {

  app.use(decodeIDToken)

  app.post('/', (req, res) => {
    console.log("here")
    const auth = req.currentUser;
    console.log(auth)
    if (auth) {
      console.log('authenticated!', auth);
      return res.send('Hi, from POST');
    }
    return res.status(403).send('Not authorized')
  });
  
  app.delete('/', (req, res) => {
    const auth = req.currentUser;
    if (auth) {
      console.log('authenticated!', auth);
      return res.send('Hi, from DELETE');
    }
    return res.status(403).send('Not authorized')
  });
  
  app.use('/file/', fileRoutes);
  app.use('/items', itemRoutes);
  app.use('/messageThreads', messageRoutes);
  app.use('/user', userRoutes);


  app.use('*', (req, res) => {
    res.status(404).json({ error: '404 Page Not Found' })
  });
};

module.exports = constructorMethod;
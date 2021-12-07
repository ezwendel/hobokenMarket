const fileRoutes = require('./file');
const itemRoutes = require('./items');
const messageRoutes = require('./messageThreads');
const userRoutes = require('./users');

const constructorMethod = (app) => {
  app.use('/file/', fileRoutes);
  app.use('/items', itemRoutes);
  app.use('/messageThreads', messageRoutes);
  app.use('/user', userRoutes);


  app.use('*', (req, res) => {
    res.status(404).json({ error: '404 Page Not Found' })
  });
};

module.exports = constructorMethod;
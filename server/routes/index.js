const fileRoutes = require('./file');

const constructorMethod = (app) => {
  app.use('/file/', fileRoutes);


  app.use('*', (req, res) => {
    res.status(404).json({ error: '404 Page Not Found' })
  });
};

module.exports = constructorMethod;
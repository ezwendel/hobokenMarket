const express = require('express');
const app = express();
const static = express.static(__dirname + '/public');
const cors = require('cors');

app.use(cors({
    origin: '*'
}));

const configRoutes = require('./routes');
const http = require('http').createServer(app);
var io = require('socket.io')(http);

io.on('connection', (socket) => {
  console.log('new client connected', socket.id);
  const id = socket.handshake.query.id
  socket.join(id)

  socket.on('send_message', ({ recipients, message }) => {
    recipients.forEach(recipient => {
      const newRecipients = recipients.filter(r => r !== recipient)
      newRecipients.push(id)
      socket.broadcast.to(recipient).emit('receive_message', {
        recipients: newRecipients, sender: id, message
      })
    })
  })
})

app.use('/public', static);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

configRoutes(app);

app.listen(4000, () => {
  console.log("We've now got a server!");
  console.log('Your routes will be running on http://localhost:4000');
});
// Writing a chat application with popular web applications stacks like LAMP (PHP) has normally been very hard. It involves polling the server for changes, keeping track of timestamps, and it’s a lot slower than it should be.

// Sockets have traditionally been the solution around which most real-time chat systems are architected, providing a bi-directional communication channel between a client and a server.

// This means that the server can push messages to clients. Whenever you write a chat message, the idea is that the server will get it and push it to all other connected clients.

// Socket.IO is composed of two parts:

// A server that integrates with (or mounts on) the Node.JS HTTP Server socket.io
// A client library that loads on the browser side socket.io-client

// https://socket.io/get-started/chat  -> learn socket.io from here




// Node server which will handle socket io connections
// const io=require('socket.io')(8000)

const dotenv = require('dotenv');

const port= process.env.PORT || 8000;

const io = require('socket.io')(port, {
  cors: {
    origin: '*',
  }
});

const users = {}


// now we are running socket.io server which is instance of http .
// now this socket.io server will listen to incoming events 
// socket is particular connection.

// here below connection , new-user-joined , user-joined are custom events

io.on('connection', (socket) => { 
  // io.on is socket.io instance which will listen to so many socket connections like rohan connected , ram connected , shyam connected etc , somebody sent message to someone   i.e io.on will listen to all of them .

// and socket.on will handle what should happen to particular connection 
    // socket.on accepts event and defines what to do if that event occurs i.e if here socket.on  got user-joined event then we will set that users name to users if particular connection joined i.e particular user then what should happen to that particular connection or user
    // here 'new-user-joined' is an event and event name is given by us only we can also give different name.

    socket.on('new-user-joined', (name) => { // it will listen the event new-user-joined emitted by client server.
    console.log("New user joined named : ", name);
    console.log(socket.id);
    users[socket.id] = name; // here if particular connection joined then we will set key to users i.e socket.id 

    // now if for ex 6th user joined then other 5 should know that 6th user joined
    // so for that we will do :-
    socket.broadcast.emit('user-joined', name); // brodcast.emit emits  the msg to everybody other than itself.

  });

  socket.on('send', message => {  // here event names are given by us like send,user-joined,receive etc
    socket.broadcast.emit('receive', { message: message, name: users[socket.id] });
  });

  socket.on('disconnect', data => {
    socket.broadcast.emit('left', users[socket.id]);
    delete users[socket.id];
  });
})
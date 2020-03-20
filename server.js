// 1. Write and implement four custom middleware functions
// 2. Bild an API to let clients perform CRUD operations on users
// 3. Add endpoints to retrieve the list of posts for a user and to store a new post for a user
const express = require('express'); // importing a CommonJS module
const userRouter = require('./users/userRouter.js');
const postRouter = require('./posts/postRouter');
const mw = require('./custom/middleware.js');
const logger = mw.logger;
const server = express();

const morgan = require('morgan'); 
const helmet = require('helmet'); // 1. npm i helmet; 2. require

// global middleware - turn it on by typing server.use - will be applied to every request coming into the server - it teaches express how to parse json from req.body - MW is a function that lookd like a route handler.
// server.use(morgan('dev')); // third party mw, needs to be npm installed - we are going to build a simplified version of morgan
server.use(helmet()); // 3. add third party mw, needs to be npm installed
// server.use(logger);
server.use(express.json()); // built-in middleware: no need to npm install 
// server.use(addName); // mw - global - no need
server.use(logger);

//? the router handles endpoints that begin with /api/users 
server.use('/api/users', userRouter);
server.use('/api/posts', postRouter);

// router handler
server.get("/", addName, (req, res) => {
  // figure out a way to have a name using mw
  const nameInsert = req.name ? ` ${req.name}` : "";
  console.log("req.name is: ", req.name);

  // will be treated as HTML string
  res.send(`
    <h2>Let's write some custom middleware!</h2>
    <p>Welcome ${nameInsert} to the custom middleware API land</p> 
  `);
});

// Doing sth similar to what express.js does
function addName(req, res, next) {
  // secret sauce
  req.name = "WEBPT11";
  next();
}

module.exports = server;

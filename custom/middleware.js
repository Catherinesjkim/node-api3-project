// MVP
// 1. Write and implement four custom middleware functions
// 2. Build an API to let clients perform CRUD operations on users
// 3. Add endpoints to retrieve the list of posts for a user and to store a new post for a user

// For validations (400 errors) in the mw
const Users = require('../users/userDb');
const Posts = require('../posts/postDb');

/*
  1. `logger()`
    - `logger` logs to the console the following information about each request: request method, request url, and a timestamp
    - this middleware runs on every request made to the API
*/
const logger = (req, res, next) => {
  // log info about the request to the console --> GET to /
  const method = req.method;
  const endpoint = req.originalUrl;
  const date = new Date();
  console.log(`You made a ${method} request to ${endpoint} on ${date}`);

  next(); // moves the request to the next mw
}

/*
 2. `validateUserId()`
  - `validateUserId` validates the user id on every request that expects a user id parameter
  - if the `id` parameter is valid, store that user object as `req.user`
  - if the `id` parameter does not match any user id in the database, cancel the request and respond with status `400` and `{ message: "invalid user id" }`
*/
const validateUserId = (req, res, next) => {
  const { id } = req.params;

  Users.getById(id)
    .then(user => {
      user ? req.user : res.status(400).json({ message: 'Invalid User ID!' })
      next()
    })
}

/*
 3. `validateUser()`
  - `validateUser` validates the `body` on a request to create a new user
  - if the request `body` is missing, cancel the request and respond with status `400` and `{ message: "missing user data" }`
  - if the request `body` is missing the required `name` field, cancel the request and respond with status `400` and `{ message: "missing required name field" }`
*/
const validateUser = (req, res, next) =>  {
  const { name } = req.body;

  Object.entries(req.body).length === 0
    ? res.status(400).json({ message: 'No User Data' })
    : !name
    ? res.status(400).json({ message: 'Missing required name field' })
    : next()
}

/*
4. `validatePost()`
  - `validatePost` validates the `body` on a request to create a new post
  - if the request `body` is missing, cancel the request and respond with status `400` and `{ message: "missing post data" }`
  - if the request `body` is missing the required `text` field, cancel the request and respond with status `400` and `{ message: "missing required text field" }`
*/
const validatePost = (req, res, next) => {
  const { text } = req.body;

  Object.entries(req.body).length === 0
    ? res.status(400).json({ message: 'No User Data' })
    : !text
    ? res.status(400).json({ message: 'Missing required text field' })
    : next()
}

const validatePostId = (req, res, next) => {
  const { id } = req.params;

  Posts.getById(id)
    .then(user => {
      user ? req.user : res.status(400).json({ message: 'Invalid User ID!' })
      next()
    })
}

module.exports = {
  logger, 
  validateUserId,
  validateUser,
  validatePost,
  validatePostId
}
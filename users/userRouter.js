const express = require('express');
const router = express.Router();
const Users = require("./userDb.js");
const mw = require('../custom/middleware.js');
const validateUserId = mw.validateUserId;
const validateUser = mw.validateUser;
const validatePost = mw.validatePost;

router.post('/', (req, res) => {
  Users.insert(req.body)
    .then(user => {
      res.status(201).json({ success: 'A New User has been created!', user })
    })
    .catch(err => {
      res.status(500).json({ error: 'You found me but I cannot provide any info, try again!', err })
    })
});

// Route handler
// All array items with id & name got pulled in to Postman with GET request - without time stamp
/*
- `get()`: calling find returns a promise that resolves to an array of all the `resources` contained in the database.
*/
router.get('/', (req, res) => {
  Users
    .get(req.query)
    .then(users => {
      res.status(200).json(users);
    })
    .catch(error => {
      // log error to database
      console.log(error);
      res.status(500).json({
        message: "Error retrieving the users",
      });
    });
});
// Worked on postman

/*
- `getById()`: takes an `id` as the argument and returns a promise that resolves to the `resource` with that id if found.
*/
router.get('/:id', (req, res) => {
  const { id } = req.params;
  Users.getById(id)
    .then(user => {
      res.status(200).json(user)
    })
    .catch(err => {
      res.status(500).json({ error: 'You found me but I cannot provide any info, try again!', err })
    })
});

/*
- `remove()`: the remove method accepts an `id` as it's first parameter and, upon successfully deleting the `resource` from the database, returns the number of records deleted.
*/
router.delete('/:id', validateUserId, (req, res) => {
  const { id } = req.params;
  Users.getById(id)
    .then(user => {
      user 
        ? Users.remove(id)
          .then(deleted => {
            deleted ? res.status(200).json({ success: `User ${id} was deleted!`, info: user }) : null
          })
          : null
        })
        .catch(err => {
          res.status(500).json({ error: 'You found me but I cannot provide any info, try again!', err })
        })
    });

/*
  validateUserId()
  validateUserId validates the user id on every request that expects a user id parameter
  if the id parameter is valid, store that user object as req.user
  if the id parameter does not match any user id in the database, cancel the request and respond with status 400 and { message: "invalid user id" }
*/
router.put('/:id', validateUserId, (req, res) => {
  const { id } = req.params

  Users.update(id, req.body)
      .then(user => {
        res.status(200).json({ success: 'Info Updated!', info: req.body })
      })
      .catch(err => {
        res.status(500).json({ error: 'You found me but I cannot provide any info, try again!', err })
      })
    })


// Endponits beyond /:id
/*
  validateUserId()
    validateUserId validates the user id on every request that expects a user id parameter
    if the id parameter is valid, store that user object as req.user
    if the id parameter does not match any user id in the database, cancel the request and respond with status 400 and { message: "invalid user id" }
  validatePost()
    validatePost validates the body on a request to create a new post
    if the request body is missing, cancel the request and respond with status 400 and { message: "missing post data" }
    if the request body is missing the required text field, cancel the request and respond with status 400 and { message: "missing required text field" }
*/
router.post("/:id/posts", validateUserId, validatePost, (req, res) => {
  const { text } = req.body;
  const user_id = req.params.id;

  Users.getById(user_id)
    .then(post => {
      if (!post) {
        null
      } else {
        let newPost = {
          text, 
          user_id,
        }

        Posts.insert(newPost)
          .then(post => {
            res.status(201).json({ success: post })
        })
      }
    })
    .catch(err => {
      res.status(500).json({ error: 'You found me but I cannot provide any info, try again!', err })
    })
});

/*
validateUserId()
    validateUserId validates the user id on every request that expects a user id parameter
    if the id parameter is valid, store that user object as req.user
    if the id parameter does not match any user id in the database, cancel the request and respond with status 400 and { message: "invalid user id" }
*/
router.get('/:id/posts', validateUserId, (req, res) => {
  const { id } = req.params;

  Users.getUserPosts(id)
    .then(data => {
      data ? res.status(200).json(data) : null
    })
    .catch(err => {
      res.status(500).json({ error: 'You found me but I cannot provide any info, try again!', err })
    })
});


module.exports = router;

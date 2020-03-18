// 2. Build an API to let clients perform CRUD operations on users
// 3. Add endpoints to retrieve the list of posts for a user and to store a new post for a user
const express = require('express');
const router = express.Router();
const Users = require("./userDb.js");
const mw = require('../custom/middleware.js');
const validateUserId = mw.validateUserId;
const validateUser = mw.validateUser;
const validatePost = mw.validatePost;

// insert(): calling insert passing it a resource object will add it to the database and return the new resource
router.post('/', (req, res) => {
  Users.insert(req.body)
    .then(user => {
      res.status(201).json({ success: 'A New User has been created!', user })
    })
    .catch(err => {
      res.status(500).json({ error: 'I cannot provide any info from the inner server, try again!', err })
    })
});

// Route handler
// All array items with id & name got pulled in to Postman with GET request - without time stamp
// `get()`: calling find returns a promise that resolves to an array of all the `resources` contained in the database.
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


// `getById()`: takes an `id` as the argument and returns a promise that resolves to the `resource` with that id if found.
router.get('/:id', (req, res) => {
  const { id } = req.params;
  Users.getById(id)
    .then(user => {
      res.status(200).json(user)
    })
    .catch(err => {
      res.status(500).json({ error: 'I cannot provide any info from the inner server, try again!', err })
    })
});

// `remove()`: the remove method accepts an `id` as it's first parameter and, upon successfully deleting the `resource` from the database, returns the number of records deleted.
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
          res.status(500).json({ error: 'I cannot provide any info from the inner server, try again!', err })
        })
    });


// update(): accepts two arguments, the first is the id of the resource to update and the second is an object with the changes to apply. It returns the count of updated records. If the count is 1 it means the record was updated correctly
router.put('/:id', validateUserId, (req, res) => {
  const { id } = req.params

  Users.update(id, req.body) // two arguments: id + obj (req.body)
      .then(user => {
                      res
                        .status(200)
                        .json({ success: "Info Updated!", info: req.body }); // If the count is 1 it means the record was updated correctly
                    })
      .catch(err => {
        res.status(500).json({ error: 'I cannot provide any info from the inner server, try again!', err })
      })
    })


// Endponits beyond /:id

//  getById(): takes an id as the argument and returns a promise that resolves to the resource with that id if found.
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
      res.status(500).json({ error: 'I cannot provide any info from the inner server, try again!', err })
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
      res.status(500).json({ error: 'I cannot provide any info from the inner server, try again!', err })
    })
});

module.exports = router;

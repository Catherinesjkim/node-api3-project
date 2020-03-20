// 2. Build an API to let clients perform CRUD operations on users
// 3. Add endpoints to retrieve the list of posts for a user and to store a new post for a user
/*
    { name: 'Frodo Baggins' }, // 1
    { name: 'Samwise Gamgee' }, // 2
    { name: 'Meriadoc Brandybuck' }, // 3
    { name: 'Peregrin Took' }, // 4
    { name: 'Mithrandir' }, // 5
    { name: 'Boromir' }, // 6
    { name: 'Legolas' }, // 7
    { name: 'Gimli' }, // 8
    { name: 'Aragorn' }, // 9
*/
const express = require('express');
const router = express.Router();
const Users = require("./userDb.js");
const Posts = require("../posts/postDb");
const mw = require('../custom/middleware.js');
const validateUserId = mw.validateUserId;
const validateUser = mw.validateUser;
const validatePost = mw.validatePost;

// Route handler
// All array items with id & name got pulled in to Postman with GET request 
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

// insert(): calling insert passing it a resource object will add it to the database and return the new resource
router.post('/', validateUser, (req, res) => {
  Users.insert(req.body)
    .then(user => {
                    res
                      .status(201)
                      .json({ success: "A New User has been created!", user }); // worked on postman - was able to add a new user by adding a new name
                  })
    .catch(err => {
      res.status(500).json({ error: 'I cannot provide any info from the inner server, try again!', err })
    })
});
// Worked on postman

// `getById()`: takes an `id` as the argument and returns a promise that resolves to the `resource` with that id if found.
router.get('/:id', (req, res) => {
  const { id } = req.params;
  Users.getById(id)
    .then(user => {
      res.status(200).json(user) // Worked on postman
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
          }) // Worked on postman
          : null
        })
        .catch(err => {
          res.status(500).json({ error: 'I cannot provide any info from the inner server, try again!' })
        })
    });

// update(): accepts two arguments, the first is the id of the resource to update and the second is an object with the changes to apply. It returns the count of updated records. If the count is 1 it means the record was updated correctly
// Can't add the same name twice
router.put('/:id', validateUserId, (req, res) => {
  const { id } = req.params

  Users.update(id, req.body) // two arguments: id + obj (req.body)
      .then(user => {
                      res
                        .status(200) // worked on postman
                        .json({ success: "Info Updated!", info: req.body }); // If the count is 1 it means the record was updated correctly
                    })
      .catch(err => {
        res.status(500).json({ error: 'I cannot provide any info from the inner server, try again!', err })
      })
    })

// Endpoints beyond /:id

//  getById(): takes an id as the argument and returns a promise that resolves to the resource with that id if found.
router.post("/:id/posts", validateUserId, validatePost, (req, res) => {
  const { text } = req.body;
  const user_id = req.params.id;

  Users.getById(user_id)
    .then(post => {
      if (!post) { 
        null // do nothing in an if statement
      } else {
        let newPost = { // needs a regular if and else statement instead of ternary - edge case
          text, 
          user_id,
        }

        Posts.insert(newPost)
          .then(post => {
            res.status(201).json({ success: post }) // Worked on postman
        })
      }
    })
    .catch(err => {
      res.status(500).json({ error: 'I cannot provide any info from the inner server, try again!', err })
    })
});

router.get('/:id/posts', validateUserId, (req, res) => {
  const { id } = req.params;

  Users.getUserPosts(id)
    .then(data => {
      data ? res.status(200).json(data) : null // Worked on postman
    })
    .catch(err => {
      res.status(500).json({ error: 'I cannot provide any info from the inner server, try again!', err })
    })
});

module.exports = router;

/*
 {
      user_id: 1,
      text:
        'I wish the ring had never come to me. I wish none of this had happened.',
    },
    {
      user_id: 1,
      text: 'I think we should get off the road. Get off the road! Quick!',
    },
    { user_id: 1, text: 'Our business is our own.' },
    { user_id: 1, text: 'Can you protect me from yourself?' },
    { user_id: 2, text: "I ain't been droppin' no eaves, sir! Promise!" }, // 5
    { user_id: 2, text: "Of course you are, and I'm coming with you!" }, // 6
*/

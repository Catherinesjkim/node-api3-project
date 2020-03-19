/*
Posts
Field	 | Data Type	       |  Metadata
:---------------------------------------------------------------------------------
id	     unsigned integer     primary key, auto-increments, generated by database
text     text	                required
user_id	 unsigned integer     required, must be the id of an existing user
*/
const express = require('express');
const router = express.Router();
const Posts = require('./postDb');
const mw = require('../custom/middleware');
const validatePostId = mw.validatePostId;
const validatePost = mw.validatePost;

router.get('/', (req, res) => {
  Posts.get()
    .then(post => {
      res.status(200).json(post)
    })
    .catch(err => {
      res.status(500).json({ error: 'I cannot provide any info from the inner server, try agan!', err }) 
    })
});

// getById(): takes an id as the argument and returns a promise that resolves to the resource with that id if found.
router.get('/:id', validatePostId, (req, res) => {
  const { id } = req.params;
  Posts.getById(id)
    .then(post => {
      res.status(200).json(post)
    })
    .catch(err => {
      res.status(500).json({ error: "I cannot provide any info from the inner server, try again!", err })
    })
});

// remove(): the remove method accepts an id as it's first parameter and, upon successfully deleting the resource from the database, returns the number of records deleted.
router.delete('/:id', validatePostId, (req, res) => {
  const { id } = req.params;
  Posts.getById(id)
    .then(post => {
      post
        ? Posts.remove(id).then(deleted => {
          deleted ? res.status(200).json({ success: `Post ${id} was deleted!`, info: post }) : null
        }) 
        : null
    })
      .catch(err => {
        res.status(500).json({ error: 'I cannot provide any info from the inner server, try again!', err })
      })
});

// 
router.put('/:id', validatePostId, (req, res) => {
  const { id } = req.params;

  Posts.update(id, req.body)
    .then(post => {
      res.status(200).json({ success: 'Info Updated!', info: req.body })
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


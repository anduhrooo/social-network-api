const router = require('express').Router();
const User = require('../../models/User');

// GET all users
router.get('/', (req, res) => {
  User.find({})
    .then(dbUserData => res.json(dbUserData))
    .catch(err => {
      console.log(err);
      res.status(400).json(err);
    });
});

// Get request for single user by id
router.get('/:id', (req, res) => {
  User.findOne({ _id: req.params.id })
    .then(dbUserData => res.json(dbUserData))
    .catch(err => {
      console.log(err);
      res.status(400).json(err);
    });
});

// POST a new user
router.post('/', (req, res) => {
  User.create(req.body)
    .then(dbUserData => res.json(dbUserData))
    .catch(err => {
      console.log(err);
      res.status(400).json(err);
    });
});

// PUT to update a user by id
router.put('/:id', (req, res) => {
  User.findOneAndUpdate({ _id: req.params.id
    }, req.body
    , { new: true })
    .then(dbUserData => {
      if (!dbUserData) {
        res.status(404).json({ message: 'No user found with this id!'});
        return;
      }
      res.json(dbUserData);
    })
    .catch(err => {
      console.log(err);
      res.status(400).json(err);
    });
}
);

// DELETE to remove a user by id
router.delete('/:id', (req, res) => {
  User.findOneAndDelete({ _id: req.params.id })
    .then(dbUserData => {
      if (!dbUserData) {
        res.status(404).json({ message: 'No user found with this id!'});
        return;
      }
      res.json(dbUserData);
    })
    .catch(err => {
      console.log(err);
      res.status(400).json(err);
    });
}
);

// post request for users friends
router.post('/:userId/friends/:friendId', (req, res) => {
  User.findOneAndUpdate(
    { _id: req.params.userId },
    { $addToSet: { friends: req.params.friendId } },
    { new: true }
  )
    .then(dbUserData => {
      if (!dbUserData) {
        res.status(404).json({ message: 'No user found with this id!'});
        return;
      }
      res.json(dbUserData);
    })
    .catch(err => {
      console.log(err);
      res.status(400).json(err);
    });
}
);

// delete request for users friends
router.delete('/:userId/friends/:friendId', (req, res) => {
  User.findOneAndUpdate(
    { _id: req.params.userId },
    { $pull: { friends: req.params.friendId } },
    { new: true }
  )
    .then(dbUserData => res.json(dbUserData))
    .catch(err => {
      console.log(err);
      res.status(400).json(err);
    });
}
);


module.exports = router;
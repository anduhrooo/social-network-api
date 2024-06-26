const { Thought, User } = require('../../models');  
// const router = require('express').Router();
const router = require('express').Router();

// GET all thoughts
router.get('/', (req, res) => {
  Thought.find({})
    .then(result => res.json(result))
    .catch(err => {
      console.log(err);
      res.status(400).json(err);
    });
});

// Get request for single thought by id
router.get('/:id', (req, res) => {
  Thought.findOne({ _id: req.params.id })
  .populate({ path: 'reactions', select: '-__v' })
    .then(result => res.json(result))
    .catch(err => {
      console.log(err);
      res.status(400).json(err);
    });
});

// POST a new thought
router.post('/', (req, res) => {
  Thought.create(req.body)
    .then((result) => {
      return User.findOneAndUpdate(
        { _id: req.body.userId },
        { $push: { thoughts: result._id } },
        { new: true }
      );
    }
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

// PUT to update a thought by id
router.put('/:id', (req, res) => {
  Thought.findOneAndUpdate({ _id: req.params.id
    }, req.body
    , { new: true })
    .then(result => {
      if (!result) {
        res.status(404).json({ message: 'No thought found with this id!'});
        return;
      }
      res.json(result);
    })
    .catch(err => {
      console.log(err);
      res.status(400).json(err);
    });
}
);

// DELETE to remove a thought by id
router.delete('/:id', (req, res) => {
  Thought.findOneAndDelete({ _id: req.params.id })
    .then(result => {
      if (!result) {
        res.status(404).json({ message: 'No thought found with this id!'});
        return;
      }
      res.json(result);
    })
    .catch(err => {
      console.log(err);
      res.status(400).json(err);
    });
});

// post request for reactions      
router.post('/:thoughtId/reactions', (req, res) => {
  Thought.findOneAndUpdate(
    { _id: req.params.thoughtId },
    { $addToSet: { reactions: req.body } },
    { new: true }
  )
    .then(result => {
      if (!result) {
        res.status(404).json({ message: 'No thought found with this id!'});
        return;
      }
      res.json(result);
    })
    .catch(err => {
      console.log(err);
      res.status(400).json(err);
    });
});

// DELETE to remove a reaction by id
router.delete('/:thoughtId/reactions/:reactionId', (req, res) => {
  Thought.findOneAndUpdate(
    { _id: req.params.thoughtId },
    { $pull: { reactions: { reactionId: req.params.reactionId } } },
    { new: true }
  )
    .then(result => res.json(result))
    .catch(err => {
      console.log(err);
      res.status(400).json(err);
    });
});

module.exports = router;

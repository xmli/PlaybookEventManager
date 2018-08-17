const express = require('express');
const router = express.Router();

// Event model
const PlaybookItem = require('../../models/PlaybookItem');

// @route: GET api/items
// @desc: Get all items
// @access: Public
router.get('/', (req, res) => {
    PlaybookItem.find()
    .sort({ cardDueDate: 1 })
    .then(items => res.json(items))
});

// @route: POST api/items
// @desc: Create an item
// @access: Public
router.post('/', (req, res) => {
    const newItem = new PlaybookItem({
        cardTitle: req.body.cardTitle,
        cardImageUrl: req.body.cardImageUrl,
        cardLinkUrl: req.body.cardLinkUrl,
        cardDescription: req.body.cardDescription,
        cardDueDate: req.body.cardDueDate,
        cardDateAdded: req.body.cardDateAdded,
        cardDateLastModified: req.body.cardDateLastModified
    });

    newItem.save()
    .then(item => res.json(item));
});

// @route: DELETE api/items
// @desc: Delete an item
// @access: Public
router.delete('/:id', (req, res) => {
    PlaybookItem.findById(req.params.id)
    .then(item => item.remove().then(() => res.json({ success: true })))
    .catch(err => res.status(404).json({ success: false }));
});

module.exports = router;




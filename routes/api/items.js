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
        itemTitle: req.body.itemTitle,
        itemLinkUrl: req.body.itemLinkUrl,
        itemDescription: req.body.itemDescription,
        itemDueDate: req.body.itemDueDate,
        itemDateAdded: req.body.itemDateAdded,
        itemTags: req.body.itemTags,
        itemTasks: req.body.itemTasks,
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

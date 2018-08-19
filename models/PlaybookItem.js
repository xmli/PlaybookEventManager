const mongoose = require("mongoose");

const Schema = mongoose.Schema;

var itemTaskSchema = new Schema({
    itemTaskName: {
        type: String,
        required: true
    }, 
    itemTaskDueDate: {
        type: Date,
        required: true
    },
    itemTaskDateCompleted: {
        type: Date,
        default: null
    },
    itemTaskPriority: {
        type: Number,
        default: 1
    }
})

// Create schema
PlaybookItemSchema = new Schema({
    itemTitle: {
        type: String,
        required: true,
    },
    itemLinkUrl: {
        type: String,
        default: ""
    },
    itemDescription: {
        type: String,
        required: true,
    },
    itemDueDate: {
        type: Date,
        required: true
    },
    itemDateAdded: {
        type: Date,
        default: Date.now
    },
    itemTags: {
        type: Array,
        default: []
    },
    itemTasks: {
        type: [itemTaskSchema],
        default: []
    }
})

module.exports = PlaybookItem = mongoose.model('item', PlaybookItemSchema);
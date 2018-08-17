const mongoose = require("mongoose");

const Schema = mongoose.Schema;

// Create schema
PlaybookItemSchema = new Schema({
    cardTitle: {
        type: String,
        required: true,
    },
    cardImageUrl: {
        type: String,
        default: "https://cdn4.iconfinder.com/data/icons/computer-and-web/80/Computer_and_web_icons-01-512.png"
    },
    cardLinkUrl: {
        type: String,
        default: ""
    },
    cardDescription: {
        type: String,
        required: true,
    },
    cardDueDate: {
        type: Date,
        required: true
    },
    cardDateAdded: {
        type: Date,
        default: Date.now
    },
    cardDateLastModified: {
        type: Date,
        default: Date.now
    }
})

module.exports = PlaybookItem = mongoose.model('item', PlaybookItemSchema);
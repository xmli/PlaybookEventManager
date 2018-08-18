const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require('cors');

// Routes
const items = require('./routes/api/items')

// Set up express server
const app = express();

// Server configuration
app.use(cors());
app.use(bodyParser.json());


// Connect to mLab database
const db = encodeURI(require('./config/keys').mongoURI);


mongoose
    .connect( db, { useNewUrlParser: true })
    .then(() => console.log("MongoDB connected!"))
    .catch((err) => console.error(err));

// User routes handler
app.use('/api/items', items);

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server listening on port ${port}`));
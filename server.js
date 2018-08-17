const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const items = require('./routes/api/items')

const app = express();

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
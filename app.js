require("dotenv").config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const bodyParser = require('body-parser');  
const app = express();

app.use(morgan('tiny'));
app.use(bodyParser.json());
app.use(cors());
app.use(
    bodyParser.urlencoded({ extended: true })
);

// Root
app.get('/', (req, res) => {
    res.send(`Hello World from root! ${req.baseUrl}`);
});

// API path
const users = require('./routes/userRoutes');
const transcriptions = require('./routes/transcriptionRoutes');
app.use("/api/users", users);
app.use("/api/transcriptions", transcriptions);

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`🚀 Authorization Server running on ${port}...`);
});
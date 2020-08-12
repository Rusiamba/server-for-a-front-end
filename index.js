const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const passport = require('passport');
const path = require('path');
const config = require('./config/db');
const account = require('./routes/account');

const app = express();

const port = process.env.PORT || 80;

app.use(passport.initialize());
app.use(passport.session());

require('./config/passport')(passport);

app.use(cors());

app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, 'public')));

mongoose.connect('mongodb://localhost:27017/website', { useNewUrlParser: true, useUnifiedTopology: true });

mongoose.connect(config.db, { useNewUrlParser: true, useUnifiedTopology: true });

mongoose.connection.on('connected', () => {
	console.log("Connection to DB was success!");
});

mongoose.connection.on('error', (err) => {
	console.log("We don't was connection to DB: " + err);
});

app.get('/', (req, res) => {
    res.send('Home Page');
});

app.use('/account', account);

app.listen(port, () => {
    console.log("Server was started on" + " 3000 port");
});
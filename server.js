const express = require('express');
const server = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const errorhandler = require('errorhandler');
const morgan = require('morgan');
const apiRouter = require('./api/api');


const PORT = process.env.PORT || 4000;

server.use(bodyParser.json());
server.use(cors());
server.use(errorhandler());
//server.use(morgan('dev'));
server.use('/api', apiRouter);


















server.listen(PORT, () => {
  console.log('Listening on port: ' + PORT);
});

module.exports = server;



































module.exports = server;

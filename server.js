
const express = require('express');
const app = express();

const server_port = 3000

app.use(express.static('public'));

app.get('/', function (request, response ) {
  response.sendFile('home.html');
});

app.listen(server_port, function(){
  console.log("Listening on port 3000!")
});
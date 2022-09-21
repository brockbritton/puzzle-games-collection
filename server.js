
const express = require('express');
const app = express();
const server_port = 3000

app.use(express.static('public'));

app.get('/', function (request, response ) {
    response.sendFile('home.html', { root: './public/html' });
});

app.get('/sudoku', function (request, response ) {
    response.sendFile('sudoku.html', { root: './public/html' });
});

app.listen(server_port, function() {
    console.log(`server listening at: http://localhost:${server_port}/`)
});
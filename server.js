
const express = require('express');
const app = express();

app.use(express.static('public'));
app.set('trust proxy', true);

app.get('/', function (request, response ) {
    response.sendFile('home.html', { root: './public/html' });
});

app.get('/sudoku', function (request, response ) {
    response.sendFile('sudoku.html', { root: './public/html' });
});

app.get('/bingo', function (request, response ) {
    response.sendFile('bingo.html', { root: './public/html' });
});

app.get('/hangman', function (request, response ) {
    response.sendFile('hangman.html', { root: './public/html' });
});

const PORT = process.env.PORT || 4000; //8080
app.listen(PORT, function() {
    console.log(`server listening at: http://localhost:${PORT}/`)
});
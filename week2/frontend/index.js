const express = require('express');
const app = express();
const port = 8080;

app.get('/', (req, res) => {
    res.send('Haley Kuester');
});


app.listen(port, () => {
    console.log(`Port is listening at ${port}`);
});
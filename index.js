const express = require('express');
const app = express();
const port = 8080;

//basic express server to get my girlfriends name

app.get('/', (req, res) => {
    res.send('Haley Kuester');
});

//Start the Server
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
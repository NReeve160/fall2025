const express = require('express');
const app = express();
const port = 8080;

app.get('/frontend/script.js', requestAnimationFrame, res => {
    
})

app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});
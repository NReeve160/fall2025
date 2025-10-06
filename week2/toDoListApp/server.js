var express = require('express'),
    app = express(),
    port = process.env.PORT || 8080;

app.listen(port);

console.log(`To do list RESTful API server started on: ${port}`);
const express = require('express');

const app = express();

app.use(() => {
    console.log("Membuat server");
})

app.listen(4000);
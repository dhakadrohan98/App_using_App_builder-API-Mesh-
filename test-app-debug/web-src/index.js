const express = require('express');
const app = express();
const port = 3000;

app.post('/test', (req, res) => {
    res.send('Hello World, from express');
});

app.listen(port, () => console.log(`Hello world app listening on port ${port}!`))

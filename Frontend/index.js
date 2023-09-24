const express = require('express');
const app = express();
const port = 3000;
app.use(express.static('target'))

app.get('/', (req, res) => {
    res.sendFile('index.html', { root: './target' })
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
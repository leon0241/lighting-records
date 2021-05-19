const express = require('express')
const app = express()
const port = 3000

app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => {
   //send file index.html to user
   req.sendFile('index.html');
 });

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
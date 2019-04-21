// FileName: index.js

const express = require('express')
const apiRoutes = require("./api-routes")
const bodyParser = require('body-parser');

const port = process.env.PORT || 8080;

// Initialize the app
let app = express();
app.use(bodyParser.json());
app.use('/api', apiRoutes)

//app.use(bodyParser.urlencoded({ extended: true }));

// Send message for default URL
app.get('/', (req, res) => res.send('Hello World with Express'));

// app.post('/test', (req, res) => {
//     console.log(req.body);
//     console.log(req.body.userid);
//     console.log(req.body.username);
//     res.send(req.body)
// });

// Launch app to listen to specified port
app.listen(port, function () {
     console.log("Running RestHub on port " + port);
});
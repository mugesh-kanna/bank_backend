const express = require('express');
const cors = require("cors");
const bodyParser = require('body-parser');
const path = require('path');

const app = express ();

const BankRoutes = require('./api/routes/BankRoutes.js');

app.use(cors());


// // simple route
// app.get("/", (req, res) => {
//   res.setHeader('Access-Control-Allow-Origin','http://localhost:3000');// frond end origin
//   res.setHeader('Access-Control-Allow-Credentials', true);
//   res.setHeader('Access-Control-Allow-Methods','GET,POST,PUT,DELETE,PATCH');
//   res.setHeader('Access-Control-Allow-Headers','Content-Type ,Origin, X-Requested-With, Accept, Authorization');

//   // res.json({ message: "Welcome to Ilan Infotech" });
//   res.sendFile(path.join(__dirname, './api/dist/sample/index.html'));
//   // next();
// });

const PORT = process.env.PORT;

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json());

app.use(express.raw({ type: '*/*', limit: '10mb' }));

app.use('/api', BankRoutes);

// app.use(express.static(path.join(__dirname, './api/dist/sample')));

// Handle non-API routes
// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname, './api/dist/sample/index.html'));
// });

app.listen(PORT, () => {
    console.log("Server Listening on PORT:", PORT);
});
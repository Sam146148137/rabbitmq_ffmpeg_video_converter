const express = require('express');
const app = express();
require('dotenv').config();

const connectToDb = require('./util/db');
const convertRoutes = require('./modules/convert/endpoints');
const workerRoutes = require('./modules/worker/endpoints');

connectToDb();

app.use(express.json());

app.use('/', convertRoutes, workerRoutes);


const port = process.env.PORT;
app.listen(port, () => {
    console.log(`server started on port ${port}`);
});
const express = require('express');
const req = require('express/lib/request');
const app = express();

const path = require('node:path')
const dogs = require('./routes/dogs.js')

require('dotenv').config();

// app.use('/static', express.static(path.join(__dirname, 'assets')))
app.use('/static', express.static('assets'))
app.use(express.json())

app.use((req, res, next) => {
  console.log('Method: ', req.method)
  console.log('Path: ', req.path)
  res.on('finish', () => {
    console.log(res.statusCode)
  })
  next()
})

app.use('/dogs', dogs)

// For testing purposes, GET /
app.get('/', (req, res) => {
  res.json("Express server running. No content provided at root level. Please use another route.");
});

// For testing express.json middleware
app.post('/test-json', (req, res, next) => {
  // send the body as JSON with a Content-Type header of "application/json"
  // finishes the response, res.end()
  res.json(req.body);
  next();
});

// For testing express-async-errors
app.get('/test-error', async (req, res) => {
  throw new Error("Hello World!")
});

app.use((req, res, next) => {
  const err = new Error ("The requested resource couldn't be found.")
  err.statusCode = 404
  next(err)
})

app.use((err, req, res, next) => {
  console.log(err.message)
  res.json({
    message: "Something went wrong",
    statusCode: err.statusCode || 500,
    stack: err.stack
  })
  res.statusCode = err.statusCode
})

const port = 8000;
app.listen(port, () => console.log('Server is listening on port', port));

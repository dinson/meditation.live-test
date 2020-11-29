const express = require('express')
const bodyParser = require('body-parser')
require('dotenv').config()
const path = require('path');

// init mongo database
require('./config/db.js')

// create application/json parser
var jsonParser = bodyParser.json()
// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false })

const port = process.env.PORT || 3000
const app = express()

// controllers
const userViewController = require('./controllers/userView.controller')

/**
 * Middleware
 * CORS Policy
 */
app.use(function(req, res, next){

  res.setHeader("Access-Control-Allow-Origin", "*")
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization")
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS")

  next()
})

/** API ROUTES */
// get count of visitors
app.post('/visit/count', urlencodedParser, userViewController.getVisitCount)
// add log of visit
app.post('/visit/add', urlencodedParser, userViewController.addVisit)
/** END ROUTES */

/**
 * Frontend Static ROUTES
 */
// assets
app.get('/public/js/jquery.visit.js', function(req, res) {
  res.sendFile(path.join(__dirname + '/public/js/jquery.visit.js'));
});
app.get('/public/css/style.css', function(req, res) {
  res.sendFile(path.join(__dirname + '/public/css/style.css'));
});

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/views/index.html'));
});

app.listen(port, () => {
  console.log(`App listening at Port: ${port}`)
})
var express    = require('express');        // call express
var cors = require('cors');
var bodyParser  = require('body-parser');
var app        = express();                 // define our app using express
// var bodyParser = require('body-parser');

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors())

var scrapper = require('./scrapper');
var pagescrapper = require('./pagescrapper');

var port = process.env.PORT || 8090;        // set our port

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();              // get an instance of the express Router

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
    res.json({ message: 'hooray! welcome to our api!' });   
});

// more routes for our API will happen here

router.route('/scrapper')
    // get all the scrapper (accessed at GET http://localhost:8080/api/scrapper)
    .get(function(req, res) {
        console.log(req.query.key);
        scrapper.scrapFunc(req.query.key).then((resdata) => {
            res.json(resdata); 
        });
         
    });

router.route('/pagescrapper')
    // get all the scrapper (accessed at GET http://localhost:8080/api/scrapper)
    .post(function(req, res) {
        console.dir(req.body);
        pagescrapper.scrapFunc(req.body.url).then((resdata) => {
            res.json(resdata); 
        });
        // res.send("test");
    });

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);
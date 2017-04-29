const
    express = require('express'),
    MongoDAO = require('./mongoDAO'),
    bodyParser = require('body-parser');


var app = express();
app.use(bodyParser.json());

app.get('/storage/:collection', function (req, res) {
    MongoDAO.get(req.params.collection).then(function (result) {
        console.log('get result ' + JSON.stringify(result));
        res.status(200).send(result);
    }).catch(function (error) {
        sendError(res, error);
    });
});

app.post('/storage/:collection', function (req, res) {
    if (!req.body) { res.send(400, { msg: 'Invalid payload' }); return; }
    MongoDAO.save(req.params.collection, req.body).then(function () {
        res.status(200).send();
    }).catch(function (error) {
        sendError(res, error);
    });
});

function sendError(res, error) {
    res.status(400).send({ msg: error });
}

app.listen(3000, function () {
    console.log('API ready');
});


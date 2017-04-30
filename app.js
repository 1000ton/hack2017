const
    express = require('express'),
    MongoDAO = require('./mongoDAO'),
    bodyParser = require('body-parser'),
    cors = require('cors'),
    path = require('path');


var app = express();
app.use(cors())
app.use(bodyParser.json());

app.get('/', function(req, res){
    res.sendFile(path.join( __dirname + '/index.html'))
})

app.get('/storage/:collection', function (req, res) {
    MongoDAO.get(req.params.collection).then(function (result) {
        res.status(200).send(result);
    }).catch(function (error) {
        sendError(res, error);
    });
});

app.get('/storage/:collection/:id', function (req, res) {
    MongoDAO.getById(req.params.collection, req.params.id).then(function (result) {
        res.status(200).send(result);
    }).catch(function (error) {
        sendError(res, error);
    });
});

app.post('/storage/:collection', function (req, res) {
    if (!req.body) { res.send(400, { msg: 'Invalid payload' }); return; }
    MongoDAO.save(req.params.collection, req.body).then(function (result) {
        res.status(200).send(result);
    }).catch(function (error) {
        sendError(res, error);
    });
});

app.post('/storage/array/:collection', function(req, res) {
    var dataArray;
    var ids;
    if (!req.body) { res.send(400, { msg: 'Invalid payload' }); return; }
    if (!req.body.hasOwnProperty('dataArray')) { res.send(400, { msg: 'Invalid payload. Missing \"arrayData\" field' }); return; }
    else{ dataArray = req.body.dataArray;}

    MongoDAO.saveArray(req.params.collection, dataArray).then(function (result) {
        res.status(200).send(result);
    }).catch(function (error) {
        sendError(res, error);
    }); 
});

app.post('/storage/:collection/search', function (req, res) {
    if (!req.body) { res.send(400, { msg: 'Invalid payload' }); return; }
    MongoDAO.get(req.params.collection, req.body).then(function (result) {
        res.status(200).send(result);
    }).catch(function (error) {
        sendError(res, error);
    });
});

//  PUT /storage/MY_COLLECTION/{ID} 
app.put('/storage/:collection/:id', function (req, res) {
    if (!req.body) { res.send(400, { msg: 'Invalid payload' }); return; }
    MongoDAO.update(req.params.collection, req.params.id, req.body).then(function () {
        res.status(200).send();
    }).catch( function(error) {
        sendError(res, error)
    })
});

//  DELETE /storage/MY_COLLECTION/{ID} 
app.delete('/storage/:collection/:id', function (req, res) {
    if (!req.body) { res.send(400, { msg: 'Invalid payload' }); return; }
    MongoDAO.remove(req.params.collection, req.params.id, req.body).then(function () {
        res.status(200).send();
    }).catch( function(error) {
        sendError(res, error)
    })
});

function sendError(res, error) {
    res.status(400).send({ msg: error });
}

app.listen(3000, function () {
    console.log('API ready');
});


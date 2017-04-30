const
    Q = require('q');

var MongoClient = require('mongodb').MongoClient;

var URL_DB = 'mongodb://localhost:27017/space2017';


var connect = function () {
    return Q.promise(function (resolve, reject) {
        MongoClient.connect(URL_DB, function(err, db) {
            if (err) {
                reject(err);
            } else {
                resolve(db);
            }
        });
    });
};

exports.save = function (collection, data) {
    console.log('Inserting into collection ' + collection  + ' DATA: ' + JSON.stringify(data));
    return connect().then(function (db) {
        db.collection(collection).insertOne(data, function (error, result) {
            if (error) {
                return Q.reject(error);
            }
            db.close();
            return Q.fulfill(result);
        });
    });
};

exports.get = function (collection) {
    console.log('Getting data from collection ' + collection);
    return connect().then(function (db) {
        var cursor = db.collection(collection).find();
        var data = [];
        return Q.promise(function (resolve, reject) {
            cursor.each(function(error, doc) {
                if (error) {
                    reject(error);
                }
                if (doc) {
                    data.push(doc);
                } else {
                    db.close();
                    resolve(data);
                }
            });
        });
    });
};


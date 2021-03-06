const
    Q = require('q');

var MongoClient = require('mongodb').MongoClient,
    ObjectID = require('mongodb').ObjectID;

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
        data._id =  new ObjectID();
        return db.collection(collection).insertOne(data).then(function () {
            db.close();
            return Q.fulfill({_id: data._id});
        }).catch( function(error){
            return Q.reject(error)
        });
    });
};

exports.saveArray = function(collection, dataArray ){
    console.log('Inserting into collection ' + collection  + ' DATA: ' + JSON.stringify(dataArray));
    saveAll = function () {
        return Q.all(dataArray.map(function(element){
            return exports.save(collection, element)
        }));
    }
    return saveAll().catch(function(error){
        return Q.reject(error)
    });

}

exports.get = function (collection, criteria) {
    console.log('Getting data from collection ' + collection + ' with criteria ' + JSON.stringify(criteria));
    return connect().then(function (db) {
        var cursor = db.collection(collection).find(criteria);
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

exports.getById = function (collection, id) {
    return exports.get(collection, { _id: new ObjectID(id) }).then(function (data) {
        if (data.length === 0) {
            return Q.reject('Not found');
        }
        return Q.fulfill(data[0]);
    })
};


exports.update = function (collection, id , data) {
    console.log('Updating ' + id + 'into collection ' + collection  + ' DATA: ' + JSON.stringify(data));
    var idObj  = { _id: new ObjectID(id) }
    return connect().then(function (db) {
        db.collection(collection).update(idObj, {$set : data}, {upsert:true, multi:true }, function (error, result) {
            if (error) {
                return Q.reject(error);
            }
            db.close();
            return Q.fulfill(result);
        });
    });
};

exports.remove = function (collection, id , data) {
    console.log('Deleting ' + id + 'into collection ' + collection  + ' DATA: ' + JSON.stringify(data));
    var idObj  = { _id: new ObjectID(id) }
    return connect().then(function (db) {
        db.collection(collection).remove(idObj, {remove:true}, function (error, result) {
            if (error) {
                return Q.reject(error);
            }
            db.close();
            return Q.fulfill(result);
        });
    });
};
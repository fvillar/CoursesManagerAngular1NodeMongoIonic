var express = require('express');
var router = express.Router();

//////////////////////////////////
//          /authors            //
//////////////////////////////////

// MongoDB
var mongojs = require('mongojs');
var db = mongojs('mongodb://localhost/courses', ['unique', 'authors']);

router.get('/', function (req, res) {
    db.authors.find({}, function (err, authors) {
        res.send(authors);
    });
});

router.get('/:id', function (req, res) {
    db.authors.find({ Id: parseInt(req.params.id) }, function (err, author) {
        res.send(author);
    });
});

router.post('/', function (req, res) {

    var data = req.body;

    console.log('authors data', data);

    // Do an auto-increments
    db.unique.findAndModify({
        query: { type: 'authors' },
        update: { $inc: { id: 1 } },
        new: true
    }, function (err, v) {

        var saveAuthor = {
            '_id': mongojs.ObjectId(),
            'Id': v.id,
            'firstName': data.firstName,
            'lastName': data.lastName
        };

        db.authors.save(saveAuthor, function (err) {
            res.send({ status: true });
        });
    });
});


module.exports = router;
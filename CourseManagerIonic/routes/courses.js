var express = require('express');
var router = express.Router();

//////////////////////////////////
//          /courses            //
//////////////////////////////////

// MongoDB
var mongojs = require('mongojs');
var db = mongojs('mongodb://localhost/courses', ['courses', 'unique','authors']);

/* GET home page. */
router.get('/', function (req, res, next) {
    db.courses.find({ username: req.query.username }, function (err, courses) {
        res.send(courses);
    });
});

router.get('/:id', function (req, res) {
    db.courses.find({ Id: parseInt(req.params.id) }, function (err, courses) {
        res.send(courses);
    });
});

router.post('/', function (req, res) {

    var data = req.body;

    // Do an auto-increments
    db.unique.findAndModify({
        query: {type: 'courses'},
        update: { $inc: { id: 1 } },
        new: true
    }, function (err, v) {

        db.authors.findOne({ Id: parseInt(data.authorId) }, function (err, author) {

            var saveCourse = {
                '_id': mongojs.ObjectId(),
                'Id': v.id,
                'title': data.title,
                'authorName': author.firstName + ' ' + author.lastName,
                'authorId': parseInt(data.authorId),
                'length': data.length,
                'category': data.category,
                'username': data.username
            };

            db.courses.save(saveCourse, function (err) {
                res.send({ status: true });
            });
        });

    });

});

router.put('/:id', function (req, res) {

    db.courses.findOne({ Id: parseInt(req.params.id) }, function (err, course) {
        if (err) return err;
        else {
            if (req.body.title) course.title = req.body.title;
            if (req.body.authorId) course.authorId = req.body.authorId;
            if (req.body.authorName) course.authorName = req.body.authorName;
            if (req.body.length) course.length = req.body.length;
            if (req.body.category) course.category = req.body.category;
        }

        db.courses.save(course, function (err) {
            if (err) return err;
            res.send({ status: true });
        });

    });
});

router.delete('/:id', function (req, res) {
    db.courses.find({ Id: parseInt(req.params.id) }, function (err, course) {

        if (err) {
            console.log('ERROR on Delete Course - Cant find record');
        } else {
            db.courses.remove({ Id: parseInt(req.params.id) }, function (err) {
                if (err) return err;
                res.send(course[0]);
            });
        }
    });
});

module.exports = router;
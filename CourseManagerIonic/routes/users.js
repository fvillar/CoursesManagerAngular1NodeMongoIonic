var express = require('express');
var router = express.Router();

//////////////////////////////////
//          /users            //
//////////////////////////////////

// MongoDB
var mongojs = require('mongojs');
var db = mongojs('mongodb://localhost/courses', ['users']);

router.get('/', function (req, res, next) {
  db.users.find({}, function (err, users) {
    res.send(users);
  });
});

router.get('/login/:username', function (req, res) {
  db.users.find({ username: req.params.username }, function (err, user) {
    res.send(user);
  });
});

router.post('/', function (req, res) {

  var data = req.body;

  var saveUser = {
    'firstName': data.firstName,
    'lastName': data.lastName,
    'password': data.password,
    'username': data.username
  };

  db.users.save(saveUser, function (err) {
    res.send({ status: true });
  });
});


module.exports = router;

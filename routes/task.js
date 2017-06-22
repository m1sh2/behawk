var express = require('express');
var router = express.Router();

var Task = require('../models/task');

router.get('/', function(req, res, next) {
  Task.find()
    .exec(function(err, tasks) {
      if (err) {
        return res.status(500).json({
          title: 'An error occured',
          error: err
        });
      }

      res.status(200).json({
        message: 'Success',
        obj: tasks
      });
    });
});

router.post('/', function(req, res, next) {
  var task = new Task({
    name: req.body.name
  });
  task.save(function(err, result) {
    if (err) {
      return res.status(500).json({
        title: 'An error occured',
        error: err
      });
    }

    res.status(201).json({
      message: 'Saved task',
      obj: result
    });
  });
});

module.exports = router;
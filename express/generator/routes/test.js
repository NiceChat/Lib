var express = require('express');
var router = express.Router();

var config = {
  username: 'Yangleilei',
  node: 'node'
}
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('test', { config: config });
});

module.exports = router;

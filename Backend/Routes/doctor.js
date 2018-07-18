let express = require('express');
let router = express.Router();
let controller = require('../Controllers/docController');

router.post('^/register$', controller.Register);
router.post('^/login$', controller.Login);

//add middleware for all other functions


module.exports = router;
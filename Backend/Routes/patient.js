let express = require('express');
let router = express.Router();
let controller = require('../Controllers/patController');

router.post('^/register$', controller.Register);
router.post('^/login$', controller.Login);

//add middleware for all other functions

router.post('^/addRecords$', controller.AddRecords);
router.post('^/patDetails$', controller.getPatientDetails);
router.post('^/share$', controller.shareDetailsWithDoc);
module.exports = router;
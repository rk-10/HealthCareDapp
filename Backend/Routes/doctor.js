let express = require('express');
let router = express.Router();
let controller = require('../Controllers/docController');

router.post('^/register$', controller.Register);
router.post('^/login$', controller.Login);

//add middleware for all other functions

router.post('^/addRecords$', controller.AddRecords);
router.post('^/docDetails$', controller.getDoctorDetails);
router.post('^/patientDetails$', controller.getDoctorPatientDetails);
module.exports = router;
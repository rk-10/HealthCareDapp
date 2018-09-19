const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const controller = require('../controllers/patController');

router.post('^/register$', controller.Register);
router.post('^/login$', controller.Login);

//middleware
const auth = (req,res,next) => {
  const token = req.body.token || req.params.token || req.headers['x-access-token'];
  if(token) {
    jwt.verify(token, process.env.SECRETKEY, (err,decoded) => {
      if(err) {
        return res.status(401).json({
          status: false,
          message: "Not authorised"
        })
      }
      else {
        next();
      }
    })
  }
  else {
    res.status(400).json({
      status: false,
      message: 'Token not provided'
    })
  }
};

router.post('^/addRecords$', auth, controller.AddRecords);
router.post('^/patDetails$', auth, controller.getPatientDetails);
router.post('^/share$', auth, controller.shareDetailsWithDoc);


module.exports = router;
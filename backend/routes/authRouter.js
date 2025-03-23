const { googleLogin } = require('../controller/authController');

const router = require('express').Router();

// test route to check if srever is working 
router.get('/test', (req, res)=>{
    res.send('test pass');
})

// handles google auth routing 
router.get('/google', googleLogin)

module.exports = router;
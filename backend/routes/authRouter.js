import { googleLogin } from '../controller/authController.js';
import {register, login, checkAuth, logout} from '../controller/authController.js'
import { profileUpload } from '../utils/storage.js'


import {Router} from 'express'
import protect from './../utils/protect.js';

const router = Router();

// test route to check if srever is working 
router.get('/test', (req, res)=>{
    res.send('test pass');
})

// handles google auth routing 
router.get('/google', googleLogin)

router.post('/register', profileUpload.single('profile'), register);

router.post('/login', login)

router.get('/check-auth', protect, checkAuth)

router.get('/logout', logout);

export default router;
import express from 'express';
import userController from '../controllers/userController.js';
const router = express.Router(); 


router.get('/users/registeruser', userController.registerUsers);
router.get('/users/getuserdetails' ,userController.getUserDetails);
router.get('/users/getuserdetails/:pangeaId', userController.getUserDetailsbyPangeaId);

export default router; 
import express from 'express';
import fileuploadController from '../controllers/fileuploadContoller.js';
const router = express.Router(); 


router.post('/file/upload', fileuploadController.uploadMedicalRecord);
router.get('/file/document/:id' , fileuploadController.getPdf)
router.get('/file/document/user/:id' , fileuploadController.getRecords)

export default router; 
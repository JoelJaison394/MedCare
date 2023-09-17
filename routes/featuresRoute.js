import express from 'express';
import auditController from '../controllers/auditController.js';
const router = express.Router(); 


router.post('/auditlog', auditController.getauditDetails);

export default router; 
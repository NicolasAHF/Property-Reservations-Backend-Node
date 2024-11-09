import { Router } from 'express';
import * as clienteController from '../controllers/propertyController';

const router = Router();

router.get('/property', clienteController.getProperties);
router.get('/property/all', clienteController.getAllProperties);
router.post('/property', clienteController.createProperty);
router.get('/property/:id', clienteController.getProperty);
router.put('/property/:id', clienteController.updateProperty);
router.delete('/property/:id/:mail', clienteController.deleteProperty)
router.post('/unavailable', clienteController.createUnavailable)
router.delete('/unavailable/:id/:creator', clienteController.createUnavailable)
router.get('/unavailable/:id', clienteController.getAvailable)


export default router;

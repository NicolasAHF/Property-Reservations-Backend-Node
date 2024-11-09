import { Router } from 'express';
import { createCountryConfig, updateCountryConfig } from '../services/countryConfigService';

const router = Router();

router.post('/country-configs', createCountryConfig);
router.put('/country-configs', updateCountryConfig);

export default router;

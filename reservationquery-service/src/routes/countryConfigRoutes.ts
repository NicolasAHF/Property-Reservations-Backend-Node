import { Router } from 'express';
import { getCountryConfig} from '../services/countryConfigService';

const router = Router();

router.get('/country-configs', getCountryConfig);


export default router;

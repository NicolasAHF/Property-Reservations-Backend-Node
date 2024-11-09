import { Router } from 'express';
import { Request, Response} from 'express';
import { logger } from '../index';
import axios from 'axios';
import { authorize } from '../middlewares/authorize';

const router = Router();
const PROPERTY_SERVICE_URL = process.env.PROPERTY_SERVICE_URL;

router.get('/property', authorize(['Inquilino']), async (req, res) => {
    try {
      const propertiesResponse = await axios.get(`${PROPERTY_SERVICE_URL}/api/property`, req.body);
  
      res.status(200).json(propertiesResponse.data);
    } catch (error: any) {
      const status = error.response ? error.response.status : 500;
      const message = error.response?.data?.message || error.message;
      res.status(status).json({ message: message });
    }
});

router.get('/property/:id', authorize(['Inquilino']), async (req, res) => {
  try {
    const propertiesResponse = await axios.get(`${PROPERTY_SERVICE_URL}/api/property/${req.params.id}`, req.body);

    res.status(200).json(propertiesResponse.data);
  } catch (error: any) {
    const status = error.response ? error.response.status : 500;
    const message = error.response?.data?.message || error.message;
    res.status(status).json({ message: message });
  }
});

router.post('/property', authorize(['Propietario']), async (req, res) => {
    try {
      const user = (req as any).user;
      const ownerEmail = user.email;
  
  
      const propertyData = {
        ...req.body,
        ownerEmail: ownerEmail
      };
  
      const propertiesResponse = await axios.post(`${PROPERTY_SERVICE_URL}/api/property`, propertyData);
  
      res.status(201).json(propertiesResponse.data);
    } catch (error: any) {
      const status = error.response ? error.response.status : 500;
      const message = error.response?.data?.message || error.message;
      res.status(status).json({ message: message });
    }
});

router.put('/property/:id', authorize(['Propietario']), async (req, res) => {
  try {
    const user = (req as any).user;
    const ownerEmail = user.email;


    const propertyData = {
      ...req.body,
      ownerEmail: ownerEmail
    };

    const propertiesResponse = await axios.put(`${PROPERTY_SERVICE_URL}/api/property/${req.params.id}`, propertyData);

    res.status(200).json(propertiesResponse.data);
  } catch (error: any) {
    const status = error.response ? error.response.status : 500;
    const message = error.response?.data?.message || error.message;
    res.status(status).json({ message: message });
  }
});

router.delete('/property/:id/:mail', authorize(['Propietario']), async (req, res) => {
  try {

  axios.delete(`${PROPERTY_SERVICE_URL}/api/property/${req.params.id}/${req.params.mail}`);

    res.status(201).json(`Propiedad con id ${req.params.id} borrada con exito`);
  } catch (error: any) {
    const status = error.response ? error.response.status : 500;
    const message = error.response?.data?.message || error.message;
    res.status(status).json({ message: message });
  }
});


router.get('/unavailable/:id', authorize(['Inquilino']), async (req, res) => {
  try {
    const agendaResponse = await axios.get(`${PROPERTY_SERVICE_URL}/api/unavailable/${req.params.id}`);

    res.status(200).json(agendaResponse.data);
  } catch (error: any) {
    const status = error.response ? error.response.status : 500;
    const message = error.response?.data?.message || error.message;
    res.status(status).json({ message: message });
  }
});


router.post('/unavailable', authorize(['Propietario']), async (req, res) => {
    try {
        const user = (req as any).user;
        const ownerEmail = user.email;


        const dto = {
            ...req.body,
            creator: ownerEmail
        };

        const propertiesResponse = await axios.post(`${PROPERTY_SERVICE_URL}/api/unavailable`, dto);

        res.status(201).json(propertiesResponse.data);
    } catch (error: any) {
        const status = error.response ? error.response.status : 500;
        const message = error.response?.data?.message || error.message;
        res.status(status).json({ message: message });
    }
});

router.delete('/unavailable/:id/:creator', authorize(['Propietario']), async (req, res) => {
  try {

      await axios.delete(`${PROPERTY_SERVICE_URL}/api/unavailable/:id/:creator`);

      res.status(201).json("Agenda borrada con exito");
  } catch (error: any) {
      const status = error.response ? error.response.status : 500;
      const message = error.response?.data?.message || error.message;
      res.status(status).json({ message: message });
  }
});

export default router;
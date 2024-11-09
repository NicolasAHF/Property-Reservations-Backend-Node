import { Request, Response } from 'express';
import * as propertyService from '../services/propertyService';
import { getErrorMessage } from '../utils/handleError';

const winston = require('winston');

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    transports: [new winston.transports.File({
        filename: 'registry.log'
    })],
});

export const getAllProperties = async (req: Request, res: Response) => {
    try {

        const properties = await propertyService.getAllProperties();
        res.status(200).json(properties);

    } catch (error) {
        logger.info('Error getting property');
        res.status(400).json({ message: 'Error al obtener los Property', error: getErrorMessage(error) });
    }
};

export const getProperties = async (req: Request, res: Response) => {
    try {
        const filter = req.body;
        
        const page = req.query.page ? parseInt(req.query.page as string, 10) : 0;
        const size = req.query.size ? parseInt(req.query.size as string, 10) : 10;

        logger.info('Search property successfully');

        const clientes = await propertyService.getProperties(filter, page, size);
        res.status(200).json(clientes);

    } catch (error) {
        logger.info('Error Adding property');
        res.status(400).json({ message: 'Error al obtener los Property', error: getErrorMessage(error) });
    }
};

export const getProperty = async (req: Request, res: Response) => {
    try {
        const property = await propertyService.findPropertyById(parseInt(req.params.id));
        if (property) {
            logger.info('Displayed property successfully');
            res.json(property);
        } else {
            logger.info('Error displaying property, property not found');
            res.status(404).json({ message: 'Property no encontrado' });
        }
    } catch (error) {
        logger.info('Error displaying property, server error');
        res.status(400).json({ message: 'Error al buscar el Property', error: getErrorMessage(error) });
    }
};

export const createProperty = async (req: Request, res: Response) => {
    try {
        const cliente = await propertyService.createProperty(req.body);
        logger.info('Added property successfully');
        res.status(201).json(cliente);
    } catch (error: any) {
        logger.info('Error adding property, server error');
        res.status(400).json({ message: 'Error al crear el Property', error: getErrorMessage(error) });
    }
};

export const updateProperty = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const updated = await propertyService.updateProperty(parseInt(id), req.body);

        if (updated[0] === 1) {
            logger.info('Updated property successfully');
            res.status(200).json({ message: 'Property actualizado' });
        } else {
            logger.info('Error updating property, property not found');
            res.status(404).json({ message: 'Property no encontrado' });
        }
    } catch (error) {
        logger.info('Error updating property, server error');
        res.status(400).json({ message: 'Error al actualizar el Property', error: getErrorMessage(error)});
    }
};

export const deleteProperty = async (req: Request, res: Response) => {
    try {
        const { id, mail } = req.params;
        const deleted = await propertyService.deleteProperty(parseInt(id), mail);

        if (deleted === 1) {
            res.status(200).json({ message: 'Property deleted' });
        } else {
            logger.info('Error deleting property, property not found');
            res.status(404).json({ message: 'Property not found' });
        }
    } catch (error) {
        logger.info('Error deleting property, server error');
        res.status(400).json({ message: 'Error deleting property', error: getErrorMessage(error) });
    }
};

export const createUnavailable = async (req: Request, res: Response) => {
    try {
        const cliente = await propertyService.makeUnavailable(req.body);
        logger.info('Made unavailable');
        res.status(201).json(cliente);
    } catch (error: any) {
        logger.info('Error making unavailable, server error');
        res.status(400).json({ message: 'Error making unavailable', error: getErrorMessage(error) });
    }
};

export const deleteAvailable = async (req: Request, res: Response) => {
    try {
        const { id, creator } = req.params;
        const deleted = await propertyService.makeAvailable(parseInt(id), creator);

        if (deleted === 1) { // Sequelize delete devuelve el n�mero de filas afectadas
            res.status(200).json({ message: 'Made available' });
        } else {
            logger.info('Error making available, property not found');
            res.status(404).json({ message: 'Property not found' });
        }
    } catch (error) {
        logger.info('Error making available, server error');
        res.status(400).json({ message: 'Error making available', error: getErrorMessage(error) });
    }
};

export const getAvailable = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const clientes = await propertyService.getAvailable(parseInt(id));
        logger.info('getAvailable successfully');
        res.status(201).json(clientes);
    } catch (error) {
        logger.info('getAvailable property failed');
        res.status(400).json({ message: 'getAvailable property failed', error: getErrorMessage(error) });
    }
};
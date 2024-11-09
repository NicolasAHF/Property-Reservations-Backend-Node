import { Request, Response } from 'express';
import * as propertyService from '../../services/propertyService';
import * as propertyController from '../propertyController';
import { getErrorMessage } from '../../utils/handleError';

jest.mock('../../services/propertyService');
jest.mock('../../utils/handleError');
jest.mock('winston', () => ({
    createLogger: jest.fn().mockReturnValue({
        info: jest.fn(),
    }),
    format: {
        json: jest.fn(),
    },
    transports: {
        File: jest.fn(),
    },
}));

describe('Property Controller', () => {
    let req: Partial<Request>;
    let res: Partial<Response>;
    let jsonMock: jest.Mock;
    let statusMock: jest.Mock;

    beforeEach(() => {
        jsonMock = jest.fn();
        statusMock = jest.fn().mockReturnValue({ json: jsonMock });
        req = {
            body: {},
            params: {},
            query: {},
        };
        res = {
            status: statusMock,
        };
    });

    describe('getAllProperties', () => {
        it('should return all properties with status 200', async () => {
            const mockProperties = [{ id: 1 }, { id: 2 }];
            (propertyService.getAllProperties as jest.Mock).mockResolvedValue(mockProperties);

            await propertyController.getAllProperties(req as Request, res as Response);

            expect(statusMock).toHaveBeenCalledWith(200);
            expect(jsonMock).toHaveBeenCalledWith(mockProperties);
        });

        it('should handle error and return status 400', async () => {
            const mockError = new Error('Test error');
            (propertyService.getAllProperties as jest.Mock).mockRejectedValue(mockError);
            (getErrorMessage as jest.Mock).mockReturnValue('Test error message');

            await propertyController.getAllProperties(req as Request, res as Response);

            expect(statusMock).toHaveBeenCalledWith(400);
            expect(jsonMock).toHaveBeenCalledWith({ message: 'Error al obtener los Property', error: 'Test error message' });
        });
    });

    describe('getProperties', () => {
        it('should return filtered properties with status 200', async () => {
            const mockProperties = [{ id: 1 }, { id: 2 }];
            req.body = { filter: 'some filter' };
            req.query = { page: '1', size: '10' };
            (propertyService.getProperties as jest.Mock).mockResolvedValue(mockProperties);

            await propertyController.getProperties(req as Request, res as Response);

            expect(statusMock).toHaveBeenCalledWith(200);
            expect(jsonMock).toHaveBeenCalledWith(mockProperties);
        });

        it('should handle error and return status 400', async () => {
            const mockError = new Error('Test error');
            (propertyService.getProperties as jest.Mock).mockRejectedValue(mockError);
            (getErrorMessage as jest.Mock).mockReturnValue('Test error message');

            await propertyController.getProperties(req as Request, res as Response);

            expect(statusMock).toHaveBeenCalledWith(400);
            expect(jsonMock).toHaveBeenCalledWith({ message: 'Error al obtener los Property', error: 'Test error message' });
        });
    });

    describe('getProperty', () => {
        it('should return filtered properties with status 200', async () => {
            const mockProperties = [{ id: 1 }, { id: 2 }];
            req.body = { filter: 'some filter' };
            req.query = { page: '1', size: '10' };
            (propertyService.getProperties as jest.Mock).mockResolvedValue(mockProperties);

            await propertyController.getProperties(req as Request, res as Response);

            expect(statusMock).toHaveBeenCalledWith(200);
            expect(jsonMock).toHaveBeenCalledWith(mockProperties);
        });

        it('should return 404 if property not found', async () => {
            req.params = { id: '1' };
            (propertyService.findPropertyById as jest.Mock).mockResolvedValue(null);

            await propertyController.getProperty(req as Request, res as Response);

            expect(statusMock).toHaveBeenCalledWith(404);
            expect(jsonMock).toHaveBeenCalledWith({ message: 'Property no encontrado' });
        });

        it('should handle error and return status 400', async () => {
            const mockError = new Error('Test error');
            req.params = { id: '1' };
            (propertyService.findPropertyById as jest.Mock).mockRejectedValue(mockError);
            (getErrorMessage as jest.Mock).mockReturnValue('Test error message');

            await propertyController.getProperty(req as Request, res as Response);

            expect(statusMock).toHaveBeenCalledWith(400);
            expect(jsonMock).toHaveBeenCalledWith({ message: 'Error al buscar el Property', error: 'Test error message' });
        });
    });

    describe('createProperty', () => {
        it('should create a property and return status 201', async () => {
            const mockProperty = { id: 1 };
            req.body = { name: 'Test Property' };
            (propertyService.createProperty as jest.Mock).mockResolvedValue(mockProperty);

            await propertyController.createProperty(req as Request, res as Response);

            expect(statusMock).toHaveBeenCalledWith(201);
            expect(jsonMock).toHaveBeenCalledWith(mockProperty);
        });

        it('should handle error and return status 400', async () => {
            const mockError = new Error('Test error');
            req.body = { name: 'Test Property' };
            (propertyService.createProperty as jest.Mock).mockRejectedValue(mockError);
            (getErrorMessage as jest.Mock).mockReturnValue('Test error message');

            await propertyController.createProperty(req as Request, res as Response);

            expect(statusMock).toHaveBeenCalledWith(400);
            expect(jsonMock).toHaveBeenCalledWith({ message: 'Error al crear el Property', error: 'Test error message' });
        });
    });

    describe('updateProperty', () => {
        it('should update a property and return status 200', async () => {
            req.params = { id: '1' };
            req.body = { name: 'Updated Property' };
            (propertyService.updateProperty as jest.Mock).mockResolvedValue([1]);

            await propertyController.updateProperty(req as Request, res as Response);

            expect(statusMock).toHaveBeenCalledWith(200);
            expect(jsonMock).toHaveBeenCalledWith({ message: 'Property actualizado' });
        });

        it('should return 404 if property not found', async () => {
            req.params = { id: '1' };
            req.body = { name: 'Updated Property' };
            (propertyService.updateProperty as jest.Mock).mockResolvedValue([0]);

            await propertyController.updateProperty(req as Request, res as Response);

            expect(statusMock).toHaveBeenCalledWith(404);
            expect(jsonMock).toHaveBeenCalledWith({ message: 'Property no encontrado' });
        });

        it('should handle error and return status 400', async () => {
            const mockError = new Error('Test error');
            req.params = { id: '1' };
            req.body = { name: 'Updated Property' };
            (propertyService.updateProperty as jest.Mock).mockRejectedValue(mockError);
            (getErrorMessage as jest.Mock).mockReturnValue('Test error message');

            await propertyController.updateProperty(req as Request, res as Response);

            expect(statusMock).toHaveBeenCalledWith(400);
            expect(jsonMock).toHaveBeenCalledWith({ message: 'Error al actualizar el Property', error: 'Test error message' });
        });
    });

    describe('deleteProperty', () => {
        it('should delete a property and return status 200', async () => {
            req.params = { id: '1', mail: 'test@mail.com' };
            (propertyService.deleteProperty as jest.Mock).mockResolvedValue(1);

            await propertyController.deleteProperty(req as Request, res as Response);

            expect(statusMock).toHaveBeenCalledWith(200);
            expect(jsonMock).toHaveBeenCalledWith({ message: 'Property deleted' });
        });

        it('should return 404 if property not found', async () => {
            req.params = { id: '1', mail: 'test@mail.com' };
            (propertyService.deleteProperty as jest.Mock).mockResolvedValue(0);

            await propertyController.deleteProperty(req as Request, res as Response);

            expect(statusMock).toHaveBeenCalledWith(404);
            expect(jsonMock).toHaveBeenCalledWith({ message: 'Property not found' });
        });

        it('should handle error and return status 400', async () => {
            const mockError = new Error('Test error');
            req.params = { id: '1', mail: 'test@mail.com' };
            (propertyService.deleteProperty as jest.Mock).mockRejectedValue(mockError);
            (getErrorMessage as jest.Mock).mockReturnValue('Test error message');

            await propertyController.deleteProperty(req as Request, res as Response);

            expect(statusMock).toHaveBeenCalledWith(400);
            expect(jsonMock).toHaveBeenCalledWith({ message: 'Error deleting property', error: 'Test error message' });
        });
    });

    describe('createUnavailable', () => {
        it('should make a property unavailable and return status 201', async () => {
            const mockProperty = { id: 1 };
            req.body = { propertyId: 1 };
            (propertyService.makeUnavailable as jest.Mock).mockResolvedValue(mockProperty);

            await propertyController.createUnavailable(req as Request, res as Response);

            expect(statusMock).toHaveBeenCalledWith(201);
            expect(jsonMock).toHaveBeenCalledWith(mockProperty);
        });

        it('should handle error and return status 400', async () => {
            const mockError = new Error('Test error');
            req.body = { propertyId: 1 };
            (propertyService.makeUnavailable as jest.Mock).mockRejectedValue(mockError);
            (getErrorMessage as jest.Mock).mockReturnValue('Test error message');

            await propertyController.createUnavailable(req as Request, res as Response);

            expect(statusMock).toHaveBeenCalledWith(400);
            expect(jsonMock).toHaveBeenCalledWith({ message: 'Error making unavailable', error: 'Test error message' });
        });
    });

    describe('deleteAvailable', () => {
        it('should make a property available and return status 200', async () => {
            req.params = { id: '1', creator: 'creator@mail.com' };
            (propertyService.makeAvailable as jest.Mock).mockResolvedValue(1);

            await propertyController.deleteAvailable(req as Request, res as Response);

            expect(statusMock).toHaveBeenCalledWith(200);
            expect(jsonMock).toHaveBeenCalledWith({ message: 'Made available' });
        });

        it('should return 404 if property not found', async () => {
            req.params = { id: '1', creator: 'creator@mail.com' };
            (propertyService.makeAvailable as jest.Mock).mockResolvedValue(0);

            await propertyController.deleteAvailable(req as Request, res as Response);

            expect(statusMock).toHaveBeenCalledWith(404);
            expect(jsonMock).toHaveBeenCalledWith({ message: 'Property not found' });
        });

        it('should handle error and return status 400', async () => {
            const mockError = new Error('Test error');
            req.params = { id: '1', creator: 'creator@mail.com' };
            (propertyService.makeAvailable as jest.Mock).mockRejectedValue(mockError);
            (getErrorMessage as jest.Mock).mockReturnValue('Test error message');

            await propertyController.deleteAvailable(req as Request, res as Response);

            expect(statusMock).toHaveBeenCalledWith(400);
            expect(jsonMock).toHaveBeenCalledWith({ message: 'Error making available', error: 'Test error message' });
        });
    });

    describe('getAvailable', () => {
        it('should return available properties with status 201', async () => {
            const mockProperties = [{ id: 1 }, { id: 2 }];
            req.params = { id: '1' };
            (propertyService.getAvailable as jest.Mock).mockResolvedValue(mockProperties);

            await propertyController.getAvailable(req as Request, res as Response);

            expect(statusMock).toHaveBeenCalledWith(201);
            expect(jsonMock).toHaveBeenCalledWith(mockProperties);
        });

        it('should handle error and return status 400', async () => {
            const mockError = new Error('Test error');
            req.params = { id: '1' };
            (propertyService.getAvailable as jest.Mock).mockRejectedValue(mockError);
            (getErrorMessage as jest.Mock).mockReturnValue('Test error message');

            await propertyController.getAvailable(req as Request, res as Response);

            expect(statusMock).toHaveBeenCalledWith(400);
            expect(jsonMock).toHaveBeenCalledWith({ message: 'getAvailable property failed', error: 'Test error message' });
        });
    });
});
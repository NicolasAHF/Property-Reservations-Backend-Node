import { findPropertyById, createProperty, updateProperty, deleteProperty, getProperties, makeUnavailable, makeAvailable, getAvailable } from '../propertyService';
import { PropertyDto } from '../../dtos/PropertyDto';
import { UnavailableDto } from '../../dtos/UnavailableDto';
import { Property } from '../../data-access/Property';
import { Image } from '../../data-access/Image';
import { Unavailable } from '../../data-access/Unavailability';

jest.mock('../../data-access/Image')
jest.mock('../../data-access/Unavailability')
jest.mock('../../data-access/Property', () => {
  const SequelizeMock = require('sequelize-mock');
  const dbMock = new SequelizeMock();

  const Property = dbMock.define('Property', {
    id: 1,
    name: 'Test Property',
    adultsQuantity: 2,
    childrenQuantity: 2,
    doubleBeds: 1,
    simpleBeds: 2,
    ac: true,
    wifi: true,
    garaje: true,
    type: 1,
    beachDistance: 500,
    state: 'RS',
    balneario: 'Test Balneario',
    neighborhood: 'Test Neighborhood',
    ownerEmail: 'test@example.com'
  });

  const Image = dbMock.define('Image', {
    id: 1,
    url: 'img1.jpg',
    propertyId: 1
  });

  const Unavailable = dbMock.define('Unavailable', {
    id: 1,
    from: new Date(),
    to: new Date(),
    creator: 'test@example.com',
    propertyId: 1
  });

  Property.hasMany(Image, { foreignKey: 'propertyId' });
  Image.belongsTo(Property, { foreignKey: 'propertyId' });
  Property.hasMany(Unavailable, { foreignKey: 'propertyId' });
  Unavailable.belongsTo(Property, { foreignKey: 'propertyId' });

  return {
    Property,
    Image,
    Unavailable
  };
});

describe('PropertyService', () => {
  describe('findPropertyById', () => {
    it('should find property by id', async () => {
      const mockProperty = { id: 1, name: 'Test Property' };
      Property.findByPk = jest.fn().mockResolvedValue(mockProperty);

      const property = await findPropertyById(1);

      expect(Property.findByPk).toHaveBeenCalledWith(1);
      expect(property).toEqual(mockProperty);
    });
  });

  describe('createProperty', () => {
    it('should create property and images', async () => {
      const mockDto: PropertyDto = {
        name: 'Test Property',
        adultsQuantity: 2,
        childrenQuantity: 2,
        doubleBeds: 1,
        simpleBeds: 2,
        ac: true,
        wifi: true,
        garaje: true,
        type: 2,
        beachDistance: 500,
        state: 'RS',
        balneario: 'Test Balneario',
        neighborhood: 'Test Neighborhood',
        ownerEmail: 'test@example.com',
        images: ['img1.jpg', 'img2.jpg', 'img3.jpg', 'img4.jpg']
      };

      const mockProperty = { id: 1, ...mockDto };
      Property.create = jest.fn().mockResolvedValue(mockProperty);
      Image.bulkCreate = jest.fn().mockResolvedValue(mockDto.images.map(url => ({ url, propertyId: 1 })));
      Property.findByPk = jest.fn().mockResolvedValue({ ...mockProperty, Images: mockDto.images });

      const propertyWithImages = await createProperty(mockDto);

      expect(Property.create).toHaveBeenCalledWith(expect.objectContaining(mockDto));
      expect(Image.bulkCreate).toHaveBeenCalledWith(expect.arrayContaining(mockDto.images.map(url => ({ url, propertyId: 1 }))));
      expect(propertyWithImages).toEqual(expect.objectContaining({ Images: mockDto.images }));
    });
  });

  describe('updateProperty', () => {
    it('should update property', async () => {
      const mockDto: PropertyDto = {
        name: 'Updated Property',
        adultsQuantity: 3,
        childrenQuantity: 1,
        doubleBeds: 2,
        simpleBeds: 1,
        ac: false,
        wifi: true,
        garaje: false,
        type: 1,
        beachDistance: 200,
        state: 'SC',
        balneario: 'Updated Balneario',
        neighborhood: 'Updated Neighborhood',
        ownerEmail: 'updated@example.com',
        images: ['img1.jpg', 'img2.jpg','img3.jpg', 'img4.jpg']
      };

      Property.update = jest.fn().mockResolvedValue([1]);

      const result = await updateProperty(1, mockDto);

      expect(Property.update).toHaveBeenCalledWith(mockDto, { where: { id: 1 } });
      expect(result).toEqual([1]);
    });
  });

  describe('deleteProperty', () => {
    it('should delete property', async () => {
      Property.destroy = jest.fn().mockResolvedValue(1);

      const result = await deleteProperty(1, 'test@example.com');

      expect(Property.destroy).toHaveBeenCalledWith({ where: { id: 1, ownerEmail: 'test@example.com' } });
      expect(result).toBe(1);
    });
  });

  describe('getProperties', () => {
    it('should get properties with filters and pagination', async () => {
      const mockProperties = [{ id: 1, name: 'Property 1' }, { id: 2, name: 'Property 2' }];
      const mockDto = { adultsQuantity: 2 };
      Property.findAll = jest.fn().mockResolvedValue(mockProperties);

      const result = await getProperties(mockDto, 0, 10);

      expect(Property.findAll).toHaveBeenCalled();
      expect(result.items.length).toBeGreaterThan(0);
    });
  });

  describe('makeUnavailable', () => {
    it('should create unavailable record', async () => {
      const mockDto: UnavailableDto = {
        from: new Date(),
        to: new Date(),
        creator: 'test@example.com',
        propertyId: 1
      };

      Unavailable.findAll = jest.fn().mockResolvedValue([]);
      Unavailable.create = jest.fn().mockResolvedValue(mockDto);

      const result = await makeUnavailable(mockDto);

      expect(Unavailable.findAll).toHaveBeenCalledWith(expect.objectContaining({ where: expect.any(Object) }));
      expect(Unavailable.create).toHaveBeenCalledWith(expect.objectContaining(mockDto));
      expect(result).toEqual(mockDto);
    });
  });

  describe('makeAvailable', () => {
    it('should delete unavailable record', async () => {
      Unavailable.findAll = jest.fn().mockResolvedValue([{}]);
      Unavailable.destroy = jest.fn().mockResolvedValue(1);

      const result = await makeAvailable(1, 'test@example.com');

      expect(Unavailable.findAll).toHaveBeenCalledWith({ where: { id: 1, creator: 'test@example.com' } });
      expect(Unavailable.destroy).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(result).toBe(1);
    });
  });

  describe('getAvailable', () => {
    it('should get available property by id', async () => {
      const mockProperty = { id: 1, name: 'Test Property', Unavailables: [] };
      Property.findAll = jest.fn().mockResolvedValue([mockProperty]);

      const result = await getAvailable(1);

      expect(Property.findAll).toHaveBeenCalledWith({ where: { id: 1 }, include: Unavailable });
      expect(result).toEqual([mockProperty]);
    });
  });
});
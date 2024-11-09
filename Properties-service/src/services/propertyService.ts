import { Property } from '../data-access/Property';
import { PropertyDto } from '../dtos/PropertyDto';
import { UnavailableDto } from '../dtos/UnavailableDto';
import { Unavailable } from '../data-access/Unavailability';
import { Op} from 'sequelize';
import { Pipe } from '../Pipeline/Pipeline';
import { AdultsQuantityFilter } from '../filters/adultsQuantityFilter';
import { ChildrenQuantityFilter } from '../filters/childrenQuantityFilter';
import { DoubleBedsFilter } from '../filters/doubleBedsFilter';
import { SimpleBedsFilter } from '../filters/simpleBedsFilter';
import { TypeFilter } from '../filters/typeFilter';
import { BeachDistanceFilter } from '../filters/beachDistanceFilter';
import { ACValidator, AdultsQuantityValidator, BalnearioValidator, BeachDistanceValidator, ChildrenQuantityValidator, DoubleBedsValidator, GarajeValidator, ImagesValidator, NameValidator, NeighborhoodValidator, SimpleBedsValidator, StateValidator, TypeValidator } from '../filters/propertyValidators';
import { ValidatorPipe } from '../Pipeline/validatorPipeline';
import { Image } from '../data-access/Image';
import { ACFilter } from '../filters/ACFilter';
import { GarageFilter } from '../filters/garageFilter';
import { StateFilter } from '../filters/stateFilter';
import { BalnearioFilter } from '../filters/balnearioFilter';
import { WifiFilter } from '../filters/wifiFilter';



export const findPropertyById = async (id: number) => {
  return await Property.findByPk(id);
};

export const createProperty = async (dto: PropertyDto) => {
    const validators = [
      new NameValidator(),
      new AdultsQuantityValidator(),
      new ChildrenQuantityValidator(),
      new DoubleBedsValidator(),
      new SimpleBedsValidator(),
      new TypeValidator(),
      new BeachDistanceValidator(),
      new ACValidator(),
      new GarajeValidator(),
      new StateValidator(),
      new BalnearioValidator(),
      new NeighborhoodValidator(),
      new ImagesValidator()
    ];

    const validatorPipe = new ValidatorPipe(validators);

    validatorPipe.validate(dto);

    console.log(dto)

    const property = await Property.create({
        name: dto.name,
        adultsQuantity: dto.adultsQuantity,
        childrenQuantity: dto.childrenQuantity,
        doubleBeds: dto.doubleBeds,
        simpleBeds: dto.simpleBeds,
        ac: dto.ac,
        wifi: dto.wifi,
        garaje: dto.garaje,
        type: dto.type,
        beachDistance: dto.beachDistance,
        state: dto.state,
        balneario: dto.balneario,
        neighborhood: dto.neighborhood,
        ownerEmail: dto.ownerEmail
    });

    const images = dto.images.map((url: string) => ({ url, propertyId: property.get('id') }));
    await Image.bulkCreate(images);

    const propertyWithImages = await Property.findByPk(property.getDataValue('id'), { include: [Image] });

    return propertyWithImages;

};

export const updateProperty = async (id: number, propertyDto: PropertyDto) => {
    if (!propertyDto) throw Error("Dto vacío");
    return await Property.update(propertyDto, { where: { id } });
};

export const deleteProperty = async (id: number, ownerEmail: string) => {
    return await Property.destroy({ where: { id, ownerEmail } });
};

export const getAllProperties = async () => {
    return await Property.findAll();
};

export const getProperties = async (propertyDto: any, page: number = 0, size: number = 10) => {
    const filters = [
        new AdultsQuantityFilter(),
        new ChildrenQuantityFilter(),
        new DoubleBedsFilter(),
        new SimpleBedsFilter(),
        new TypeFilter(),
        new BeachDistanceFilter(),
        new ACFilter(),
        new GarageFilter(),
        new StateFilter(),
        new BalnearioFilter(),
        new WifiFilter()
    ];

    const pipe = new Pipe(filters);

    let properties;

    if (!propertyDto.from || !propertyDto.to) {
        properties = await Property.findAll({
            include: [
                {
                    model: Unavailable,
                    required: false,
                    where: {
                        from: {
                            [Op.lte]: new Date(new Date().setDate(new Date().getDate() + 30))
                        },
                        to: {
                            [Op.gte]: new Date()
                        }
                    }
                },
                {
                    model: Image,
                    required: false,
                    attributes: ['url']
                }
            ]
        });
    } else {
        properties = await Property.findAll({
            include: [
                {
                    model: Unavailable,
                    required: true,
                    where: {
                        [Op.or]: [
                            {
                                from: {
                                    [Op.gte]: propertyDto.from,
                                    [Op.lte]: propertyDto.to
                                }
                            },
                            {
                                to: {
                                    [Op.gte]: propertyDto.from,
                                    [Op.lte]: propertyDto.to
                                }
                            },
                            {
                                [Op.and]: [
                                    { from: { [Op.lte]: propertyDto.from } },
                                    { to: { [Op.gte]: propertyDto.to } }
                                ]
                            }
                        ]
                    }
                },
                {
                    model: Image,
                    required: false,
                    attributes: ['url']
                }
            ]
        });
    }

    const filteredProperties = pipe.process(properties, propertyDto);

    const availableFilteredProperties = filteredProperties.filter(res =>
        Array.isArray(res.Unavailables) && res.Unavailables.length > 0
    );

    const totalItems = availableFilteredProperties.length;
    const totalPages = Math.ceil(totalItems / size);
    const currentPage = Math.max(0, Math.min(page, totalPages - 1));
    const start = currentPage * size;
    const end = Math.min(start + size, totalItems);

    const paginatedProperties = availableFilteredProperties.slice(start, end);

    const results = paginatedProperties.map(property => ({
        ...property.get()
    }));

    return {
        totalItems: totalItems,
        items: results,
        totalPages: totalPages,
        currentPage: currentPage
    };
};

  export const makeUnavailable = async (dto: UnavailableDto) => {
    if (!dto) throw new Error("Dto vacío");

    const overlappingAvailables = await Unavailable.findAll({
        where: {
            propertyId: dto.propertyId,
            [Op.or]: [
                {
                    from: {
                        [Op.gte]: dto.from,
                        [Op.lte]: dto.to
                    }
                },
                {
                    to: {
                        [Op.gte]: dto.from,
                        [Op.lte]: dto.to
                    },
                    [Op.and]: [
                        {
                            from: {
                                [Op.lte]: dto.from
                            }
                        },
                        {
                            to: {
                                [Op.gte]: dto.to
                            }
                        }
                    ]
                }
            ]
        }
    });

    if (overlappingAvailables.length > 0) {
        throw new Error("Hay registros en la fecha");
    }

    const unavailable = await Unavailable.create({
        from: dto.from,
        to: dto.to,
        creator: dto.creator,
        propertyId: dto.propertyId
    });

    return unavailable;
};

export const makeAvailable = async (id: number, creator: string ) => {
    if ((await Unavailable.findAll({
        where: {
            id: id,
            creator: creator 
        }
    })).length === 0) throw Error("No se puede eliminar")
    return await Unavailable.destroy({ where: { id } });
};

export const getAvailable = async (id: number) => {
    return  await Property.findOne({
        where: { id },
        include: [{ model: Unavailable }]
      });
};


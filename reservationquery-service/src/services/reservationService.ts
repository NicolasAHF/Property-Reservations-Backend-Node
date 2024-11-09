import { Request, Response } from 'express';
import Reservation from '../models/Reservation';
import errorHandler from '../utils/errorHandler';
import axios from 'axios';
import CacheModule from '../utils/cacheModule';
import { DateRangeFilter } from '../filters/dateRangeFilter';
import { PropertyCodeFilter } from '../filters/propertyCodeFilter';
import { EmailFilter } from '../filters/emailFilter';
import { StatusFilter } from '../filters/statusFilter';
import {Pipe} from '../Pipeline/Pipeline';

const cache = new CacheModule();

export const getReservationDetails = async (req: Request, res: Response) => {
    const { email, reservationCode } = req.query;
  
    try {
      let reservation;

      reservation = await cache.get(`reservation-${reservationCode}`);

      const userResponse = await axios.get(`${process.env.USERS_SERVICE_URL}/users`, {
        params: { email: email }
      });
      const user = userResponse.data;

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      if(reservation){

        reservation = JSON.parse(reservation);

        const userEmail = reservation.email;
    
        if (user.email !== userEmail) {
          return res.status(403).json({ message: 'Reservation does not belong to the user' });
        }
        res.status(200).json(reservation);
      }else{
        
        reservation = await Reservation.findOne({
          where: {
            id: reservationCode
          }
        });
    
        if (!reservation) {
          return res.status(404).json({ message: 'Reservation not found' });
        }
    
        const userEmail = reservation.get('email');
    
        if (user.email !== userEmail) {
          return res.status(403).json({ message: 'Reservation does not belong to the user' });
        }

        await cache.set(`reservation-${reservationCode}`, JSON.stringify(reservation), 3600)
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(reservation);
      }
    } catch (error: any) {
      errorHandler(error, req, res);
    }
  };


const pipeline = new Pipe([
  new DateRangeFilter(),
  new PropertyCodeFilter(),
  new EmailFilter(),
  new StatusFilter(),
]);

export const getReservations = async (req: Request, res: Response) => {
  const { name, surname, propertyId} = req.query

  try {
    let reservations = await Reservation.findAll();

    if (propertyId) {
      const propertyIdString = String(propertyId);
      reservations = reservations.filter(reservation => reservation.get('propertyId') === propertyIdString);
    }

    if (name || surname) {
      const userResponse = await axios.get(`${process.env.USERS_SERVICE_URL}/users`, {
        params: { name: name, surname: surname }
      });
      const users = userResponse.data;
      const emails = users.map((user: any) => user.email);
      reservations = reservations.filter(reservation => emails.includes(reservation.get('email')));
    }

    const filteredReservations = pipeline.process(reservations, req.query)


    res.status(200).json(filteredReservations);
  } catch (error: any) {
    errorHandler(error, req, res);
  }
};

export const getRentalIncome = async (req: Request, res: Response) => {
  const { propertyId, startDate, endDate } = req.query;

  try {
    if (!propertyId || !startDate || !endDate) {
      return res.status(400).json({ message: 'propertyId, startDate y endDate son requeridos' });
    }

    if (typeof startDate !== 'string' || typeof endDate !== 'string') {
      return res.status(400).json({ message: 'startDate y endDate son requeridos y deben ser strings' });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    const property = (await axios.get(`${process.env.PROPERTY_SERVICE_URL}/api/property/${propertyId}`)).data;

    const reservations: any = await Reservation.findAll({
      where: {
        propertyId
      }
    });

    reservations.filter((reservation: { get: (arg0: string) => string | number | Date; }) =>
      new Date(reservation.get('startDate')) >= start &&
      new Date(reservation.get('endDate')) <= end
    );

    const totalIncome = reservations.reduce((acc: number, reservation: { price: string; }) => acc + parseFloat(reservation.price), 0);

    const result = {
      propertyId,
      startDate,
      endDate,
      totalIncome,
      reservations: reservations.map((reservation: { id: any; email: any; startDate: any; endDate: any; price: any; }) => ({
        id: reservation.id,
        email: reservation.email,
        startDate: reservation.startDate,
        endDate: reservation.endDate,
        price: reservation.price,
        city: property.city,
        country: property.country
      }))
    };

    res.status(200).json(result);
  } catch (error) {
    console.error('Error al consultar ingresos por alquiler:', error);
    res.status(500).json({ message: 'Error al consultar ingresos por alquiler' });
  }
};

export const getOccupancyRates = async (req: Request, res: Response) => {
  const { startDate, endDate } = req.query;

  try {
    if (typeof startDate !== 'string' || typeof endDate !== 'string') {
      return res.status(400).json({ message: 'startDate y endDate son requeridos y deben ser strings' });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return res.status(400).json({ message: 'Las fechas deben ser válidas' });
    }

    const reservations = await Reservation.findAll();
    reservations.filter((reservation: { get: (arg0: string) => string | number | Date; }) =>
      new Date(reservation.get('startDate')) >= start &&
      new Date(reservation.get('endDate')) <= end
    );

    const propertiesResponse = await axios.get(`${process.env.PROPERTY_SERVICE_URL}/api/property/all`);
    const properties = propertiesResponse.data;
    console.log(properties)

    if (!Array.isArray(properties)) {
      throw new Error('La respuesta de la API de propiedades no es un array');
    }

    const propertyMap = properties.reduce((acc: Record<string, any>, property: any) => {
      acc[property.id] = property;
      return acc;
    }, {});


    const neighborhoods = properties.reduce((acc: Record<string, any>, property: any) => {
      if (!acc[property.neighborhood]) {
        acc[property.neighborhood] = { total: 0, rented: 0 };
      }
      acc[property.neighborhood].total++;
      return acc;
    }, {});

    reservations.forEach(reservation => {
      const propertyId = reservation.get('propertyId') as string;
      const property = propertyMap[propertyId];
      if (property) {
        const neighborhood = property.neighborhood;
        if (neighborhoods[neighborhood]) {
          neighborhoods[neighborhood].rented++;
        }
      }
    });

    const occupancyRates = Object.keys(neighborhoods).map(neighborhood => {
      const data = neighborhoods[neighborhood];
      const occupancyRate = data.rented / data.total;
      return {
        neighborhood,
        totalProperties: data.total,
        rentedProperties: data.rented,
        occupancyRate
      };
    });

    occupancyRates.sort((a, b) => b.occupancyRate - a.occupancyRate);

    res.status(200).json(occupancyRates);
  } catch (error) {
    console.error('Error al consultar ocupaciones:', error);
    res.status(500).json({ message: 'Error al consultar ocupaciones' });
  }
};



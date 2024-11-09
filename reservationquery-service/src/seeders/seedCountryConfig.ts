import { QueryInterface } from 'sequelize';
import CountryConfig from '../models/CountryConfig';

export async function seedCountryConfig(queryInterface: QueryInterface): Promise<void> {
  await CountryConfig.findOrCreate({
    where: { country: 'USA' },
    defaults: {
      country: 'USA',
      daysNotice: 30,
      refundPercentage: 50,
    },
  });
}

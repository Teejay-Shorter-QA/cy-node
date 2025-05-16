import { faker } from '@faker-js/faker';
import type { Movie } from '../generated/prisma';

export const generateMovieWithoutId = (): Omit<Movie, 'id'> => {
  return {
    name: faker.book.title(),
    year: faker.date.past({ years: 50 }).getFullYear(),
    rating: faker.number.float({ min: 1, max: 10, fractionDigits: 1 })
  };
};

export const generateMovieWithId = (): Movie => {
  return {
    id: faker.number.int({ min: 1, max: 1000 }),
    name: faker.book.title(),
    year: faker.date.past({ years: 50 }).getFullYear(),
    rating: faker.number.float({ min: 1, max: 10, fractionDigits: 1 })
  };
};

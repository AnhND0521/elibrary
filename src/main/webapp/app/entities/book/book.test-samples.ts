import { IBook, NewBook } from './book.model';

export const sampleWithRequiredData: IBook = {
  id: 37098,
  title: 'Jewelery',
};

export const sampleWithPartialData: IBook = {
  id: 26912,
  title: 'Shoes Rhode',
};

export const sampleWithFullData: IBook = {
  id: 72386,
  title: 'Wooden',
};

export const sampleWithNewData: NewBook = {
  title: 'AI',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);

import { IBook, NewBook } from './book.model';

export const sampleWithRequiredData: IBook = {
  id: 37098,
  title: 'Jewelery',
};

export const sampleWithPartialData: IBook = {
  id: 60289,
  title: 'synthesize',
};

export const sampleWithFullData: IBook = {
  id: 77314,
  title: 'bandwidth',
  imageUrl: 'GB',
};

export const sampleWithNewData: NewBook = {
  title: 'multi-byte HTTP',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);

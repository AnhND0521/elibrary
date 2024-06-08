import { IBookCopy, NewBookCopy } from './book-copy.model';

export const sampleWithRequiredData: IBookCopy = {
  id: 63994,
};

export const sampleWithPartialData: IBookCopy = {
  id: 67596,
  title: 'state Rubber',
  yearPublished: 16740,
};

export const sampleWithFullData: IBookCopy = {
  id: 89604,
  title: 'Cliffs',
  yearPublished: 79336,
};

export const sampleWithNewData: NewBookCopy = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);

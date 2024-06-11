import { BookCopyStatus } from 'app/entities/enumerations/book-copy-status.model';

import { IBookCopy, NewBookCopy } from './book-copy.model';

export const sampleWithRequiredData: IBookCopy = {
  id: 63994,
};

export const sampleWithPartialData: IBookCopy = {
  id: 77979,
  title: 'Avon Renminbi turquoise',
  yearPublished: 62117,
  language: 'national bus Peso',
  status: BookCopyStatus['AVAILABLE'],
};

export const sampleWithFullData: IBookCopy = {
  id: 9543,
  title: 'Viaduct e-business',
  yearPublished: 72667,
  language: 'Principal Corporate ',
  status: BookCopyStatus['BORROWED'],
};

export const sampleWithNewData: NewBookCopy = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);

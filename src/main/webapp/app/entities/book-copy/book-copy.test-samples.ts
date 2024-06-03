import { IBookCopy, NewBookCopy } from './book-copy.model';

export const sampleWithRequiredData: IBookCopy = {
  id: 63994,
};

export const sampleWithPartialData: IBookCopy = {
  id: 73799,
  yearPublished: 67596,
};

export const sampleWithFullData: IBookCopy = {
  id: 66507,
  yearPublished: 77979,
};

export const sampleWithNewData: NewBookCopy = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);

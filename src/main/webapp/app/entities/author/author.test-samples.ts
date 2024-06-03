import { IAuthor, NewAuthor } from './author.model';

export const sampleWithRequiredData: IAuthor = {
  id: 82416,
  name: 'generating Home networks',
};

export const sampleWithPartialData: IAuthor = {
  id: 35747,
  name: 'invoice compressing',
};

export const sampleWithFullData: IAuthor = {
  id: 80565,
  name: 'Wall calculate haptic',
};

export const sampleWithNewData: NewAuthor = {
  name: 'payment optimize',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);

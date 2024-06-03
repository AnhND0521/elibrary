import { PatronStatus } from 'app/entities/enumerations/patron-status.model';

import { IPatronAccount, NewPatronAccount } from './patron-account.model';

export const sampleWithRequiredData: IPatronAccount = {
  cardNumber: 'cd538688-1',
  firstName: 'Thụy Ðào',
  surname: 'Tomé',
  email: 'NgcQunh33@gmail.com',
};

export const sampleWithPartialData: IPatronAccount = {
  cardNumber: '0b3aa723-3',
  firstName: 'Thanh Long',
  surname: 'Liaison heuristic',
  email: 'QunhGiang_Phan87@hotmail.com',
};

export const sampleWithFullData: IPatronAccount = {
  cardNumber: '3462cb3c-3',
  firstName: 'Quốc Trung',
  surname: 'Movies',
  email: 'ThyUyn.V@hotmail.com',
  status: PatronStatus['BLOCKED'],
};

export const sampleWithNewData: NewPatronAccount = {
  firstName: 'Viễn Thông',
  surname: 'back-end orchid mindshare',
  email: 'ThanhNga_Tng85@gmail.com',
  cardNumber: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);

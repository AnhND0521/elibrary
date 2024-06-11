import dayjs from 'dayjs/esm';

import { ICheckout, NewCheckout } from './checkout.model';

export const sampleWithRequiredData: ICheckout = {
  id: 98606,
};

export const sampleWithPartialData: ICheckout = {
  id: 58053,
  startTime: dayjs('2024-06-02T13:57'),
  isReturned: false,
};

export const sampleWithFullData: ICheckout = {
  id: 81264,
  startTime: dayjs('2024-06-02T18:04'),
  endTime: dayjs('2024-06-02T23:09'),
  isReturned: true,
};

export const sampleWithNewData: NewCheckout = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);

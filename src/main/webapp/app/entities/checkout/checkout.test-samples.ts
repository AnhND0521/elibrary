import dayjs from 'dayjs/esm';

import { ICheckout, NewCheckout } from './checkout.model';

export const sampleWithRequiredData: ICheckout = {
  id: 98606,
};

export const sampleWithPartialData: ICheckout = {
  id: 82904,
  startTime: dayjs('2024-06-03T00:11'),
  dueEndTime: dayjs('2024-06-02T14:21'),
  isReturned: true,
};

export const sampleWithFullData: ICheckout = {
  id: 44592,
  startTime: dayjs('2024-06-02T12:01'),
  endTime: dayjs('2024-06-02T18:26'),
  dueEndTime: dayjs('2024-06-02T10:39'),
  isReturned: false,
};

export const sampleWithNewData: NewCheckout = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);

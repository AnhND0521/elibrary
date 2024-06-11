import dayjs from 'dayjs/esm';

import { IHold, NewHold } from './hold.model';

export const sampleWithRequiredData: IHold = {
  id: 23775,
};

export const sampleWithPartialData: IHold = {
  id: 32703,
  startTime: dayjs('2024-06-02T11:13'),
};

export const sampleWithFullData: IHold = {
  id: 44303,
  startTime: dayjs('2024-06-02T21:16'),
  endTime: dayjs('2024-06-03T04:10'),
  isCheckedOut: false,
};

export const sampleWithNewData: NewHold = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);

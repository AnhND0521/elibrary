import dayjs from 'dayjs/esm';

import { IWaitlistItem, NewWaitlistItem } from './waitlist-item.model';

export const sampleWithRequiredData: IWaitlistItem = {
  id: 5911,
};

export const sampleWithPartialData: IWaitlistItem = {
  id: 20263,
};

export const sampleWithFullData: IWaitlistItem = {
  id: 27756,
  timestamp: dayjs('2024-06-02T12:04'),
};

export const sampleWithNewData: NewWaitlistItem = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);

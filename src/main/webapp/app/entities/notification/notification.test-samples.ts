import dayjs from 'dayjs/esm';

import { NotificationType } from 'app/entities/enumerations/notification-type.model';

import { INotification, NewNotification } from './notification.model';

export const sampleWithRequiredData: INotification = {
  id: 30621,
};

export const sampleWithPartialData: INotification = {
  id: 64249,
};

export const sampleWithFullData: INotification = {
  id: 55330,
  sentAt: dayjs('2024-06-02T15:10'),
  type: NotificationType['NOTIFY_BOOK_AVAILABLE'],
};

export const sampleWithNewData: NewNotification = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);

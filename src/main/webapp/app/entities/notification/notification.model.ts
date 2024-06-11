import dayjs from 'dayjs/esm';
import { IPatronAccount } from 'app/entities/patron-account/patron-account.model';
import { NotificationType } from 'app/entities/enumerations/notification-type.model';

export interface INotification {
  id: number;
  sentAt?: dayjs.Dayjs | null;
  type?: NotificationType | null;
  patron?: Pick<IPatronAccount, 'cardNumber'> | null;
}

export type NewNotification = Omit<INotification, 'id'> & { id: null };

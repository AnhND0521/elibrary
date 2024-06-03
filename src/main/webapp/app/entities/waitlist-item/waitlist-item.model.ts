import dayjs from 'dayjs/esm';
import { IBook } from 'app/entities/book/book.model';
import { IPatronAccount } from 'app/entities/patron-account/patron-account.model';

export interface IWaitlistItem {
  id: number;
  timestamp?: dayjs.Dayjs | null;
  book?: Pick<IBook, 'id' | 'title'> | null;
  patron?: Pick<IPatronAccount, 'cardNumber'> | null;
}

export type NewWaitlistItem = Omit<IWaitlistItem, 'id'> & { id: null };

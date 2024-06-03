import { IUser } from 'app/entities/user/user.model';
import { PatronStatus } from 'app/entities/enumerations/patron-status.model';

export interface IPatronAccount {
  cardNumber: string;
  firstName?: string | null;
  surname?: string | null;
  email?: string | null;
  status?: PatronStatus | null;
  user?: Pick<IUser, 'id' | 'login'> | null;
}

export type NewPatronAccount = Omit<IPatronAccount, 'cardNumber'> & { cardNumber: null };

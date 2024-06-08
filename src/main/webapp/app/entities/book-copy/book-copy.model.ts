import { IBook } from 'app/entities/book/book.model';
import { IPublisher } from 'app/entities/publisher/publisher.model';

export interface IBookCopy {
  id: number;
  title?: string | null;
  yearPublished?: number | null;
  book?: Pick<IBook, 'id' | 'title'> | null;
  publisher?: Pick<IPublisher, 'id' | 'name'> | null;
}

export type NewBookCopy = Omit<IBookCopy, 'id'> & { id: null };

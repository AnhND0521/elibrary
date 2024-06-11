import { IBook } from 'app/entities/book/book.model';
import { IPublisher } from 'app/entities/publisher/publisher.model';
import { BookCopyStatus } from 'app/entities/enumerations/book-copy-status.model';

export interface IBookCopy {
  id: number;
  title?: string | null;
  yearPublished?: number | null;
  language?: string | null;
  status?: BookCopyStatus | null;
  book?: Pick<IBook, 'id' | 'title'> | null;
  publisher?: Pick<IPublisher, 'id' | 'name'> | null;
}

export type NewBookCopy = Omit<IBookCopy, 'id'> & { id: null };

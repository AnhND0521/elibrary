import { IBook } from 'app/entities/book/book.model';

export interface IAuthor {
  id: number;
  name?: string | null;
  books?: Pick<IBook, 'id' | 'title'>[] | null;
}

export type NewAuthor = Omit<IAuthor, 'id'> & { id: null };

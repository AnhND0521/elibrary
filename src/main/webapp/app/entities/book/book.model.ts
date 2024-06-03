import { ICategory } from 'app/entities/category/category.model';
import { IAuthor } from 'app/entities/author/author.model';

export interface IBook {
  id: number;
  title?: string | null;
  category?: Pick<ICategory, 'id' | 'name'> | null;
  authors?: Pick<IAuthor, 'id' | 'name'>[] | null;
}

export type NewBook = Omit<IBook, 'id'> & { id: null };

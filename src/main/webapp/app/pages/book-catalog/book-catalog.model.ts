import { IBook } from 'app/entities/book/book.model';

export interface IBookCatalogItem {
  categoryId?: number;
  categoryName: string;
  content?: IBook[][];
}

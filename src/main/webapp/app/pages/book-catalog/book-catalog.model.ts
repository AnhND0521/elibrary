import { IBook } from 'app/entities/book/book.model';

export interface IBookCatalogItemOnDisplay {
  categoryId?: number;
  categoryName: string;
  content?: IBookOnDisplay[][];
}

export interface IBookOnDisplay {
  id: number;
  title: string;
  authors: string;
  imageUrl?: string | null;
}

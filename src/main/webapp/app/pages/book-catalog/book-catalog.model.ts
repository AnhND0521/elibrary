import { IBookOnDisplay } from 'app/components/book-display/book-display.model';

export interface IBookCatalogItemOnDisplay {
  categoryId?: number;
  categoryName: string;
  content?: IBookOnDisplay[][];
}

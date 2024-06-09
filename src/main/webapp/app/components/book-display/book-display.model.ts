import { IBook } from 'app/entities/book/book.model';

export interface IBookOnDisplay {
  id: number;
  title: string;
  authors: string;
  imageUrl?: string | null;
}

export function convertBookToBookOnDisplay(book: IBook): IBookOnDisplay {
  const authors = book.authors!.map(a => a.name).join(', ');
  return {
    id: book.id,
    title: book.title!,
    authors: authors,
    imageUrl: book.imageUrl,
  };
}

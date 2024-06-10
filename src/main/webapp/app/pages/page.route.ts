import { Routes } from '@angular/router';
import { BookCatalogComponent } from './book-catalog/book-catalog.component';
import { BookSearchComponent } from './book-search/book-search.component';
import { CategoryCatalogComponent } from './category-catalog/category-catalog.component';
import { AuthorCatalogComponent } from './author-catalog/author-catalog.component';

export const pageRoute: Routes = [
  {
    path: 'catalog',
    component: BookCatalogComponent,
  },
  {
    path: 'search',
    component: BookSearchComponent,
  },
  {
    path: 'categories',
    component: CategoryCatalogComponent,
  },
  {
    path: 'authors',
    component: AuthorCatalogComponent,
  },
];

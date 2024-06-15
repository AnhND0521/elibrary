import { Routes } from '@angular/router';
import { BookCatalogComponent } from './book-catalog/book-catalog.component';
import { BookSearchComponent } from './book-search/book-search.component';
import { CategoryCatalogComponent } from './category-catalog/category-catalog.component';
import { AuthorCatalogComponent } from './author-catalog/author-catalog.component';
import { BookDetailsComponent } from './book-details/book-details.component';
import { HistoryComponent } from './history/history.component';

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
  {
    path: 'book-details/:id',
    component: BookDetailsComponent,
  },
  {
    path: 'history',
    component: HistoryComponent,
  },
];

import { Routes } from '@angular/router';
import { BookCatalogComponent } from './book-catalog/book-catalog.component';

export const pageRoute: Routes = [
  {
    path: 'catalog',
    component: BookCatalogComponent,
  },
];

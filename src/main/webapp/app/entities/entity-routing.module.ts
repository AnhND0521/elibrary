import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'patron-account',
        data: { pageTitle: 'eLibraryApp.patronAccount.home.title' },
        loadChildren: () => import('./patron-account/patron-account.module').then(m => m.PatronAccountModule),
      },
      {
        path: 'book',
        data: { pageTitle: 'eLibraryApp.book.home.title' },
        loadChildren: () => import('./book/book.module').then(m => m.BookModule),
      },
      {
        path: 'category',
        data: { pageTitle: 'eLibraryApp.category.home.title' },
        loadChildren: () => import('./category/category.module').then(m => m.CategoryModule),
      },
      {
        path: 'author',
        data: { pageTitle: 'eLibraryApp.author.home.title' },
        loadChildren: () => import('./author/author.module').then(m => m.AuthorModule),
      },
      {
        path: 'waitlist-item',
        data: { pageTitle: 'eLibraryApp.waitlistItem.home.title' },
        loadChildren: () => import('./waitlist-item/waitlist-item.module').then(m => m.WaitlistItemModule),
      },
      {
        path: 'book-copy',
        data: { pageTitle: 'eLibraryApp.bookCopy.home.title' },
        loadChildren: () => import('./book-copy/book-copy.module').then(m => m.BookCopyModule),
      },
      {
        path: 'publisher',
        data: { pageTitle: 'eLibraryApp.publisher.home.title' },
        loadChildren: () => import('./publisher/publisher.module').then(m => m.PublisherModule),
      },
      {
        path: 'checkout',
        data: { pageTitle: 'eLibraryApp.checkout.home.title' },
        loadChildren: () => import('./checkout/checkout.module').then(m => m.CheckoutModule),
      },
      {
        path: 'hold',
        data: { pageTitle: 'eLibraryApp.hold.home.title' },
        loadChildren: () => import('./hold/hold.module').then(m => m.HoldModule),
      },
      {
        path: 'notification',
        data: { pageTitle: 'eLibraryApp.notification.home.title' },
        loadChildren: () => import('./notification/notification.module').then(m => m.NotificationModule),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}

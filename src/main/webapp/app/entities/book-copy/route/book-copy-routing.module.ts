import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { BookCopyComponent } from '../list/book-copy.component';
import { BookCopyDetailComponent } from '../detail/book-copy-detail.component';
import { BookCopyUpdateComponent } from '../update/book-copy-update.component';
import { BookCopyRoutingResolveService } from './book-copy-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const bookCopyRoute: Routes = [
  {
    path: '',
    component: BookCopyComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: BookCopyDetailComponent,
    resolve: {
      bookCopy: BookCopyRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: BookCopyUpdateComponent,
    resolve: {
      bookCopy: BookCopyRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: BookCopyUpdateComponent,
    resolve: {
      bookCopy: BookCopyRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(bookCopyRoute)],
  exports: [RouterModule],
})
export class BookCopyRoutingModule {}

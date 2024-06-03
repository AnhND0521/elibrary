import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { PatronAccountComponent } from '../list/patron-account.component';
import { PatronAccountDetailComponent } from '../detail/patron-account-detail.component';
import { PatronAccountUpdateComponent } from '../update/patron-account-update.component';
import { PatronAccountRoutingResolveService } from './patron-account-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const patronAccountRoute: Routes = [
  {
    path: '',
    component: PatronAccountComponent,
    data: {
      defaultSort: 'cardNumber,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':cardNumber/view',
    component: PatronAccountDetailComponent,
    resolve: {
      patronAccount: PatronAccountRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: PatronAccountUpdateComponent,
    resolve: {
      patronAccount: PatronAccountRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':cardNumber/edit',
    component: PatronAccountUpdateComponent,
    resolve: {
      patronAccount: PatronAccountRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(patronAccountRoute)],
  exports: [RouterModule],
})
export class PatronAccountRoutingModule {}

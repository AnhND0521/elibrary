import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { CheckoutComponent } from '../list/checkout.component';
import { CheckoutDetailComponent } from '../detail/checkout-detail.component';
import { CheckoutUpdateComponent } from '../update/checkout-update.component';
import { CheckoutRoutingResolveService } from './checkout-routing-resolve.service';
import { ASC, DESC } from 'app/config/navigation.constants';
import { CheckoutFromHoldRoutingResolveService } from './checkout-from-hold-routing-resolve.service';

const checkoutRoute: Routes = [
  {
    path: '',
    component: CheckoutComponent,
    data: {
      defaultSort: 'startTime,' + DESC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: CheckoutDetailComponent,
    resolve: {
      checkout: CheckoutRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: CheckoutUpdateComponent,
    resolve: {
      checkout: CheckoutRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new/from-hold/:id',
    component: CheckoutUpdateComponent,
    resolve: {
      checkout: CheckoutFromHoldRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: CheckoutUpdateComponent,
    resolve: {
      checkout: CheckoutRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(checkoutRoute)],
  exports: [RouterModule],
})
export class CheckoutRoutingModule {}

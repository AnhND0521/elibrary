import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { CheckoutComponent } from '../list/checkout.component';
import { CheckoutDetailComponent } from '../detail/checkout-detail.component';
import { CheckoutUpdateComponent } from '../update/checkout-update.component';
import { CheckoutRoutingResolveService } from './checkout-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const checkoutRoute: Routes = [
  {
    path: '',
    component: CheckoutComponent,
    data: {
      defaultSort: 'id,' + ASC,
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

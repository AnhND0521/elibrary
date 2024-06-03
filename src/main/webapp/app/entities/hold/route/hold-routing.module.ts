import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { HoldComponent } from '../list/hold.component';
import { HoldDetailComponent } from '../detail/hold-detail.component';
import { HoldUpdateComponent } from '../update/hold-update.component';
import { HoldRoutingResolveService } from './hold-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const holdRoute: Routes = [
  {
    path: '',
    component: HoldComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: HoldDetailComponent,
    resolve: {
      hold: HoldRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: HoldUpdateComponent,
    resolve: {
      hold: HoldRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: HoldUpdateComponent,
    resolve: {
      hold: HoldRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(holdRoute)],
  exports: [RouterModule],
})
export class HoldRoutingModule {}

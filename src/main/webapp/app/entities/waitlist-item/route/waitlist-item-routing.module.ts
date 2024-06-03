import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { WaitlistItemComponent } from '../list/waitlist-item.component';
import { WaitlistItemDetailComponent } from '../detail/waitlist-item-detail.component';
import { WaitlistItemUpdateComponent } from '../update/waitlist-item-update.component';
import { WaitlistItemRoutingResolveService } from './waitlist-item-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const waitlistItemRoute: Routes = [
  {
    path: '',
    component: WaitlistItemComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: WaitlistItemDetailComponent,
    resolve: {
      waitlistItem: WaitlistItemRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: WaitlistItemUpdateComponent,
    resolve: {
      waitlistItem: WaitlistItemRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: WaitlistItemUpdateComponent,
    resolve: {
      waitlistItem: WaitlistItemRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(waitlistItemRoute)],
  exports: [RouterModule],
})
export class WaitlistItemRoutingModule {}

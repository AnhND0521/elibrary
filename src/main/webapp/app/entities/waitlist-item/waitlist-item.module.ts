import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { WaitlistItemComponent } from './list/waitlist-item.component';
import { WaitlistItemDetailComponent } from './detail/waitlist-item-detail.component';
import { WaitlistItemUpdateComponent } from './update/waitlist-item-update.component';
import { WaitlistItemDeleteDialogComponent } from './delete/waitlist-item-delete-dialog.component';
import { WaitlistItemRoutingModule } from './route/waitlist-item-routing.module';

@NgModule({
  imports: [SharedModule, WaitlistItemRoutingModule],
  declarations: [WaitlistItemComponent, WaitlistItemDetailComponent, WaitlistItemUpdateComponent, WaitlistItemDeleteDialogComponent],
})
export class WaitlistItemModule {}

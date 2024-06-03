import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { HoldComponent } from './list/hold.component';
import { HoldDetailComponent } from './detail/hold-detail.component';
import { HoldUpdateComponent } from './update/hold-update.component';
import { HoldDeleteDialogComponent } from './delete/hold-delete-dialog.component';
import { HoldRoutingModule } from './route/hold-routing.module';

@NgModule({
  imports: [SharedModule, HoldRoutingModule],
  declarations: [HoldComponent, HoldDetailComponent, HoldUpdateComponent, HoldDeleteDialogComponent],
})
export class HoldModule {}

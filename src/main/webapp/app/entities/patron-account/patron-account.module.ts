import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { PatronAccountComponent } from './list/patron-account.component';
import { PatronAccountDetailComponent } from './detail/patron-account-detail.component';
import { PatronAccountUpdateComponent } from './update/patron-account-update.component';
import { PatronAccountDeleteDialogComponent } from './delete/patron-account-delete-dialog.component';
import { PatronAccountRoutingModule } from './route/patron-account-routing.module';

@NgModule({
  imports: [SharedModule, PatronAccountRoutingModule],
  declarations: [PatronAccountComponent, PatronAccountDetailComponent, PatronAccountUpdateComponent, PatronAccountDeleteDialogComponent],
})
export class PatronAccountModule {}

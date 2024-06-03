import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { CheckoutComponent } from './list/checkout.component';
import { CheckoutDetailComponent } from './detail/checkout-detail.component';
import { CheckoutUpdateComponent } from './update/checkout-update.component';
import { CheckoutDeleteDialogComponent } from './delete/checkout-delete-dialog.component';
import { CheckoutRoutingModule } from './route/checkout-routing.module';

@NgModule({
  imports: [SharedModule, CheckoutRoutingModule],
  declarations: [CheckoutComponent, CheckoutDetailComponent, CheckoutUpdateComponent, CheckoutDeleteDialogComponent],
})
export class CheckoutModule {}

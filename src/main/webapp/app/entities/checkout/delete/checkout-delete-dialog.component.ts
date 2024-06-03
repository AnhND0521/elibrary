import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ICheckout } from '../checkout.model';
import { CheckoutService } from '../service/checkout.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './checkout-delete-dialog.component.html',
})
export class CheckoutDeleteDialogComponent {
  checkout?: ICheckout;

  constructor(protected checkoutService: CheckoutService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.checkoutService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}

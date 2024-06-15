import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { IHold } from 'app/entities/hold/hold.model';
import { HoldService } from 'app/entities/hold/service/hold.service';

@Component({
  templateUrl: './hold-cancel-dialog.component.html',
})
export class HoldCancelDialogComponent {
  id?: number;

  constructor(protected holdService: HoldService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.holdService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}

import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IWaitlistItem } from '../waitlist-item.model';
import { WaitlistItemService } from '../service/waitlist-item.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './waitlist-item-delete-dialog.component.html',
})
export class WaitlistItemDeleteDialogComponent {
  waitlistItem?: IWaitlistItem;

  constructor(protected waitlistItemService: WaitlistItemService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.waitlistItemService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}

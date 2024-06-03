import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IPatronAccount } from '../patron-account.model';
import { PatronAccountService } from '../service/patron-account.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './patron-account-delete-dialog.component.html',
})
export class PatronAccountDeleteDialogComponent {
  patronAccount?: IPatronAccount;

  constructor(protected patronAccountService: PatronAccountService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: string): void {
    this.patronAccountService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}

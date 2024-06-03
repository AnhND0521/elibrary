import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IBookCopy } from '../book-copy.model';
import { BookCopyService } from '../service/book-copy.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './book-copy-delete-dialog.component.html',
})
export class BookCopyDeleteDialogComponent {
  bookCopy?: IBookCopy;

  constructor(protected bookCopyService: BookCopyService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.bookCopyService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}

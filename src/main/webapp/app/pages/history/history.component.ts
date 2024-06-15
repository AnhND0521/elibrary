import { Component, OnInit } from '@angular/core';
import { HistoryService } from './history.service';
import { BookCopyService } from 'app/entities/book-copy/service/book-copy.service';
import { BookService } from 'app/entities/book/service/book.service';
import { TOTAL_COUNT_RESPONSE_HEADER } from 'app/config/pagination.constants';
import dayjs from 'dayjs/esm';
import { HoldService } from 'app/entities/hold/service/hold.service';
import { CheckoutService } from 'app/entities/checkout/service/checkout.service';
import { Alert, AlertService } from 'app/core/util/alert.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HoldCancelDialogComponent } from './hold-cancel-dialog/hold-cancel-dialog.component';
import { filter, switchMap } from 'rxjs';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

const MAX_STRING_LENGTH = 30;

@Component({
  selector: 'jhi-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss'],
})
export class HistoryComponent implements OnInit {
  holds: any[] = [];
  holdPage: number = 1;
  holdItemsPerPage: number = 10;
  holdTotalItems: number = 0;

  checkouts: any[] = [];
  checkoutPage: number = 1;
  checkoutItemsPerPage: number = 10;
  checkoutTotalItems: number = 0;

  constructor(
    protected historyService: HistoryService,
    protected holdService: HoldService,
    protected checkoutService: CheckoutService,
    protected bookCopyService: BookCopyService,
    protected bookService: BookService,
    protected modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.fetchHolds();
    this.fetchCheckouts();
  }

  fetchHolds() {
    this.historyService.getHolds({ page: this.holdPage - 1, size: this.holdItemsPerPage }).subscribe(response => {
      this.holds = response.body!;
      this.holdTotalItems = Number(response.headers.get(TOTAL_COUNT_RESPONSE_HEADER));
      for (let i = 0; i < this.holds.length; i++) {
        this.bookCopyService.find(this.holds[i].copy.id).subscribe(response => {
          this.holds[i].copy = response.body!;
          this.bookService.find(this.holds[i].copy.book.id).subscribe(response => {
            const book: any = response.body!;
            book.authors = book.authors.map((author: any) => author.name).join(', ');
            this.holds[i].copy.book = book;
          });
        });
      }
    });
  }

  handleHoldPageChange(page: number) {
    this.holdPage = page;
    this.fetchHolds();
  }

  fetchCheckouts() {
    this.historyService.getCheckouts({ page: this.checkoutPage - 1, size: this.checkoutItemsPerPage }).subscribe(response => {
      this.checkouts = response.body!;
      this.checkoutTotalItems = Number(response.headers.get(TOTAL_COUNT_RESPONSE_HEADER));
      for (let i = 0; i < this.checkouts.length; i++) {
        this.bookCopyService.find(this.checkouts[i].copy.id).subscribe(response => {
          this.checkouts[i].copy = response.body!;
          this.bookService.find(this.checkouts[i].copy.book.id).subscribe(response => {
            const book: any = response.body!;
            book.authors = book.authors.map((author: any) => author.name).join(', ');
            this.checkouts[i].copy.book = book;
          });
        });
      }
    });
  }

  handleCheckoutPageChange(page: number) {
    this.checkoutPage = page;
    this.fetchCheckouts();
  }

  cancelHold(id: number) {
    const modalRef = this.modalService.open(HoldCancelDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.id = id;
    modalRef.closed.subscribe(reason => {
      if (reason === ITEM_DELETED_EVENT) {
        this.fetchHolds();
      }
    });
  }

  isAfterCurrent(time: any) {
    return dayjs(time).isAfter(dayjs());
  }

  trimmable(s: string, limit: number = MAX_STRING_LENGTH): boolean {
    return s.length > limit;
  }

  trim(s: string, limit: number = MAX_STRING_LENGTH): string {
    return this.trimmable(s, limit) ? s.slice(0, limit) + '...' : s;
  }
}

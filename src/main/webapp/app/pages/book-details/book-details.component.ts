import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IBookCopy } from 'app/entities/book-copy/book-copy.model';
import { IBook } from 'app/entities/book/book.model';
import { BookService } from 'app/entities/book/service/book.service';
import { BookDetailsService } from './book-details.service';
import { BookCopyStatus } from 'app/entities/enumerations/book-copy-status.model';
import { PatronAccountService } from 'app/entities/patron-account/service/patron-account.service';
import { NewHold } from 'app/entities/hold/hold.model';
import dayjs from 'dayjs/esm';
import { HoldService } from 'app/entities/hold/service/hold.service';
import { Location } from '@angular/common';
import { Duration } from 'dayjs/esm/plugin/duration';
import { IWaitlistItem, NewWaitlistItem } from 'app/entities/waitlist-item/waitlist-item.model';
import { WaitlistItemService } from 'app/entities/waitlist-item/service/waitlist-item.service';

type TimeUnit = 'seconds' | 'minutes' | 'hours' | 'days' | 'months' | 'years';

@Component({
  selector: 'jhi-book-details',
  templateUrl: './book-details.component.html',
  styleUrls: ['./book-details.component.scss'],
})
export class BookDetailsComponent implements OnInit {
  id: number = 0;
  book!: IBook;
  copies: IBookCopy[] = [];
  avalableCopies: IBookCopy[] = [];
  copiesOnPage: IBookCopy[] = [];

  page: number = 1;
  itemsPerPage: number = 10;
  totalItems: number = 0;

  mode: number = 1; // 0: display all copies, 1: display available copies
  status = BookCopyStatus;
  holdTimeValue: number = 3;
  holdTimeUnit: TimeUnit = 'days';
  holdDuration: Duration = dayjs.duration(this.holdTimeValue, this.holdTimeUnit);

  waitlistItem: IWaitlistItem | null = null;

  constructor(
    protected route: ActivatedRoute,
    protected router: Router,
    protected bookService: BookService,
    protected bookDetailsService: BookDetailsService,
    protected patronAccountService: PatronAccountService,
    protected holdService: HoldService,
    protected waitlistItemService: WaitlistItemService,
    protected location: Location
  ) {}

  ngOnInit(): void {
    this.id = +this.route.snapshot.paramMap.get('id')!;
    this.fetchBook();
    this.fetchBookCopies();
    this.fetchWaitlistItem();
  }

  fetchBook() {
    this.bookService.find(this.id).subscribe({
      next: response => (this.book = response.body!),
      error: error => {
        console.error(error);
        this.router.navigate(['404']);
      },
    });
  }

  fetchBookCopies() {
    this.bookDetailsService.getBookCopies(this.id).subscribe(response => {
      this.copies = response.body!;
      this.avalableCopies = this.copies.filter(c => c.status === this.status.AVAILABLE);
      this.page = 1;
      this.updatePage();
      this.totalItems = [this.copies.length, this.avalableCopies.length][this.mode];
    });
  }

  fetchWaitlistItem() {
    this.bookDetailsService.findWaitlistItem(this.id).subscribe(response => (this.waitlistItem = response.body));
  }

  updatePage() {
    const start = (this.page - 1) * this.itemsPerPage;
    const end = this.page * this.itemsPerPage;
    if (this.mode === 0) {
      this.copiesOnPage = this.copies.slice(start, end);
    }
    if (this.mode === 1) {
      this.copiesOnPage = this.avalableCopies.slice(start, end);
    }
  }

  toggleMode() {
    this.mode = 1 - this.mode;
    this.page = 1;
    this.updatePage();
    this.totalItems = [this.copies.length, this.avalableCopies.length][this.mode];
  }

  navigateToPage(page: number) {
    this.page = page;
    this.updatePage();
  }

  requestHold(copy: IBookCopy, confirmMessage?: string) {
    if (window.confirm(confirmMessage ?? 'Bạn có xác nhận mượn cuốn sách này?')) {
      this.patronAccountService.self().subscribe({
        next: patron => {
          const hold: NewHold = {
            id: null,
            patron: patron,
            copy: copy,
            startTime: dayjs(),
            endTime: dayjs().add(this.holdDuration),
            isCheckedOut: false,
          };
          this.holdService.create(hold).subscribe(response => {
            window.alert(
              `Cuốn sách sẽ được giữ cho bạn trong vòng ${this.holdTimeValue} ${this.formatTimeUnit(
                this.holdTimeUnit
              )}. Vui lòng đến thư viện lấy sách trong thời gian này.`
            );
            this.fetchBookCopies();
          });
        },
        error: err => {
          window.alert('Vui lòng đăng nhập bằng tài khoản bạn đọc!');
        },
      });
    }
  }

  requestHoldAny() {
    const copy = this.avalableCopies.find(copy => copy);
    if (copy) {
      this.requestHold(copy, 'Bạn có chắc muốn mượn một bản sao bất kỳ của cuốn sách này?');
    }
  }

  addToWaitlist() {
    this.patronAccountService.self().subscribe({
      next: data => {
        const item: NewWaitlistItem = {
          id: null,
          timestamp: dayjs(),
          patron: data,
          book: this.book,
        };
        this.waitlistItemService.create(item).subscribe(response => {
          this.waitlistItem = response.body;
          // window.alert('Đã thêm vào danh sách chờ!');
        });
      },
      error: err => {
        window.alert('Vui lòng đăng nhập bằng tài khoản bạn đọc!');
      },
    });
  }

  removeFromWaitlist() {
    this.waitlistItemService.delete(this.waitlistItem!.id).subscribe(response => {
      this.waitlistItem = null;
      // window.alert('Đã xóa khỏi danh sách chờ!');
    });
  }

  formatTimeUnit(unit: TimeUnit) {
    switch (unit) {
      case 'seconds':
        return 'giây';
      case 'minutes':
        return 'phút';
      case 'hours':
        return 'giờ';
      case 'days':
        return 'ngày';
      case 'months':
        return 'tháng';
      case 'years':
        return 'năm';
    }
  }
}

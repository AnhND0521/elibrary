import { Component, OnInit } from '@angular/core';
import { WaitlistService } from './waitlist.service';
import { BookService } from 'app/entities/book/service/book.service';
import { BookCopyService } from 'app/entities/book-copy/service/book-copy.service';
import { BookDetailsService } from '../book-details/book-details.service';
import { BookCopyStatus } from 'app/entities/enumerations/book-copy-status.model';
import { WaitlistItemService } from 'app/entities/waitlist-item/service/waitlist-item.service';
import { TOTAL_COUNT_RESPONSE_HEADER } from 'app/config/pagination.constants';

@Component({
  selector: 'jhi-waitlist',
  templateUrl: './waitlist.component.html',
  styleUrls: ['./waitlist.component.scss'],
})
export class WaitlistComponent implements OnInit {
  waitlist: any[] = [];

  totalItems: number = 0;
  page: number = 1;
  itemsPerPage: number = 20;

  constructor(
    protected waitlistService: WaitlistService,
    protected waitlistItemService: WaitlistItemService,
    protected bookService: BookService,
    protected bookDetailsService: BookDetailsService
  ) {}

  ngOnInit(): void {
    this.fetchWaitlist();
  }

  fetchWaitlist() {
    this.waitlistService.getByCurrentUser({ page: this.page - 1, size: this.itemsPerPage }).subscribe(response => {
      this.totalItems = Number(response.headers.get(TOTAL_COUNT_RESPONSE_HEADER));
      this.waitlist = response.body!;
      for (let i = 0; i < this.waitlist.length; i++) {
        this.bookService.find(this.waitlist[i].book.id).subscribe(response => {
          this.waitlist[i].book.authors = response.body!.authors!.map((author: any) => author.name).join(', ');
        });
        this.bookDetailsService.getBookCopies(this.waitlist[i].book.id).subscribe(response => {
          this.waitlist[i].book.availableCopies = response.body!.filter(copy => copy.status === BookCopyStatus.AVAILABLE).length;
        });
      }
    });
  }

  remove(id: number) {
    if (window.confirm('Bạn có chắc muốn xóa cuốn sách khỏi danh sách chờ?')) {
      this.waitlistItemService.delete(id).subscribe(response => this.fetchWaitlist());
    }
  }

  handlePageNavigation(page: number) {
    this.page = page;
    this.fetchWaitlist();
  }
}

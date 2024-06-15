import { Component, OnInit } from '@angular/core';
import { IHold } from 'app/entities/hold/hold.model';
import { HistoryService } from './history.service';
import { map } from 'jquery';
import { BookCopyService } from 'app/entities/book-copy/service/book-copy.service';
import { BookService } from 'app/entities/book/service/book.service';
import { TOTAL_COUNT_RESPONSE_HEADER } from 'app/config/pagination.constants';
import dayjs from 'dayjs/esm';
import { pageRoute } from '../page.route';

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

  constructor(protected historyService: HistoryService, protected bookCopyService: BookCopyService, protected bookService: BookService) {}

  ngOnInit(): void {
    this.fetchHolds();
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
}

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IBookCopy } from 'app/entities/book-copy/book-copy.model';
import { IBook } from 'app/entities/book/book.model';
import { BookService } from 'app/entities/book/service/book.service';
import { BookDetailsService } from './book-details.service';
import { TOTAL_COUNT_RESPONSE_HEADER } from 'app/config/pagination.constants';

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

  constructor(
    protected route: ActivatedRoute,
    protected router: Router,
    protected bookService: BookService,
    protected bookDetailsService: BookDetailsService
  ) {}

  ngOnInit(): void {
    this.id = +this.route.snapshot.paramMap.get('id')!;
    this.fetchBook();
    this.fetchBookCopies();
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
      this.avalableCopies = this.copies.filter(c => c.status === 'AVAILABLE');
      this.page = 1;
      this.updatePage();
      this.totalItems = [this.copies.length, this.avalableCopies.length][this.mode];
    });
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
}

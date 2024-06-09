import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BookSearchService } from './book-search.service';
import { IBook } from 'app/entities/book/book.model';
import { IBookOnDisplay, convertBookToBookOnDisplay } from 'app/components/book-display/book-display.model';
import { HttpResponse } from '@angular/common/http';
import { TOTAL_COUNT_RESPONSE_HEADER } from 'app/config/pagination.constants';

@Component({
  selector: 'jhi-book-search',
  templateUrl: './book-search.component.html',
  styleUrls: ['./book-search.component.scss'],
})
export class BookSearchComponent implements OnInit {
  keyword: string = '';
  keywordFixed: string = '';
  bookList: IBookOnDisplay[] = [];

  itemsPerPage = 30;
  totalItems = 0;
  page = 1;

  constructor(private route: ActivatedRoute, private router: Router, private bookSearchService: BookSearchService) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['q']) {
        this.keyword = params['q'];
        this.keywordFixed = this.keyword;
        this.bookSearchService
          .search({ q: this.keyword, page: this.page - 1, size: this.itemsPerPage })
          .subscribe(response => this.extractBookList(response));
      }
    });
  }

  extractBookList(response: HttpResponse<IBook[]>): void {
    this.bookList = response.body!.map(book => convertBookToBookOnDisplay(book));
    this.totalItems = Number(response.headers.get(TOTAL_COUNT_RESPONSE_HEADER));
  }

  search(): void {
    this.router.navigateByUrl('/search?q=' + this.keyword);
  }

  navigateToPage(page: number) {
    this.page = page;
    this.bookSearchService
      .search({ q: this.keyword, page: this.page - 1, size: this.itemsPerPage })
      .subscribe(response => this.extractBookList(response));
  }
}

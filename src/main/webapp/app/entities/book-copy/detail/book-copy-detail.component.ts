import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IBookCopy } from '../book-copy.model';

@Component({
  selector: 'jhi-book-copy-detail',
  templateUrl: './book-copy-detail.component.html',
})
export class BookCopyDetailComponent implements OnInit {
  bookCopy: IBookCopy | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ bookCopy }) => {
      this.bookCopy = bookCopy;
    });
  }

  previousState(): void {
    window.history.back();
  }
}

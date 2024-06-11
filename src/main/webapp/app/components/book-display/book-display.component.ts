import { Component, Input, OnInit } from '@angular/core';
import { IBook } from 'app/entities/book/book.model';

const MAX_STRING_LENGTH = 30;

@Component({
  selector: 'jhi-book-display',
  templateUrl: './book-display.component.html',
  styleUrls: ['./book-display.component.scss'],
})
export class BookDisplayComponent implements OnInit {
  @Input() book!: IBook;
  authorsString!: string;

  constructor() {}

  ngOnInit(): void {
    this.authorsString = this.book.authors!.map(author => author.name).join(', ');
  }

  trimmable(s: string): boolean {
    return s.length > MAX_STRING_LENGTH;
  }

  trim(s: string): string {
    return this.trimmable(s) ? s.slice(0, 30) + '...' : s;
  }
}

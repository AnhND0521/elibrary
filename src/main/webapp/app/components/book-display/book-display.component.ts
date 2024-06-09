import { Component, Input, OnInit } from '@angular/core';
import { IBookOnDisplay } from 'app/components/book-display/book-display.model';

@Component({
  selector: 'jhi-book-display',
  templateUrl: './book-display.component.html',
  styleUrls: ['./book-display.component.scss'],
})
export class BookDisplayComponent implements OnInit {
  @Input() book!: IBookOnDisplay;

  constructor() {}

  ngOnInit(): void {}
}

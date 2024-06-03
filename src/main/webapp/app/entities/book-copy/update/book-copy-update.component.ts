import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { BookCopyFormService, BookCopyFormGroup } from './book-copy-form.service';
import { IBookCopy } from '../book-copy.model';
import { BookCopyService } from '../service/book-copy.service';
import { IBook } from 'app/entities/book/book.model';
import { BookService } from 'app/entities/book/service/book.service';
import { IPublisher } from 'app/entities/publisher/publisher.model';
import { PublisherService } from 'app/entities/publisher/service/publisher.service';

@Component({
  selector: 'jhi-book-copy-update',
  templateUrl: './book-copy-update.component.html',
})
export class BookCopyUpdateComponent implements OnInit {
  isSaving = false;
  bookCopy: IBookCopy | null = null;

  booksSharedCollection: IBook[] = [];
  publishersSharedCollection: IPublisher[] = [];

  editForm: BookCopyFormGroup = this.bookCopyFormService.createBookCopyFormGroup();

  constructor(
    protected bookCopyService: BookCopyService,
    protected bookCopyFormService: BookCopyFormService,
    protected bookService: BookService,
    protected publisherService: PublisherService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareBook = (o1: IBook | null, o2: IBook | null): boolean => this.bookService.compareBook(o1, o2);

  comparePublisher = (o1: IPublisher | null, o2: IPublisher | null): boolean => this.publisherService.comparePublisher(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ bookCopy }) => {
      this.bookCopy = bookCopy;
      if (bookCopy) {
        this.updateForm(bookCopy);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const bookCopy = this.bookCopyFormService.getBookCopy(this.editForm);
    if (bookCopy.id !== null) {
      this.subscribeToSaveResponse(this.bookCopyService.update(bookCopy));
    } else {
      this.subscribeToSaveResponse(this.bookCopyService.create(bookCopy));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IBookCopy>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(bookCopy: IBookCopy): void {
    this.bookCopy = bookCopy;
    this.bookCopyFormService.resetForm(this.editForm, bookCopy);

    this.booksSharedCollection = this.bookService.addBookToCollectionIfMissing<IBook>(this.booksSharedCollection, bookCopy.book);
    this.publishersSharedCollection = this.publisherService.addPublisherToCollectionIfMissing<IPublisher>(
      this.publishersSharedCollection,
      bookCopy.publisher
    );
  }

  protected loadRelationshipsOptions(): void {
    this.bookService
      .query()
      .pipe(map((res: HttpResponse<IBook[]>) => res.body ?? []))
      .pipe(map((books: IBook[]) => this.bookService.addBookToCollectionIfMissing<IBook>(books, this.bookCopy?.book)))
      .subscribe((books: IBook[]) => (this.booksSharedCollection = books));

    this.publisherService
      .query()
      .pipe(map((res: HttpResponse<IPublisher[]>) => res.body ?? []))
      .pipe(
        map((publishers: IPublisher[]) =>
          this.publisherService.addPublisherToCollectionIfMissing<IPublisher>(publishers, this.bookCopy?.publisher)
        )
      )
      .subscribe((publishers: IPublisher[]) => (this.publishersSharedCollection = publishers));
  }
}

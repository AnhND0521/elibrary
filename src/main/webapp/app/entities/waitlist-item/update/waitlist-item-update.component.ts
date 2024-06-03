import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { WaitlistItemFormService, WaitlistItemFormGroup } from './waitlist-item-form.service';
import { IWaitlistItem } from '../waitlist-item.model';
import { WaitlistItemService } from '../service/waitlist-item.service';
import { IBook } from 'app/entities/book/book.model';
import { BookService } from 'app/entities/book/service/book.service';
import { IPatronAccount } from 'app/entities/patron-account/patron-account.model';
import { PatronAccountService } from 'app/entities/patron-account/service/patron-account.service';

@Component({
  selector: 'jhi-waitlist-item-update',
  templateUrl: './waitlist-item-update.component.html',
})
export class WaitlistItemUpdateComponent implements OnInit {
  isSaving = false;
  waitlistItem: IWaitlistItem | null = null;

  booksSharedCollection: IBook[] = [];
  patronAccountsSharedCollection: IPatronAccount[] = [];

  editForm: WaitlistItemFormGroup = this.waitlistItemFormService.createWaitlistItemFormGroup();

  constructor(
    protected waitlistItemService: WaitlistItemService,
    protected waitlistItemFormService: WaitlistItemFormService,
    protected bookService: BookService,
    protected patronAccountService: PatronAccountService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareBook = (o1: IBook | null, o2: IBook | null): boolean => this.bookService.compareBook(o1, o2);

  comparePatronAccount = (o1: IPatronAccount | null, o2: IPatronAccount | null): boolean =>
    this.patronAccountService.comparePatronAccount(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ waitlistItem }) => {
      this.waitlistItem = waitlistItem;
      if (waitlistItem) {
        this.updateForm(waitlistItem);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const waitlistItem = this.waitlistItemFormService.getWaitlistItem(this.editForm);
    if (waitlistItem.id !== null) {
      this.subscribeToSaveResponse(this.waitlistItemService.update(waitlistItem));
    } else {
      this.subscribeToSaveResponse(this.waitlistItemService.create(waitlistItem));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IWaitlistItem>>): void {
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

  protected updateForm(waitlistItem: IWaitlistItem): void {
    this.waitlistItem = waitlistItem;
    this.waitlistItemFormService.resetForm(this.editForm, waitlistItem);

    this.booksSharedCollection = this.bookService.addBookToCollectionIfMissing<IBook>(this.booksSharedCollection, waitlistItem.book);
    this.patronAccountsSharedCollection = this.patronAccountService.addPatronAccountToCollectionIfMissing<IPatronAccount>(
      this.patronAccountsSharedCollection,
      waitlistItem.patron
    );
  }

  protected loadRelationshipsOptions(): void {
    this.bookService
      .query()
      .pipe(map((res: HttpResponse<IBook[]>) => res.body ?? []))
      .pipe(map((books: IBook[]) => this.bookService.addBookToCollectionIfMissing<IBook>(books, this.waitlistItem?.book)))
      .subscribe((books: IBook[]) => (this.booksSharedCollection = books));

    this.patronAccountService
      .query()
      .pipe(map((res: HttpResponse<IPatronAccount[]>) => res.body ?? []))
      .pipe(
        map((patronAccounts: IPatronAccount[]) =>
          this.patronAccountService.addPatronAccountToCollectionIfMissing<IPatronAccount>(patronAccounts, this.waitlistItem?.patron)
        )
      )
      .subscribe((patronAccounts: IPatronAccount[]) => (this.patronAccountsSharedCollection = patronAccounts));
  }
}

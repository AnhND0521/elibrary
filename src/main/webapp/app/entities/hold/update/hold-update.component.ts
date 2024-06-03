import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { HoldFormService, HoldFormGroup } from './hold-form.service';
import { IHold } from '../hold.model';
import { HoldService } from '../service/hold.service';
import { IBookCopy } from 'app/entities/book-copy/book-copy.model';
import { BookCopyService } from 'app/entities/book-copy/service/book-copy.service';
import { IPatronAccount } from 'app/entities/patron-account/patron-account.model';
import { PatronAccountService } from 'app/entities/patron-account/service/patron-account.service';

@Component({
  selector: 'jhi-hold-update',
  templateUrl: './hold-update.component.html',
})
export class HoldUpdateComponent implements OnInit {
  isSaving = false;
  hold: IHold | null = null;

  bookCopiesSharedCollection: IBookCopy[] = [];
  patronAccountsSharedCollection: IPatronAccount[] = [];

  editForm: HoldFormGroup = this.holdFormService.createHoldFormGroup();

  constructor(
    protected holdService: HoldService,
    protected holdFormService: HoldFormService,
    protected bookCopyService: BookCopyService,
    protected patronAccountService: PatronAccountService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareBookCopy = (o1: IBookCopy | null, o2: IBookCopy | null): boolean => this.bookCopyService.compareBookCopy(o1, o2);

  comparePatronAccount = (o1: IPatronAccount | null, o2: IPatronAccount | null): boolean =>
    this.patronAccountService.comparePatronAccount(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ hold }) => {
      this.hold = hold;
      if (hold) {
        this.updateForm(hold);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const hold = this.holdFormService.getHold(this.editForm);
    if (hold.id !== null) {
      this.subscribeToSaveResponse(this.holdService.update(hold));
    } else {
      this.subscribeToSaveResponse(this.holdService.create(hold));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IHold>>): void {
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

  protected updateForm(hold: IHold): void {
    this.hold = hold;
    this.holdFormService.resetForm(this.editForm, hold);

    this.bookCopiesSharedCollection = this.bookCopyService.addBookCopyToCollectionIfMissing<IBookCopy>(
      this.bookCopiesSharedCollection,
      hold.copy
    );
    this.patronAccountsSharedCollection = this.patronAccountService.addPatronAccountToCollectionIfMissing<IPatronAccount>(
      this.patronAccountsSharedCollection,
      hold.patron
    );
  }

  protected loadRelationshipsOptions(): void {
    this.bookCopyService
      .query()
      .pipe(map((res: HttpResponse<IBookCopy[]>) => res.body ?? []))
      .pipe(map((bookCopies: IBookCopy[]) => this.bookCopyService.addBookCopyToCollectionIfMissing<IBookCopy>(bookCopies, this.hold?.copy)))
      .subscribe((bookCopies: IBookCopy[]) => (this.bookCopiesSharedCollection = bookCopies));

    this.patronAccountService
      .query()
      .pipe(map((res: HttpResponse<IPatronAccount[]>) => res.body ?? []))
      .pipe(
        map((patronAccounts: IPatronAccount[]) =>
          this.patronAccountService.addPatronAccountToCollectionIfMissing<IPatronAccount>(patronAccounts, this.hold?.patron)
        )
      )
      .subscribe((patronAccounts: IPatronAccount[]) => (this.patronAccountsSharedCollection = patronAccounts));
  }
}

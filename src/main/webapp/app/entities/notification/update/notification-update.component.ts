import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { NotificationFormService, NotificationFormGroup } from './notification-form.service';
import { INotification } from '../notification.model';
import { NotificationService } from '../service/notification.service';
import { IPatronAccount } from 'app/entities/patron-account/patron-account.model';
import { PatronAccountService } from 'app/entities/patron-account/service/patron-account.service';
import { IBookCopy } from 'app/entities/book-copy/book-copy.model';
import { BookCopyService } from 'app/entities/book-copy/service/book-copy.service';
import { NotificationType } from 'app/entities/enumerations/notification-type.model';

@Component({
  selector: 'jhi-notification-update',
  templateUrl: './notification-update.component.html',
})
export class NotificationUpdateComponent implements OnInit {
  isSaving = false;
  notification: INotification | null = null;
  notificationTypeValues = Object.keys(NotificationType);

  patronAccountsSharedCollection: IPatronAccount[] = [];
  bookCopiesSharedCollection: IBookCopy[] = [];

  editForm: NotificationFormGroup = this.notificationFormService.createNotificationFormGroup();

  constructor(
    protected notificationService: NotificationService,
    protected notificationFormService: NotificationFormService,
    protected patronAccountService: PatronAccountService,
    protected bookCopyService: BookCopyService,
    protected activatedRoute: ActivatedRoute
  ) {}

  comparePatronAccount = (o1: IPatronAccount | null, o2: IPatronAccount | null): boolean =>
    this.patronAccountService.comparePatronAccount(o1, o2);

  compareBookCopy = (o1: IBookCopy | null, o2: IBookCopy | null): boolean => this.bookCopyService.compareBookCopy(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ notification }) => {
      this.notification = notification;
      if (notification) {
        this.updateForm(notification);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const notification = this.notificationFormService.getNotification(this.editForm);
    if (notification.id !== null) {
      this.subscribeToSaveResponse(this.notificationService.update(notification));
    } else {
      this.subscribeToSaveResponse(this.notificationService.create(notification));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<INotification>>): void {
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

  protected updateForm(notification: INotification): void {
    this.notification = notification;
    this.notificationFormService.resetForm(this.editForm, notification);

    this.patronAccountsSharedCollection = this.patronAccountService.addPatronAccountToCollectionIfMissing<IPatronAccount>(
      this.patronAccountsSharedCollection,
      notification.patron
    );
    this.bookCopiesSharedCollection = this.bookCopyService.addBookCopyToCollectionIfMissing<IBookCopy>(
      this.bookCopiesSharedCollection,
      notification.copy
    );
  }

  protected loadRelationshipsOptions(): void {
    this.patronAccountService
      .query()
      .pipe(map((res: HttpResponse<IPatronAccount[]>) => res.body ?? []))
      .pipe(
        map((patronAccounts: IPatronAccount[]) =>
          this.patronAccountService.addPatronAccountToCollectionIfMissing<IPatronAccount>(patronAccounts, this.notification?.patron)
        )
      )
      .subscribe((patronAccounts: IPatronAccount[]) => (this.patronAccountsSharedCollection = patronAccounts));

    this.bookCopyService
      .query()
      .pipe(map((res: HttpResponse<IBookCopy[]>) => res.body ?? []))
      .pipe(
        map((bookCopies: IBookCopy[]) =>
          this.bookCopyService.addBookCopyToCollectionIfMissing<IBookCopy>(bookCopies, this.notification?.copy)
        )
      )
      .subscribe((bookCopies: IBookCopy[]) => (this.bookCopiesSharedCollection = bookCopies));
  }
}

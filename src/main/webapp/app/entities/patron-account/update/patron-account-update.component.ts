import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { PatronAccountFormService, PatronAccountFormGroup } from './patron-account-form.service';
import { IPatronAccount } from '../patron-account.model';
import { PatronAccountService } from '../service/patron-account.service';
import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';
import { PatronStatus } from 'app/entities/enumerations/patron-status.model';

@Component({
  selector: 'jhi-patron-account-update',
  templateUrl: './patron-account-update.component.html',
})
export class PatronAccountUpdateComponent implements OnInit {
  isSaving = false;
  patronAccount: IPatronAccount | null = null;
  patronStatusValues = Object.keys(PatronStatus);

  usersSharedCollection: IUser[] = [];

  editForm: PatronAccountFormGroup = this.patronAccountFormService.createPatronAccountFormGroup();

  constructor(
    protected patronAccountService: PatronAccountService,
    protected patronAccountFormService: PatronAccountFormService,
    protected userService: UserService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareUser = (o1: IUser | null, o2: IUser | null): boolean => this.userService.compareUser(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ patronAccount }) => {
      this.patronAccount = patronAccount;
      if (patronAccount) {
        this.updateForm(patronAccount);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const patronAccount = this.patronAccountFormService.getPatronAccount(this.editForm);
    if (patronAccount.cardNumber !== null) {
      this.subscribeToSaveResponse(this.patronAccountService.update(patronAccount));
    } else {
      this.subscribeToSaveResponse(this.patronAccountService.create(patronAccount));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IPatronAccount>>): void {
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

  protected updateForm(patronAccount: IPatronAccount): void {
    this.patronAccount = patronAccount;
    this.patronAccountFormService.resetForm(this.editForm, patronAccount);

    this.usersSharedCollection = this.userService.addUserToCollectionIfMissing<IUser>(this.usersSharedCollection, patronAccount.user);
  }

  protected loadRelationshipsOptions(): void {
    this.userService
      .query()
      .pipe(map((res: HttpResponse<IUser[]>) => res.body ?? []))
      .pipe(map((users: IUser[]) => this.userService.addUserToCollectionIfMissing<IUser>(users, this.patronAccount?.user)))
      .subscribe((users: IUser[]) => (this.usersSharedCollection = users));
  }
}

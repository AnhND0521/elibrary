import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IPatronAccount, NewPatronAccount } from '../patron-account.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { cardNumber: unknown }> = Partial<Omit<T, 'cardNumber'>> & { cardNumber: T['cardNumber'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IPatronAccount for edit and NewPatronAccountFormGroupInput for create.
 */
type PatronAccountFormGroupInput = IPatronAccount | PartialWithRequiredKeyOf<NewPatronAccount>;

type PatronAccountFormDefaults = Pick<NewPatronAccount, 'cardNumber'>;

type PatronAccountFormGroupContent = {
  cardNumber: FormControl<IPatronAccount['cardNumber'] | NewPatronAccount['cardNumber']>;
  firstName: FormControl<IPatronAccount['firstName']>;
  surname: FormControl<IPatronAccount['surname']>;
  email: FormControl<IPatronAccount['email']>;
  status: FormControl<IPatronAccount['status']>;
  user: FormControl<IPatronAccount['user']>;
};

export type PatronAccountFormGroup = FormGroup<PatronAccountFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class PatronAccountFormService {
  createPatronAccountFormGroup(patronAccount: PatronAccountFormGroupInput = { cardNumber: null }): PatronAccountFormGroup {
    const patronAccountRawValue = {
      ...this.getFormDefaults(),
      ...patronAccount,
    };
    return new FormGroup<PatronAccountFormGroupContent>({
      cardNumber: new FormControl(
        { value: patronAccountRawValue.cardNumber, disabled: patronAccountRawValue.cardNumber !== null },
        {
          nonNullable: true,
          validators: [Validators.required, Validators.maxLength(10)],
        }
      ),
      firstName: new FormControl(patronAccountRawValue.firstName, {
        validators: [Validators.required, Validators.maxLength(255)],
      }),
      surname: new FormControl(patronAccountRawValue.surname, {
        validators: [Validators.required, Validators.maxLength(255)],
      }),
      email: new FormControl(patronAccountRawValue.email, {
        validators: [Validators.required, Validators.maxLength(255)],
      }),
      status: new FormControl(patronAccountRawValue.status),
      user: new FormControl(patronAccountRawValue.user),
    });
  }

  getPatronAccount(form: PatronAccountFormGroup): IPatronAccount | NewPatronAccount {
    return form.getRawValue() as IPatronAccount | NewPatronAccount;
  }

  resetForm(form: PatronAccountFormGroup, patronAccount: PatronAccountFormGroupInput): void {
    const patronAccountRawValue = { ...this.getFormDefaults(), ...patronAccount };
    form.reset(
      {
        ...patronAccountRawValue,
        cardNumber: { value: patronAccountRawValue.cardNumber, disabled: patronAccountRawValue.cardNumber !== null },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): PatronAccountFormDefaults {
    return {
      cardNumber: null,
    };
  }
}

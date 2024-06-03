import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IWaitlistItem, NewWaitlistItem } from '../waitlist-item.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IWaitlistItem for edit and NewWaitlistItemFormGroupInput for create.
 */
type WaitlistItemFormGroupInput = IWaitlistItem | PartialWithRequiredKeyOf<NewWaitlistItem>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends IWaitlistItem | NewWaitlistItem> = Omit<T, 'timestamp'> & {
  timestamp?: string | null;
};

type WaitlistItemFormRawValue = FormValueOf<IWaitlistItem>;

type NewWaitlistItemFormRawValue = FormValueOf<NewWaitlistItem>;

type WaitlistItemFormDefaults = Pick<NewWaitlistItem, 'id' | 'timestamp'>;

type WaitlistItemFormGroupContent = {
  id: FormControl<WaitlistItemFormRawValue['id'] | NewWaitlistItem['id']>;
  timestamp: FormControl<WaitlistItemFormRawValue['timestamp']>;
  book: FormControl<WaitlistItemFormRawValue['book']>;
  patron: FormControl<WaitlistItemFormRawValue['patron']>;
};

export type WaitlistItemFormGroup = FormGroup<WaitlistItemFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class WaitlistItemFormService {
  createWaitlistItemFormGroup(waitlistItem: WaitlistItemFormGroupInput = { id: null }): WaitlistItemFormGroup {
    const waitlistItemRawValue = this.convertWaitlistItemToWaitlistItemRawValue({
      ...this.getFormDefaults(),
      ...waitlistItem,
    });
    return new FormGroup<WaitlistItemFormGroupContent>({
      id: new FormControl(
        { value: waitlistItemRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      timestamp: new FormControl(waitlistItemRawValue.timestamp),
      book: new FormControl(waitlistItemRawValue.book),
      patron: new FormControl(waitlistItemRawValue.patron),
    });
  }

  getWaitlistItem(form: WaitlistItemFormGroup): IWaitlistItem | NewWaitlistItem {
    return this.convertWaitlistItemRawValueToWaitlistItem(form.getRawValue() as WaitlistItemFormRawValue | NewWaitlistItemFormRawValue);
  }

  resetForm(form: WaitlistItemFormGroup, waitlistItem: WaitlistItemFormGroupInput): void {
    const waitlistItemRawValue = this.convertWaitlistItemToWaitlistItemRawValue({ ...this.getFormDefaults(), ...waitlistItem });
    form.reset(
      {
        ...waitlistItemRawValue,
        id: { value: waitlistItemRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): WaitlistItemFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      timestamp: currentTime,
    };
  }

  private convertWaitlistItemRawValueToWaitlistItem(
    rawWaitlistItem: WaitlistItemFormRawValue | NewWaitlistItemFormRawValue
  ): IWaitlistItem | NewWaitlistItem {
    return {
      ...rawWaitlistItem,
      timestamp: dayjs(rawWaitlistItem.timestamp, DATE_TIME_FORMAT),
    };
  }

  private convertWaitlistItemToWaitlistItemRawValue(
    waitlistItem: IWaitlistItem | (Partial<NewWaitlistItem> & WaitlistItemFormDefaults)
  ): WaitlistItemFormRawValue | PartialWithRequiredKeyOf<NewWaitlistItemFormRawValue> {
    return {
      ...waitlistItem,
      timestamp: waitlistItem.timestamp ? waitlistItem.timestamp.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}

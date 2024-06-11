import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IBookCopy, NewBookCopy } from '../book-copy.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IBookCopy for edit and NewBookCopyFormGroupInput for create.
 */
type BookCopyFormGroupInput = IBookCopy | PartialWithRequiredKeyOf<NewBookCopy>;

type BookCopyFormDefaults = Pick<NewBookCopy, 'id'>;

type BookCopyFormGroupContent = {
  id: FormControl<IBookCopy['id'] | NewBookCopy['id']>;
  title: FormControl<IBookCopy['title']>;
  yearPublished: FormControl<IBookCopy['yearPublished']>;
  language: FormControl<IBookCopy['language']>;
  status: FormControl<IBookCopy['status']>;
  book: FormControl<IBookCopy['book']>;
  publisher: FormControl<IBookCopy['publisher']>;
};

export type BookCopyFormGroup = FormGroup<BookCopyFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class BookCopyFormService {
  createBookCopyFormGroup(bookCopy: BookCopyFormGroupInput = { id: null }): BookCopyFormGroup {
    const bookCopyRawValue = {
      ...this.getFormDefaults(),
      ...bookCopy,
    };
    return new FormGroup<BookCopyFormGroupContent>({
      id: new FormControl(
        { value: bookCopyRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      title: new FormControl(bookCopyRawValue.title, {
        validators: [Validators.maxLength(255)],
      }),
      yearPublished: new FormControl(bookCopyRawValue.yearPublished),
      language: new FormControl(bookCopyRawValue.language, {
        validators: [Validators.maxLength(20)],
      }),
      status: new FormControl(bookCopyRawValue.status),
      book: new FormControl(bookCopyRawValue.book),
      publisher: new FormControl(bookCopyRawValue.publisher),
    });
  }

  getBookCopy(form: BookCopyFormGroup): IBookCopy | NewBookCopy {
    return form.getRawValue() as IBookCopy | NewBookCopy;
  }

  resetForm(form: BookCopyFormGroup, bookCopy: BookCopyFormGroupInput): void {
    const bookCopyRawValue = { ...this.getFormDefaults(), ...bookCopy };
    form.reset(
      {
        ...bookCopyRawValue,
        id: { value: bookCopyRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): BookCopyFormDefaults {
    return {
      id: null,
    };
  }
}

import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../patron-account.test-samples';

import { PatronAccountFormService } from './patron-account-form.service';

describe('PatronAccount Form Service', () => {
  let service: PatronAccountFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PatronAccountFormService);
  });

  describe('Service methods', () => {
    describe('createPatronAccountFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createPatronAccountFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            cardNumber: expect.any(Object),
            firstName: expect.any(Object),
            surname: expect.any(Object),
            email: expect.any(Object),
            status: expect.any(Object),
            user: expect.any(Object),
          })
        );
      });

      it('passing IPatronAccount should create a new form with FormGroup', () => {
        const formGroup = service.createPatronAccountFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            cardNumber: expect.any(Object),
            firstName: expect.any(Object),
            surname: expect.any(Object),
            email: expect.any(Object),
            status: expect.any(Object),
            user: expect.any(Object),
          })
        );
      });
    });

    describe('getPatronAccount', () => {
      it('should return NewPatronAccount for default PatronAccount initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createPatronAccountFormGroup(sampleWithNewData);

        const patronAccount = service.getPatronAccount(formGroup) as any;

        expect(patronAccount).toMatchObject(sampleWithNewData);
      });

      it('should return NewPatronAccount for empty PatronAccount initial value', () => {
        const formGroup = service.createPatronAccountFormGroup();

        const patronAccount = service.getPatronAccount(formGroup) as any;

        expect(patronAccount).toMatchObject({});
      });

      it('should return IPatronAccount', () => {
        const formGroup = service.createPatronAccountFormGroup(sampleWithRequiredData);

        const patronAccount = service.getPatronAccount(formGroup) as any;

        expect(patronAccount).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IPatronAccount should not enable cardNumber FormControl', () => {
        const formGroup = service.createPatronAccountFormGroup();
        expect(formGroup.controls.cardNumber.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.cardNumber.disabled).toBe(true);
      });

      it('passing NewPatronAccount should disable cardNumber FormControl', () => {
        const formGroup = service.createPatronAccountFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.cardNumber.disabled).toBe(true);

        service.resetForm(formGroup, { cardNumber: null });

        expect(formGroup.controls.cardNumber.disabled).toBe(true);
      });
    });
  });
});

import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../waitlist-item.test-samples';

import { WaitlistItemFormService } from './waitlist-item-form.service';

describe('WaitlistItem Form Service', () => {
  let service: WaitlistItemFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WaitlistItemFormService);
  });

  describe('Service methods', () => {
    describe('createWaitlistItemFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createWaitlistItemFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            timestamp: expect.any(Object),
            book: expect.any(Object),
            patron: expect.any(Object),
          })
        );
      });

      it('passing IWaitlistItem should create a new form with FormGroup', () => {
        const formGroup = service.createWaitlistItemFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            timestamp: expect.any(Object),
            book: expect.any(Object),
            patron: expect.any(Object),
          })
        );
      });
    });

    describe('getWaitlistItem', () => {
      it('should return NewWaitlistItem for default WaitlistItem initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createWaitlistItemFormGroup(sampleWithNewData);

        const waitlistItem = service.getWaitlistItem(formGroup) as any;

        expect(waitlistItem).toMatchObject(sampleWithNewData);
      });

      it('should return NewWaitlistItem for empty WaitlistItem initial value', () => {
        const formGroup = service.createWaitlistItemFormGroup();

        const waitlistItem = service.getWaitlistItem(formGroup) as any;

        expect(waitlistItem).toMatchObject({});
      });

      it('should return IWaitlistItem', () => {
        const formGroup = service.createWaitlistItemFormGroup(sampleWithRequiredData);

        const waitlistItem = service.getWaitlistItem(formGroup) as any;

        expect(waitlistItem).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IWaitlistItem should not enable id FormControl', () => {
        const formGroup = service.createWaitlistItemFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewWaitlistItem should disable id FormControl', () => {
        const formGroup = service.createWaitlistItemFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});

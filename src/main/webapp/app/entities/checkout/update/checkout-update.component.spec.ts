import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { CheckoutFormService } from './checkout-form.service';
import { CheckoutService } from '../service/checkout.service';
import { ICheckout } from '../checkout.model';
import { IBookCopy } from 'app/entities/book-copy/book-copy.model';
import { BookCopyService } from 'app/entities/book-copy/service/book-copy.service';
import { IPatronAccount } from 'app/entities/patron-account/patron-account.model';
import { PatronAccountService } from 'app/entities/patron-account/service/patron-account.service';

import { CheckoutUpdateComponent } from './checkout-update.component';

describe('Checkout Management Update Component', () => {
  let comp: CheckoutUpdateComponent;
  let fixture: ComponentFixture<CheckoutUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let checkoutFormService: CheckoutFormService;
  let checkoutService: CheckoutService;
  let bookCopyService: BookCopyService;
  let patronAccountService: PatronAccountService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [CheckoutUpdateComponent],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(CheckoutUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(CheckoutUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    checkoutFormService = TestBed.inject(CheckoutFormService);
    checkoutService = TestBed.inject(CheckoutService);
    bookCopyService = TestBed.inject(BookCopyService);
    patronAccountService = TestBed.inject(PatronAccountService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call BookCopy query and add missing value', () => {
      const checkout: ICheckout = { id: 456 };
      const copy: IBookCopy = { id: 92584 };
      checkout.copy = copy;

      const bookCopyCollection: IBookCopy[] = [{ id: 92827 }];
      jest.spyOn(bookCopyService, 'query').mockReturnValue(of(new HttpResponse({ body: bookCopyCollection })));
      const additionalBookCopies = [copy];
      const expectedCollection: IBookCopy[] = [...additionalBookCopies, ...bookCopyCollection];
      jest.spyOn(bookCopyService, 'addBookCopyToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ checkout });
      comp.ngOnInit();

      expect(bookCopyService.query).toHaveBeenCalled();
      expect(bookCopyService.addBookCopyToCollectionIfMissing).toHaveBeenCalledWith(
        bookCopyCollection,
        ...additionalBookCopies.map(expect.objectContaining)
      );
      expect(comp.bookCopiesSharedCollection).toEqual(expectedCollection);
    });

    it('Should call PatronAccount query and add missing value', () => {
      const checkout: ICheckout = { id: 456 };
      const patron: IPatronAccount = { cardNumber: '6063f37e-c' };
      checkout.patron = patron;

      const patronAccountCollection: IPatronAccount[] = [{ cardNumber: 'ab123fa0-5' }];
      jest.spyOn(patronAccountService, 'query').mockReturnValue(of(new HttpResponse({ body: patronAccountCollection })));
      const additionalPatronAccounts = [patron];
      const expectedCollection: IPatronAccount[] = [...additionalPatronAccounts, ...patronAccountCollection];
      jest.spyOn(patronAccountService, 'addPatronAccountToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ checkout });
      comp.ngOnInit();

      expect(patronAccountService.query).toHaveBeenCalled();
      expect(patronAccountService.addPatronAccountToCollectionIfMissing).toHaveBeenCalledWith(
        patronAccountCollection,
        ...additionalPatronAccounts.map(expect.objectContaining)
      );
      expect(comp.patronAccountsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const checkout: ICheckout = { id: 456 };
      const copy: IBookCopy = { id: 65643 };
      checkout.copy = copy;
      const patron: IPatronAccount = { cardNumber: '4a1ac045-f' };
      checkout.patron = patron;

      activatedRoute.data = of({ checkout });
      comp.ngOnInit();

      expect(comp.bookCopiesSharedCollection).toContain(copy);
      expect(comp.patronAccountsSharedCollection).toContain(patron);
      expect(comp.checkout).toEqual(checkout);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ICheckout>>();
      const checkout = { id: 123 };
      jest.spyOn(checkoutFormService, 'getCheckout').mockReturnValue(checkout);
      jest.spyOn(checkoutService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ checkout });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: checkout }));
      saveSubject.complete();

      // THEN
      expect(checkoutFormService.getCheckout).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(checkoutService.update).toHaveBeenCalledWith(expect.objectContaining(checkout));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ICheckout>>();
      const checkout = { id: 123 };
      jest.spyOn(checkoutFormService, 'getCheckout').mockReturnValue({ id: null });
      jest.spyOn(checkoutService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ checkout: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: checkout }));
      saveSubject.complete();

      // THEN
      expect(checkoutFormService.getCheckout).toHaveBeenCalled();
      expect(checkoutService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ICheckout>>();
      const checkout = { id: 123 };
      jest.spyOn(checkoutService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ checkout });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(checkoutService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareBookCopy', () => {
      it('Should forward to bookCopyService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(bookCopyService, 'compareBookCopy');
        comp.compareBookCopy(entity, entity2);
        expect(bookCopyService.compareBookCopy).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('comparePatronAccount', () => {
      it('Should forward to patronAccountService', () => {
        const entity = { cardNumber: 'ABC' };
        const entity2 = { cardNumber: 'CBA' };
        jest.spyOn(patronAccountService, 'comparePatronAccount');
        comp.comparePatronAccount(entity, entity2);
        expect(patronAccountService.comparePatronAccount).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});

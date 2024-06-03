import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { WaitlistItemFormService } from './waitlist-item-form.service';
import { WaitlistItemService } from '../service/waitlist-item.service';
import { IWaitlistItem } from '../waitlist-item.model';
import { IBook } from 'app/entities/book/book.model';
import { BookService } from 'app/entities/book/service/book.service';
import { IPatronAccount } from 'app/entities/patron-account/patron-account.model';
import { PatronAccountService } from 'app/entities/patron-account/service/patron-account.service';

import { WaitlistItemUpdateComponent } from './waitlist-item-update.component';

describe('WaitlistItem Management Update Component', () => {
  let comp: WaitlistItemUpdateComponent;
  let fixture: ComponentFixture<WaitlistItemUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let waitlistItemFormService: WaitlistItemFormService;
  let waitlistItemService: WaitlistItemService;
  let bookService: BookService;
  let patronAccountService: PatronAccountService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [WaitlistItemUpdateComponent],
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
      .overrideTemplate(WaitlistItemUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(WaitlistItemUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    waitlistItemFormService = TestBed.inject(WaitlistItemFormService);
    waitlistItemService = TestBed.inject(WaitlistItemService);
    bookService = TestBed.inject(BookService);
    patronAccountService = TestBed.inject(PatronAccountService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Book query and add missing value', () => {
      const waitlistItem: IWaitlistItem = { id: 456 };
      const book: IBook = { id: 52842 };
      waitlistItem.book = book;

      const bookCollection: IBook[] = [{ id: 36232 }];
      jest.spyOn(bookService, 'query').mockReturnValue(of(new HttpResponse({ body: bookCollection })));
      const additionalBooks = [book];
      const expectedCollection: IBook[] = [...additionalBooks, ...bookCollection];
      jest.spyOn(bookService, 'addBookToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ waitlistItem });
      comp.ngOnInit();

      expect(bookService.query).toHaveBeenCalled();
      expect(bookService.addBookToCollectionIfMissing).toHaveBeenCalledWith(
        bookCollection,
        ...additionalBooks.map(expect.objectContaining)
      );
      expect(comp.booksSharedCollection).toEqual(expectedCollection);
    });

    it('Should call PatronAccount query and add missing value', () => {
      const waitlistItem: IWaitlistItem = { id: 456 };
      const patron: IPatronAccount = { cardNumber: '7dbd5aeb-7' };
      waitlistItem.patron = patron;

      const patronAccountCollection: IPatronAccount[] = [{ cardNumber: 'a15ea997-e' }];
      jest.spyOn(patronAccountService, 'query').mockReturnValue(of(new HttpResponse({ body: patronAccountCollection })));
      const additionalPatronAccounts = [patron];
      const expectedCollection: IPatronAccount[] = [...additionalPatronAccounts, ...patronAccountCollection];
      jest.spyOn(patronAccountService, 'addPatronAccountToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ waitlistItem });
      comp.ngOnInit();

      expect(patronAccountService.query).toHaveBeenCalled();
      expect(patronAccountService.addPatronAccountToCollectionIfMissing).toHaveBeenCalledWith(
        patronAccountCollection,
        ...additionalPatronAccounts.map(expect.objectContaining)
      );
      expect(comp.patronAccountsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const waitlistItem: IWaitlistItem = { id: 456 };
      const book: IBook = { id: 66636 };
      waitlistItem.book = book;
      const patron: IPatronAccount = { cardNumber: '0469aaf2-4' };
      waitlistItem.patron = patron;

      activatedRoute.data = of({ waitlistItem });
      comp.ngOnInit();

      expect(comp.booksSharedCollection).toContain(book);
      expect(comp.patronAccountsSharedCollection).toContain(patron);
      expect(comp.waitlistItem).toEqual(waitlistItem);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IWaitlistItem>>();
      const waitlistItem = { id: 123 };
      jest.spyOn(waitlistItemFormService, 'getWaitlistItem').mockReturnValue(waitlistItem);
      jest.spyOn(waitlistItemService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ waitlistItem });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: waitlistItem }));
      saveSubject.complete();

      // THEN
      expect(waitlistItemFormService.getWaitlistItem).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(waitlistItemService.update).toHaveBeenCalledWith(expect.objectContaining(waitlistItem));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IWaitlistItem>>();
      const waitlistItem = { id: 123 };
      jest.spyOn(waitlistItemFormService, 'getWaitlistItem').mockReturnValue({ id: null });
      jest.spyOn(waitlistItemService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ waitlistItem: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: waitlistItem }));
      saveSubject.complete();

      // THEN
      expect(waitlistItemFormService.getWaitlistItem).toHaveBeenCalled();
      expect(waitlistItemService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IWaitlistItem>>();
      const waitlistItem = { id: 123 };
      jest.spyOn(waitlistItemService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ waitlistItem });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(waitlistItemService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareBook', () => {
      it('Should forward to bookService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(bookService, 'compareBook');
        comp.compareBook(entity, entity2);
        expect(bookService.compareBook).toHaveBeenCalledWith(entity, entity2);
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

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { PatronAccountFormService } from './patron-account-form.service';
import { PatronAccountService } from '../service/patron-account.service';
import { IPatronAccount } from '../patron-account.model';

import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';

import { PatronAccountUpdateComponent } from './patron-account-update.component';

describe('PatronAccount Management Update Component', () => {
  let comp: PatronAccountUpdateComponent;
  let fixture: ComponentFixture<PatronAccountUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let patronAccountFormService: PatronAccountFormService;
  let patronAccountService: PatronAccountService;
  let userService: UserService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [PatronAccountUpdateComponent],
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
      .overrideTemplate(PatronAccountUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(PatronAccountUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    patronAccountFormService = TestBed.inject(PatronAccountFormService);
    patronAccountService = TestBed.inject(PatronAccountService);
    userService = TestBed.inject(UserService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call User query and add missing value', () => {
      const patronAccount: IPatronAccount = { cardNumber: 'CBA' };
      const user: IUser = { id: 28968 };
      patronAccount.user = user;

      const userCollection: IUser[] = [{ id: 18785 }];
      jest.spyOn(userService, 'query').mockReturnValue(of(new HttpResponse({ body: userCollection })));
      const additionalUsers = [user];
      const expectedCollection: IUser[] = [...additionalUsers, ...userCollection];
      jest.spyOn(userService, 'addUserToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ patronAccount });
      comp.ngOnInit();

      expect(userService.query).toHaveBeenCalled();
      expect(userService.addUserToCollectionIfMissing).toHaveBeenCalledWith(
        userCollection,
        ...additionalUsers.map(expect.objectContaining)
      );
      expect(comp.usersSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const patronAccount: IPatronAccount = { cardNumber: 'CBA' };
      const user: IUser = { id: 55275 };
      patronAccount.user = user;

      activatedRoute.data = of({ patronAccount });
      comp.ngOnInit();

      expect(comp.usersSharedCollection).toContain(user);
      expect(comp.patronAccount).toEqual(patronAccount);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IPatronAccount>>();
      const patronAccount = { cardNumber: 'ABC' };
      jest.spyOn(patronAccountFormService, 'getPatronAccount').mockReturnValue(patronAccount);
      jest.spyOn(patronAccountService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ patronAccount });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: patronAccount }));
      saveSubject.complete();

      // THEN
      expect(patronAccountFormService.getPatronAccount).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(patronAccountService.update).toHaveBeenCalledWith(expect.objectContaining(patronAccount));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IPatronAccount>>();
      const patronAccount = { cardNumber: 'ABC' };
      jest.spyOn(patronAccountFormService, 'getPatronAccount').mockReturnValue({ cardNumber: null });
      jest.spyOn(patronAccountService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ patronAccount: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: patronAccount }));
      saveSubject.complete();

      // THEN
      expect(patronAccountFormService.getPatronAccount).toHaveBeenCalled();
      expect(patronAccountService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IPatronAccount>>();
      const patronAccount = { cardNumber: 'ABC' };
      jest.spyOn(patronAccountService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ patronAccount });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(patronAccountService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareUser', () => {
      it('Should forward to userService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(userService, 'compareUser');
        comp.compareUser(entity, entity2);
        expect(userService.compareUser).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});

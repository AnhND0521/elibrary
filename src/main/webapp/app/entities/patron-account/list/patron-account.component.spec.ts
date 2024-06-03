import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { PatronAccountService } from '../service/patron-account.service';

import { PatronAccountComponent } from './patron-account.component';
import SpyInstance = jest.SpyInstance;

describe('PatronAccount Management Component', () => {
  let comp: PatronAccountComponent;
  let fixture: ComponentFixture<PatronAccountComponent>;
  let service: PatronAccountService;
  let routerNavigateSpy: SpyInstance<Promise<boolean>>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'patron-account', component: PatronAccountComponent }]), HttpClientTestingModule],
      declarations: [PatronAccountComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            data: of({
              defaultSort: 'cardNumber,asc',
            }),
            queryParamMap: of(
              jest.requireActual('@angular/router').convertToParamMap({
                page: '1',
                size: '1',
                sort: 'cardNumber,desc',
              })
            ),
            snapshot: { queryParams: {} },
          },
        },
      ],
    })
      .overrideTemplate(PatronAccountComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(PatronAccountComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(PatronAccountService);
    routerNavigateSpy = jest.spyOn(comp.router, 'navigate');

    const headers = new HttpHeaders();
    jest.spyOn(service, 'query').mockReturnValue(
      of(
        new HttpResponse({
          body: [{ cardNumber: 'ABC' }],
          headers,
        })
      )
    );
  });

  it('Should call load all on init', () => {
    // WHEN
    comp.ngOnInit();

    // THEN
    expect(service.query).toHaveBeenCalled();
    expect(comp.patronAccounts?.[0]).toEqual(expect.objectContaining({ cardNumber: 'ABC' }));
  });

  describe('trackCardNumber', () => {
    it('Should forward to patronAccountService', () => {
      const entity = { cardNumber: 'ABC' };
      jest.spyOn(service, 'getPatronAccountIdentifier');
      const cardNumber = comp.trackCardNumber(0, entity);
      expect(service.getPatronAccountIdentifier).toHaveBeenCalledWith(entity);
      expect(cardNumber).toBe(entity.cardNumber);
    });
  });

  it('should load a page', () => {
    // WHEN
    comp.navigateToPage(1);

    // THEN
    expect(routerNavigateSpy).toHaveBeenCalled();
  });

  it('should calculate the sort attribute for an id', () => {
    // WHEN
    comp.ngOnInit();

    // THEN
    expect(service.query).toHaveBeenLastCalledWith(expect.objectContaining({ sort: ['cardNumber,desc'] }));
  });

  it('should calculate the sort attribute for a non-id attribute', () => {
    // GIVEN
    comp.predicate = 'name';

    // WHEN
    comp.navigateToWithComponentValues();

    // THEN
    expect(routerNavigateSpy).toHaveBeenLastCalledWith(
      expect.anything(),
      expect.objectContaining({
        queryParams: expect.objectContaining({
          sort: ['name,asc'],
        }),
      })
    );
  });
});

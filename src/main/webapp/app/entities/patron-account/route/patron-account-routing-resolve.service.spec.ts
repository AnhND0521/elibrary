import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { IPatronAccount } from '../patron-account.model';
import { PatronAccountService } from '../service/patron-account.service';

import { PatronAccountRoutingResolveService } from './patron-account-routing-resolve.service';

describe('PatronAccount routing resolve service', () => {
  let mockRouter: Router;
  let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
  let routingResolveService: PatronAccountRoutingResolveService;
  let service: PatronAccountService;
  let resultPatronAccount: IPatronAccount | null | undefined;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: convertToParamMap({}),
            },
          },
        },
      ],
    });
    mockRouter = TestBed.inject(Router);
    jest.spyOn(mockRouter, 'navigate').mockImplementation(() => Promise.resolve(true));
    mockActivatedRouteSnapshot = TestBed.inject(ActivatedRoute).snapshot;
    routingResolveService = TestBed.inject(PatronAccountRoutingResolveService);
    service = TestBed.inject(PatronAccountService);
    resultPatronAccount = undefined;
  });

  describe('resolve', () => {
    it('should return IPatronAccount returned by find', () => {
      // GIVEN
      service.find = jest.fn(cardNumber => of(new HttpResponse({ body: { cardNumber } })));
      mockActivatedRouteSnapshot.params = { cardNumber: 'ABC' };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultPatronAccount = result;
      });

      // THEN
      expect(service.find).toBeCalledWith('ABC');
      expect(resultPatronAccount).toEqual({ cardNumber: 'ABC' });
    });

    it('should return null if id is not provided', () => {
      // GIVEN
      service.find = jest.fn();
      mockActivatedRouteSnapshot.params = {};

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultPatronAccount = result;
      });

      // THEN
      expect(service.find).not.toBeCalled();
      expect(resultPatronAccount).toEqual(null);
    });

    it('should route to 404 page if data not found in server', () => {
      // GIVEN
      jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse<IPatronAccount>({ body: null })));
      mockActivatedRouteSnapshot.params = { cardNumber: 'ABC' };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultPatronAccount = result;
      });

      // THEN
      expect(service.find).toBeCalledWith('ABC');
      expect(resultPatronAccount).toEqual(undefined);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
    });
  });
});

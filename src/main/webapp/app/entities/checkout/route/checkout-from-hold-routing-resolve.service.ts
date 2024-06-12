import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ICheckout } from '../checkout.model';
import { CheckoutService } from '../service/checkout.service';
import { HoldService } from 'app/entities/hold/service/hold.service';
import { IHold } from 'app/entities/hold/hold.model';
import dayjs from 'dayjs/esm';

@Injectable({ providedIn: 'root' })
export class CheckoutFromHoldRoutingResolveService implements Resolve<ICheckout | null> {
  constructor(protected checkoutService: CheckoutService, protected holdService: HoldService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ICheckout | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.holdService.find(id).pipe(
        mergeMap((hold: HttpResponse<IHold>) => {
          console.log(hold.body!.copy);
          if (hold.body) {
            const checkout: ICheckout = {
              id: 0,
              patron: hold.body.patron,
              copy: hold.body.copy,
              startTime: dayjs(),
              endTime: dayjs().add(30, 'days'),
              isReturned: false,
            };
            return of(checkout);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(null);
  }
}

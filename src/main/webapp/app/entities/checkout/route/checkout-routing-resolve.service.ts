import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ICheckout } from '../checkout.model';
import { CheckoutService } from '../service/checkout.service';

@Injectable({ providedIn: 'root' })
export class CheckoutRoutingResolveService implements Resolve<ICheckout | null> {
  constructor(protected service: CheckoutService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ICheckout | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((checkout: HttpResponse<ICheckout>) => {
          if (checkout.body) {
            return of(checkout.body);
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

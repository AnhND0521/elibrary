import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IPatronAccount } from '../patron-account.model';
import { PatronAccountService } from '../service/patron-account.service';

@Injectable({ providedIn: 'root' })
export class PatronAccountRoutingResolveService implements Resolve<IPatronAccount | null> {
  constructor(protected service: PatronAccountService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IPatronAccount | null | never> {
    const id = route.params['cardNumber'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((patronAccount: HttpResponse<IPatronAccount>) => {
          if (patronAccount.body) {
            return of(patronAccount.body);
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

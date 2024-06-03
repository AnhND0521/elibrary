import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IHold } from '../hold.model';
import { HoldService } from '../service/hold.service';

@Injectable({ providedIn: 'root' })
export class HoldRoutingResolveService implements Resolve<IHold | null> {
  constructor(protected service: HoldService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IHold | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((hold: HttpResponse<IHold>) => {
          if (hold.body) {
            return of(hold.body);
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

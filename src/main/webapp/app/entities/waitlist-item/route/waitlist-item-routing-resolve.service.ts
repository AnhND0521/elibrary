import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IWaitlistItem } from '../waitlist-item.model';
import { WaitlistItemService } from '../service/waitlist-item.service';

@Injectable({ providedIn: 'root' })
export class WaitlistItemRoutingResolveService implements Resolve<IWaitlistItem | null> {
  constructor(protected service: WaitlistItemService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IWaitlistItem | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((waitlistItem: HttpResponse<IWaitlistItem>) => {
          if (waitlistItem.body) {
            return of(waitlistItem.body);
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

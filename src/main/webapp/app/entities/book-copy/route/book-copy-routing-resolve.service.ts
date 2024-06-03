import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IBookCopy } from '../book-copy.model';
import { BookCopyService } from '../service/book-copy.service';

@Injectable({ providedIn: 'root' })
export class BookCopyRoutingResolveService implements Resolve<IBookCopy | null> {
  constructor(protected service: BookCopyService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IBookCopy | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((bookCopy: HttpResponse<IBookCopy>) => {
          if (bookCopy.body) {
            return of(bookCopy.body);
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

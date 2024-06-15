import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { IBookCopy } from 'app/entities/book-copy/book-copy.model';
import { IWaitlistItem } from 'app/entities/waitlist-item/waitlist-item.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BookDetailsService {
  bookCopyResource: string = this.applicationConfigService.getEndpointFor('api/book-copies');
  waitlistItemResource: string = this.applicationConfigService.getEndpointFor('api/waitlist-items');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  getBookCopies(bookId: number): Observable<HttpResponse<IBookCopy[]>> {
    return this.http.get<IBookCopy[]>(`${this.bookCopyResource}/find-by-book?id=${bookId}`, { observe: 'response' });
  }

  findWaitlistItem(bookId: number): Observable<HttpResponse<IWaitlistItem>> {
    return this.http.get<IWaitlistItem>(`${this.waitlistItemResource}/my/find-by-book?id=${bookId}`, { observe: 'response' });
  }
}

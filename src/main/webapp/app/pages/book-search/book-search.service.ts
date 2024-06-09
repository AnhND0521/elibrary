import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IBook } from 'app/entities/book/book.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BookSearchService {
  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  search(params: any): Observable<HttpResponse<IBook[]>> {
    const options = createRequestOption(params);
    return this.http.get<IBook[]>(this.applicationConfigService.getEndpointFor('api/books/search'), {
      params: options,
      observe: 'response',
    });
  }
}

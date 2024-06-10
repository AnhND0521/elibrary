import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IAuthor } from 'app/entities/author/author.model';
import { IBook } from 'app/entities/book/book.model';
import { ICategory } from 'app/entities/category/category.model';
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

  getCategories(params: any = {}): Observable<HttpResponse<ICategory[]>> {
    const options = createRequestOption(params);
    return this.http.get<ICategory[]>(this.applicationConfigService.getEndpointFor('api/categories'), {
      params: options,
      observe: 'response',
    });
  }

  getAuthors(params: any = {}): Observable<HttpResponse<IAuthor[]>> {
    const options = createRequestOption(params);
    return this.http.get<IAuthor[]>(this.applicationConfigService.getEndpointFor('api/authors'), { params: options, observe: 'response' });
  }
}

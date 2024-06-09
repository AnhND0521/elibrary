import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { Observable } from 'rxjs';
import { IBook } from 'app/entities/book/book.model';
import { createRequestOption } from 'app/core/request/request-util';
import { ICategory } from 'app/entities/category/category.model';

@Injectable({
  providedIn: 'root',
})
export class BookCatalogService {
  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  getTopCategories(): Observable<HttpResponse<ICategory[]>> {
    return this.http.get<ICategory[]>(this.applicationConfigService.getEndpointFor('/api/categories/top'), { observe: 'response' });
  }

  getBooksByCategory(params: any): Observable<HttpResponse<IBook[]>> {
    const options = createRequestOption(params);
    return this.http.get<IBook[]>(this.applicationConfigService.getEndpointFor('/api/books/find-by-category'), {
      params: options,
      observe: 'response',
    });
  }
}

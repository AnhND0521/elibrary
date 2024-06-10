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
  protected bookResourceUrl = this.applicationConfigService.getEndpointFor('api/books');
  protected categoryResourceUrl = this.applicationConfigService.getEndpointFor('api/categories');
  protected authorResourceUrl = this.applicationConfigService.getEndpointFor('api/authors');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  search(params: any): Observable<HttpResponse<IBook[]>> {
    const options = createRequestOption(params);
    return this.http.get<IBook[]>(`${this.bookResourceUrl}/search`, {
      params: options,
      observe: 'response',
    });
  }

  getCategories(params: any = {}): Observable<HttpResponse<ICategory[]>> {
    const options = createRequestOption(params);
    return this.http.get<ICategory[]>(this.categoryResourceUrl, {
      params: options,
      observe: 'response',
    });
  }

  getAuthors(params: any = {}): Observable<HttpResponse<IAuthor[]>> {
    const options = createRequestOption(params);
    return this.http.get<IAuthor[]>(this.authorResourceUrl, { params: options, observe: 'response' });
  }

  getByCategory(params: any): Observable<HttpResponse<IBook[]>> {
    const options = createRequestOption(params);
    return this.http.get<IBook[]>(`${this.bookResourceUrl}/find-by-category`, {
      params: options,
      observe: 'response',
    });
  }

  getByAuthor(params: any): Observable<HttpResponse<IBook[]>> {
    const options = createRequestOption(params);
    return this.http.get<IBook[]>(`${this.bookResourceUrl}/find-by-author`, {
      params: options,
      observe: 'response',
    });
  }

  getCategory(id: number): Observable<HttpResponse<ICategory>> {
    return this.http.get<ICategory>(`${this.categoryResourceUrl}/${id}`, { observe: 'response' });
  }

  getAuthor(id: number): Observable<HttpResponse<IAuthor>> {
    return this.http.get<IAuthor>(`${this.authorResourceUrl}/${id}`, { observe: 'response' });
  }
}

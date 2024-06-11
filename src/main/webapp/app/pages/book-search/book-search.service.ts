import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IAuthor } from 'app/entities/author/author.model';
import { IBook } from 'app/entities/book/book.model';
import { ICategory } from 'app/entities/category/category.model';
import { IPublisher } from 'app/entities/publisher/publisher.model';
import { Observable } from 'rxjs';
import { AUTHOR, CATEGORY, PUBLISHER } from './book-search.constants';

@Injectable({
  providedIn: 'root',
})
export class BookSearchService {
  protected bookResourceUrl = this.applicationConfigService.getEndpointFor('api/books');
  protected subjectResourceUrls: any = {};
  protected subjectInterfaces: any = {};

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {
    this.subjectResourceUrls[CATEGORY] = this.applicationConfigService.getEndpointFor('api/categories');
    this.subjectResourceUrls[AUTHOR] = this.applicationConfigService.getEndpointFor('api/authors');
    this.subjectResourceUrls[PUBLISHER] = this.applicationConfigService.getEndpointFor('api/publishers');
  }

  search(params: any): Observable<HttpResponse<IBook[]>> {
    const options = createRequestOption(params);
    return this.http.get<IBook[]>(`${this.bookResourceUrl}/search`, {
      params: options,
      observe: 'response',
    });
  }

  getCategories(params: any = {}): Observable<HttpResponse<ICategory[]>> {
    const options = createRequestOption(params);
    return this.http.get<ICategory[]>(this.subjectResourceUrls[CATEGORY], {
      params: options,
      observe: 'response',
    });
  }

  getAuthors(params: any = {}): Observable<HttpResponse<IAuthor[]>> {
    const options = createRequestOption(params);
    return this.http.get<IAuthor[]>(this.subjectResourceUrls[AUTHOR], { params: options, observe: 'response' });
  }

  getBySubject(subjectType: string, params: any): Observable<HttpResponse<IBook[]>> {
    const options = createRequestOption(params);
    return this.http.get<IBook[]>(`${this.bookResourceUrl}/find-by-${subjectType}`, {
      params: options,
      observe: 'response',
    });
  }

  getSubject(subjectType: string, id: number): Observable<HttpResponse<any>> {
    return this.http.get<any>(`${this.subjectResourceUrls[subjectType]}/${id}`, { observe: 'response' });
  }
}

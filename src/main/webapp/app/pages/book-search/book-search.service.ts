import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IAuthor } from 'app/entities/author/author.model';
import { IBook } from 'app/entities/book/book.model';
import { ICategory } from 'app/entities/category/category.model';
import { IPublisher } from 'app/entities/publisher/publisher.model';
import { Observable } from 'rxjs';
import { ALL, AUTHOR, CATEGORY, PUBLISHER, getPluralForm } from './book-search.constants';

@Injectable({
  providedIn: 'root',
})
export class BookSearchService {
  protected bookResourceUrl = this.applicationConfigService.getEndpointFor('api/books');
  protected subjectResourceUrls: any = {};

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {
    for (let subject of ALL)
      this.subjectResourceUrls[subject] = this.applicationConfigService.getEndpointFor('api/' + getPluralForm(subject));
  }

  search(params: any): Observable<HttpResponse<IBook[]>> {
    const options = createRequestOption(params);
    return this.http.get<IBook[]>(`${this.bookResourceUrl}/search`, {
      params: options,
      observe: 'response',
    });
  }

  getBySubject(subjectType: string, params: any): Observable<HttpResponse<IBook[]>> {
    const options = createRequestOption(params);
    return this.http.get<IBook[]>(`${this.bookResourceUrl}/find-by-${subjectType}`, {
      params: options,
      observe: 'response',
    });
  }

  getSubjectList(subjectType: string, params: any = {}): Observable<HttpResponse<any[]>> {
    const options = createRequestOption(params);
    return this.http.get<any[]>(this.subjectResourceUrls[subjectType], { params: options, observe: 'response' });
  }

  getSubject(subjectType: string, id: number): Observable<HttpResponse<any>> {
    return this.http.get<any>(`${this.subjectResourceUrls[subjectType]}/${id}`, { observe: 'response' });
  }
}

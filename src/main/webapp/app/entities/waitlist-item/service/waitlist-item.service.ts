import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IWaitlistItem, NewWaitlistItem } from '../waitlist-item.model';

export type PartialUpdateWaitlistItem = Partial<IWaitlistItem> & Pick<IWaitlistItem, 'id'>;

type RestOf<T extends IWaitlistItem | NewWaitlistItem> = Omit<T, 'timestamp'> & {
  timestamp?: string | null;
};

export type RestWaitlistItem = RestOf<IWaitlistItem>;

export type NewRestWaitlistItem = RestOf<NewWaitlistItem>;

export type PartialUpdateRestWaitlistItem = RestOf<PartialUpdateWaitlistItem>;

export type EntityResponseType = HttpResponse<IWaitlistItem>;
export type EntityArrayResponseType = HttpResponse<IWaitlistItem[]>;

@Injectable({ providedIn: 'root' })
export class WaitlistItemService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/waitlist-items');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(waitlistItem: NewWaitlistItem): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(waitlistItem);
    return this.http
      .post<RestWaitlistItem>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(waitlistItem: IWaitlistItem): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(waitlistItem);
    return this.http
      .put<RestWaitlistItem>(`${this.resourceUrl}/${this.getWaitlistItemIdentifier(waitlistItem)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(waitlistItem: PartialUpdateWaitlistItem): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(waitlistItem);
    return this.http
      .patch<RestWaitlistItem>(`${this.resourceUrl}/${this.getWaitlistItemIdentifier(waitlistItem)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestWaitlistItem>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestWaitlistItem[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getWaitlistItemIdentifier(waitlistItem: Pick<IWaitlistItem, 'id'>): number {
    return waitlistItem.id;
  }

  compareWaitlistItem(o1: Pick<IWaitlistItem, 'id'> | null, o2: Pick<IWaitlistItem, 'id'> | null): boolean {
    return o1 && o2 ? this.getWaitlistItemIdentifier(o1) === this.getWaitlistItemIdentifier(o2) : o1 === o2;
  }

  addWaitlistItemToCollectionIfMissing<Type extends Pick<IWaitlistItem, 'id'>>(
    waitlistItemCollection: Type[],
    ...waitlistItemsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const waitlistItems: Type[] = waitlistItemsToCheck.filter(isPresent);
    if (waitlistItems.length > 0) {
      const waitlistItemCollectionIdentifiers = waitlistItemCollection.map(
        waitlistItemItem => this.getWaitlistItemIdentifier(waitlistItemItem)!
      );
      const waitlistItemsToAdd = waitlistItems.filter(waitlistItemItem => {
        const waitlistItemIdentifier = this.getWaitlistItemIdentifier(waitlistItemItem);
        if (waitlistItemCollectionIdentifiers.includes(waitlistItemIdentifier)) {
          return false;
        }
        waitlistItemCollectionIdentifiers.push(waitlistItemIdentifier);
        return true;
      });
      return [...waitlistItemsToAdd, ...waitlistItemCollection];
    }
    return waitlistItemCollection;
  }

  protected convertDateFromClient<T extends IWaitlistItem | NewWaitlistItem | PartialUpdateWaitlistItem>(waitlistItem: T): RestOf<T> {
    return {
      ...waitlistItem,
      timestamp: waitlistItem.timestamp?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restWaitlistItem: RestWaitlistItem): IWaitlistItem {
    return {
      ...restWaitlistItem,
      timestamp: restWaitlistItem.timestamp ? dayjs(restWaitlistItem.timestamp) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestWaitlistItem>): HttpResponse<IWaitlistItem> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestWaitlistItem[]>): HttpResponse<IWaitlistItem[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}

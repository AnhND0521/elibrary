import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IWaitlistItem } from 'app/entities/waitlist-item/waitlist-item.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class WaitlistService {
  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  getByCurrentUser(params: any): Observable<HttpResponse<IWaitlistItem[]>> {
    const options = createRequestOption(params);
    return this.http.get<IWaitlistItem[]>(this.applicationConfigService.getEndpointFor('api/waitlist-items/my'), {
      params: options,
      observe: 'response',
    });
  }
}

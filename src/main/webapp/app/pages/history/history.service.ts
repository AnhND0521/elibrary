import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ICheckout } from 'app/entities/checkout/checkout.model';
import { IHold } from 'app/entities/hold/hold.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class HistoryService {
  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  getHolds(params: any = {}): Observable<HttpResponse<IHold[]>> {
    const options = createRequestOption(params);
    return this.http.get<IHold[]>(this.applicationConfigService.getEndpointFor('api/holds/my/current'), {
      params: options,
      observe: 'response',
    });
  }

  getCheckouts(params: any = {}): Observable<HttpResponse<ICheckout[]>> {
    const options = createRequestOption(params);
    return this.http.get<ICheckout[]>(this.applicationConfigService.getEndpointFor('api/checkouts/my'), {
      params: options,
      observe: 'response',
    });
  }
}

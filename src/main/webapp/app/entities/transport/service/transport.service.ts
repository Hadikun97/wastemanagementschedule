import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ITransport, NewTransport } from '../transport.model';

export type PartialUpdateTransport = Partial<ITransport> & Pick<ITransport, 'id'>;

export type EntityResponseType = HttpResponse<ITransport>;
export type EntityArrayResponseType = HttpResponse<ITransport[]>;

@Injectable({ providedIn: 'root' })
export class TransportService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/transports');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(transport: NewTransport): Observable<EntityResponseType> {
    return this.http.post<ITransport>(this.resourceUrl, transport, { observe: 'response' });
  }

  update(transport: ITransport): Observable<EntityResponseType> {
    return this.http.put<ITransport>(`${this.resourceUrl}/${this.getTransportIdentifier(transport)}`, transport, { observe: 'response' });
  }

  partialUpdate(transport: PartialUpdateTransport): Observable<EntityResponseType> {
    return this.http.patch<ITransport>(`${this.resourceUrl}/${this.getTransportIdentifier(transport)}`, transport, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ITransport>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ITransport[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getTransportIdentifier(transport: Pick<ITransport, 'id'>): number {
    return transport.id;
  }

  compareTransport(o1: Pick<ITransport, 'id'> | null, o2: Pick<ITransport, 'id'> | null): boolean {
    return o1 && o2 ? this.getTransportIdentifier(o1) === this.getTransportIdentifier(o2) : o1 === o2;
  }

  addTransportToCollectionIfMissing<Type extends Pick<ITransport, 'id'>>(
    transportCollection: Type[],
    ...transportsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const transports: Type[] = transportsToCheck.filter(isPresent);
    if (transports.length > 0) {
      const transportCollectionIdentifiers = transportCollection.map(transportItem => this.getTransportIdentifier(transportItem)!);
      const transportsToAdd = transports.filter(transportItem => {
        const transportIdentifier = this.getTransportIdentifier(transportItem);
        if (transportCollectionIdentifiers.includes(transportIdentifier)) {
          return false;
        }
        transportCollectionIdentifiers.push(transportIdentifier);
        return true;
      });
      return [...transportsToAdd, ...transportCollection];
    }
    return transportCollection;
  }
}

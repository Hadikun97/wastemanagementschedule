import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IOnDuty, NewOnDuty } from '../on-duty.model';

export type PartialUpdateOnDuty = Partial<IOnDuty> & Pick<IOnDuty, 'id'>;

export type EntityResponseType = HttpResponse<IOnDuty>;
export type EntityArrayResponseType = HttpResponse<IOnDuty[]>;

@Injectable({ providedIn: 'root' })
export class OnDutyService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/on-duties');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(onDuty: NewOnDuty): Observable<EntityResponseType> {
    return this.http.post<IOnDuty>(this.resourceUrl, onDuty, { observe: 'response' });
  }

  update(onDuty: IOnDuty): Observable<EntityResponseType> {
    return this.http.put<IOnDuty>(`${this.resourceUrl}/${this.getOnDutyIdentifier(onDuty)}`, onDuty, { observe: 'response' });
  }

  partialUpdate(onDuty: PartialUpdateOnDuty): Observable<EntityResponseType> {
    return this.http.patch<IOnDuty>(`${this.resourceUrl}/${this.getOnDutyIdentifier(onDuty)}`, onDuty, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IOnDuty>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IOnDuty[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getOnDutyIdentifier(onDuty: Pick<IOnDuty, 'id'>): number {
    return onDuty.id;
  }

  compareOnDuty(o1: Pick<IOnDuty, 'id'> | null, o2: Pick<IOnDuty, 'id'> | null): boolean {
    return o1 && o2 ? this.getOnDutyIdentifier(o1) === this.getOnDutyIdentifier(o2) : o1 === o2;
  }

  addOnDutyToCollectionIfMissing<Type extends Pick<IOnDuty, 'id'>>(
    onDutyCollection: Type[],
    ...onDutiesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const onDuties: Type[] = onDutiesToCheck.filter(isPresent);
    if (onDuties.length > 0) {
      const onDutyCollectionIdentifiers = onDutyCollection.map(onDutyItem => this.getOnDutyIdentifier(onDutyItem)!);
      const onDutiesToAdd = onDuties.filter(onDutyItem => {
        const onDutyIdentifier = this.getOnDutyIdentifier(onDutyItem);
        if (onDutyCollectionIdentifiers.includes(onDutyIdentifier)) {
          return false;
        }
        onDutyCollectionIdentifiers.push(onDutyIdentifier);
        return true;
      });
      return [...onDutiesToAdd, ...onDutyCollection];
    }
    return onDutyCollection;
  }
}
